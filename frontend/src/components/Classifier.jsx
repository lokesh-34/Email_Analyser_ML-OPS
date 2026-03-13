import { useState } from "react";
import {
  Mail,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { emailAPI } from "../services/api";

const Classifier = () => {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const classifyEmail = async () => {
    if (!emailText.trim()) {
      setError("Please enter some email text");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await emailAPI.classifyEmail(emailText);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to classify email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setEmailText("");
    setResult(null);
    setError("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sampleEmails = [
    "Congratulations! You have won a $1000 Walmart gift card. Click now to claim your prize!",
    "Hi John, just wanted to follow up on our meeting yesterday. Can we schedule a call for next week?",
    "URGENT: Your account will be suspended if you don't verify your information immediately!",
    "Thanks for your purchase! Your order #12345 has been shipped and will arrive tomorrow.",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Email Classifier</h1>
        <p className="text-gray-600 text-lg">
          Paste any email text below to classify it as spam or legitimate
        </p>
      </div>

      {/* Sample Emails */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Try these sample emails:
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {sampleEmails.map((sample, index) => (
            <button
              key={index}
              onClick={() => setEmailText(sample)}
              className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <p className="text-sm text-gray-700 line-clamp-2">{sample}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="email-text"
                className="text-lg font-semibold text-gray-900"
              >
                Email Text
              </label>
              <button
                onClick={() => copyToClipboard(emailText)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Copy text"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <textarea
              id="email-text"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste your email text here..."
              className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {emailText.length} characters
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Clear</span>
                </button>
                <button
                  onClick={classifyEmail}
                  disabled={loading || !emailText.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{loading ? "Classifying..." : "Classify"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Classification Result
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Prediction</div>
                <div
                  className={`text-2xl font-bold ${
                    result.prediction === "spam"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {result.prediction.toUpperCase()}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">
                  Spam Probability
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {(result.probability * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Confidence</div>
                <div
                  className={`text-2xl font-bold ${
                    result.confidence === "high"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {result.confidence.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Visual Indicator */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Spam Probability
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {(result.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    result.probability > 0.5 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${result.probability * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-green-600 font-medium">
                  LEGITIMATE
                </span>
                <span className="text-xs text-red-600 font-medium">SPAM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classifier;
