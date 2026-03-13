from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from joblib import load
import mlflow.sklearn
import os
from typing import Dict, Any

# Initialize FastAPI app
app = FastAPI(
    title="Spam/Ham Email Classifier API",
    description="A simple API to classify emails as spam or ham using machine learning",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Railway deployment flexibility
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Load the trained model
try:
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    model_name = "SpamHamClassifier"
    model_version = 1
    model_uri = f"models:/{model_name}/{model_version}"
    print(f"Loading model from MLflow: {model_uri}")
    model = mlflow.sklearn.load_model(model_uri)
    print("Model loaded successfully from MLflow")
    MODEL_PATH = model_uri
except Exception as e:
    print(f"Error loading model from MLflow: {e}")
    model = None
    MODEL_PATH = None

# Pydantic model for request body
class EmailRequest(BaseModel):
    text: str

# Pydantic model for response
class EmailResponse(BaseModel):
    prediction: str
    probability: float
    confidence: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Spam/Ham Email Classifier API is running!",
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH if model else None
    }

@app.post("/classify", response_model=EmailResponse)
async def classify_email(request: EmailRequest):
    """
    Classify an email as spam or ham

    - **text**: The email text to classify
    """
    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please check if the model file exists."
        )

    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Email text cannot be empty"
        )

    try:
        # Make prediction
        prediction_proba = model.predict_proba([request.text])[0]
        prediction_num = model.predict([request.text])[0]

        # Convert to labels
        prediction_label = "spam" if prediction_num == 1 else "ham"
        spam_probability = float(prediction_proba[1])  # Probability of spam

        # Determine confidence level
        confidence = "high" if spam_probability > 0.8 or spam_probability < 0.2 else "medium"

        return EmailResponse(
            prediction=prediction_label,
            probability=spam_probability,
            confidence=confidence
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during prediction: {str(e)}"
        )

@app.post("/classify-batch")
async def classify_emails_batch(requests: list[EmailRequest]):
    """
    Classify multiple emails at once

    - **requests**: List of email texts to classify
    """
    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please check if the model file exists."
        )

    if not requests:
        raise HTTPException(
            status_code=400,
            detail="Request list cannot be empty"
        )

    try:
        texts = [req.text for req in requests if req.text.strip()]

        if not texts:
            raise HTTPException(
                status_code=400,
                detail="No valid email texts provided"
            )

        # Make batch predictions
        predictions_proba = model.predict_proba(texts)
        predictions_num = model.predict(texts)

        results = []
        for i, text in enumerate(texts):
            prediction_label = "spam" if predictions_num[i] == 1 else "ham"
            spam_probability = float(predictions_proba[i][1])
            confidence = "high" if spam_probability > 0.8 or spam_probability < 0.2 else "medium"

            results.append({
                "text": text,
                "prediction": prediction_label,
                "probability": spam_probability,
                "confidence": confidence
            })

        return {
            "total_emails": len(results),
            "results": results
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during batch prediction: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    import os

    # Get port from environment variable or default to 8000
    port = int(os.environ.get("PORT", 8000))
    # Ensure we bind to 0.0.0.0 for deployment compatibility
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)
