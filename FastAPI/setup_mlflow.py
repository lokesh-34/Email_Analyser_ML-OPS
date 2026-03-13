import mlflow
import mlflow.sklearn
from joblib import load

MODEL_PATH = "spam_ham_model.pkl"

def setup_mlflow():
    # Load the existing model
    print(f"Loading existing model from {MODEL_PATH}...")
    try:
        model = load(MODEL_PATH)
    except Exception as e:
        print(f"Failed to load standard: {e}")
        import pickle
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f, buffers=None)
            
    # Set the tracking URI to a local directory
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    mlflow.set_experiment("email_analyzer_experiment")
    
    with mlflow.start_run(run_name="initial_model_logging"):
        # Log parameters (dummy for now since we just loaded a pre-trained model)
        mlflow.log_param("model_type", "sklearn_pipeline")
        mlflow.log_param("data_source", "sample_emails.csv")
        
        # Log the model
        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="model",
            registered_model_name="SpamHamClassifier"
        )
        print("Model successfully logged and registered in MLflow.")

if __name__ == "__main__":
    setup_mlflow()
