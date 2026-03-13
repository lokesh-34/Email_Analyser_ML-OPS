import { Shield, Brain, Zap, Target, BarChart3, Clock } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description:
        "Our machine learning model uses advanced algorithms trained on thousands of emails to accurately distinguish between spam and legitimate messages.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Target,
      title: "High Accuracy",
      description:
        "Achieving 99%+ accuracy in spam detection with minimal false positives, ensuring your legitimate emails are never misclassified.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get instant results with our optimized model that processes emails in milliseconds, perfect for real-time classification.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: BarChart3,
      title: "Batch Processing",
      description:
        "Efficiently process multiple emails at once with our batch classification feature, ideal for bulk email analysis.",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const stats = [
    { label: "Training Emails", value: "5,171", icon: Brain },
    { label: "Accuracy Rate", value: "99.03%", icon: Target },
    { label: "Response Time", value: "< 1s", icon: Clock },
    { label: "F1 Score", value: "98.33%", icon: BarChart3 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-xl mb-6">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">About SpamGuard</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          SpamGuard is an advanced AI-powered email classification system that
          helps you distinguish between spam and legitimate emails with
          unprecedented accuracy.
        </p>
      </div>

      {/* Model Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Our Technology
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Machine Learning Model
              </h3>
              <p className="text-gray-600">
                Our system uses a sophisticated combination of TF-IDF (Term
                Frequency-Inverse Document Frequency) vectorization and Logistic
                Regression to analyze email content. This approach allows us to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Extract meaningful features from email text</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Identify patterns that distinguish spam from legitimate
                    emails
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Provide confidence scores for each prediction</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Model Specifications
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Algorithm:</span>
                  <span className="text-gray-900 font-medium">
                    Logistic Regression
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vectorization:</span>
                  <span className="text-gray-900 font-medium">
                    TF-IDF (1-2 grams)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Features:</span>
                  <span className="text-gray-900 font-medium">50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stop Words:</span>
                  <span className="text-gray-900 font-medium">English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 ${
                    feature.color.split(" ")[0]
                  } rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${feature.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Stats */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Performance Metrics
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Input Processing
              </h3>
              <p className="text-gray-600">
                Your email text is processed and cleaned, removing unnecessary
                characters and normalizing the content.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Feature Extraction
              </h3>
              <p className="text-gray-600">
                The text is converted into numerical features using TF-IDF
                vectorization, capturing the importance of words.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Classification
              </h3>
              <p className="text-gray-600">
                Our trained model analyzes the features and provides a
                prediction with confidence scores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            API Integration
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                RESTful API
              </h3>
              <p className="text-gray-600">
                SpamGuard provides a simple RESTful API that you can integrate
                into your applications. Built with FastAPI for high performance
                and automatic documentation.
              </p>
              <div className="space-y-2">
                <div className="text-sm text-gray-700 font-medium">
                  Available Endpoints:
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    •{" "}
                    <code className="bg-white px-2 py-1 rounded border">
                      POST /classify
                    </code>{" "}
                    - Single email classification
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-white px-2 py-1 rounded border">
                      POST /classify-batch
                    </code>{" "}
                    - Batch email processing
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-white px-2 py-1 rounded border">
                      GET /health
                    </code>{" "}
                    - Health check
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Example Request
              </h4>
              <pre className="text-sm text-gray-700 bg-gray-50 rounded p-4 overflow-x-auto border">
                {`{
  "text": "Your email content here..."
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
