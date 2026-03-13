import { useRef, useState } from "react";
import {
  Layers,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";
import { emailAPI } from "../services/api";

const BatchClassifier = () => {
  const [emails, setEmails] = useState([""]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const parseCsvTextToEmails = (csvText) => {
    // Normalize newlines and split
    const lines = csvText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];

    // Detect header: if first line contains 'text' or more than 1 column
    const firstCols = lines[0].split(",");
    const hasHeader = firstCols.some((c) => c.trim().toLowerCase() === "text");

    const startIdx = hasHeader ? 1 : 0;
    const extracted = [];
    for (let i = startIdx; i < lines.length; i++) {
      const raw = lines[i];
      // Basic CSV handling for quoted commas
      const cells = [];
      let current = "";
      let inQuotes = false;
      for (let j = 0; j < raw.length; j++) {
        const ch = raw[j];
        if (ch === '"') {
          // Toggle quotes or handle escaped quotes
          if (inQuotes && raw[j + 1] === '"') {
            current += '"';
            j++; // skip escaped quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          cells.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      cells.push(current);

      // Prefer column named 'text', else take first column
      let textCell = "";
      if (hasHeader) {
        const headerMap = firstCols.map((c) => c.trim().toLowerCase());
        const textIdx = headerMap.indexOf("text");
        textCell = cells[textIdx >= 0 ? textIdx : 0] || "";
      } else {
        textCell = cells[0] || "";
      }
      const cleaned = textCell.trim();
      if (cleaned.length > 0) extracted.push(cleaned);
    }
    return extracted;
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setResults([]);
      const text = await file.text();
      const parsedEmails = parseCsvTextToEmails(text);
      if (parsedEmails.length === 0) {
        setError(
          "No valid rows found in CSV. Ensure there's a 'text' column or text in the first column."
        );
        setLoading(false);
        return;
      }
      setEmails(parsedEmails);
      // Auto-classify immediately after upload
      const data = await emailAPI.classifyBatch(parsedEmails);
      setResults(data.results);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to process CSV. Please try again."
      );
    } finally {
      setLoading(false);
      // reset input so same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerCsvSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const downloadSampleCsv = () => {
    const sample = [
      "text",
      '"Congratulations! You have won a $1000 Walmart gift card. Click now to claim your prize!"',
      '"Hi John, just wanted to follow up on our meeting yesterday. Can we schedule a call for next week?"',
      '"URGENT: Your account will be suspended if you don\'t verify your information immediately!"',
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_emails.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const clearAll = () => {
    setEmails([""]);
    setResults([]);
    setError("");
  };

  const classifyBatch = async () => {
    const validEmails = emails.filter((email) => email.trim());

    if (validEmails.length === 0) {
      setError("Please enter at least one email");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await emailAPI.classifyBatch(validEmails);
      setResults(data.results);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to classify emails. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (results.length === 0) return;

    const csvContent = [
      "Email Text,Prediction,Spam Probability,Confidence",
      ...results.map(
        (result) =>
          `"${result.text.replace(/"/g, '""')}",${result.prediction},${
            result.probability
          },${result.confidence}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-classification-results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
          <Layers className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Batch Email Classifier
        </h1>
        <p className="text-gray-600 text-lg">
          Classify multiple emails at once for efficient processing
        </p>
      </div>

      {/* Email Input Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Email Texts
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={addEmailField}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Email</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder={`Email ${index + 1}...`}
                      className="w-full h-20 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
                      className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-gray-600">
                {emails.filter((email) => email.trim()).length} emails ready for
                classification
              </span>
              <div className="flex space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleCsvUpload}
                />
                <button
                  onClick={triggerCsvSelect}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload CSV</span>
                </button>
                <button
                  onClick={downloadSampleCsv}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Sample CSV</span>
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={classifyBatch}
                  disabled={
                    loading ||
                    emails.filter((email) => email.trim()).length === 0
                  }
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{loading ? "Classifying..." : "Classify Batch"}</span>
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

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Classification Results ({results.length} emails)
              </h3>
            </div>
            <button
              onClick={downloadResults}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Prediction
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Spam %
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="max-w-xs truncate text-sm text-gray-700"
                          title={result.text}
                        >
                          {result.text}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.prediction === "spam"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {result.prediction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {(result.probability * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.confidence === "high"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {result.confidence.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Emails</div>
              <div className="text-2xl font-bold text-gray-900">
                {results.length}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Spam Detected</div>
              <div className="text-2xl font-bold text-red-600">
                {results.filter((r) => r.prediction === "spam").length}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Ham Detected</div>
              <div className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.prediction === "ham").length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchClassifier;
