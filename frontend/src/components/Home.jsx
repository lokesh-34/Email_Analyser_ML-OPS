import { Link } from "react-router-dom";
import {
  Mail,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Mail,
      title: "Single Email Classification",
      description:
        "Classify individual emails as spam or ham with high accuracy and detailed confidence scores.",
      link: "/classify",
    },
    {
      icon: BarChart3,
      title: "Batch Processing",
      description:
        "Process multiple emails at once for efficient analysis with CSV export capabilities.",
      link: "/batch",
    },
    {
      icon: Shield,
      title: "AI-Powered Detection",
      description:
        "Advanced machine learning model trained on thousands of emails for superior accuracy.",
      link: "/about",
    },
  ];

  const stats = [
    {
      icon: CheckCircle,
      value: "99.03%",
      label: "Accuracy Rate",
      color: "text-green-600",
    },
    {
      icon: Users,
      value: "5,171",
      label: "Training Emails",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      value: "< 1s",
      label: "Response Time",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            SpamGuard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional AI-powered email classification system. Detect spam and
            legitimate emails instantly with our advanced machine learning
            model.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/classify">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg flex items-center space-x-2 shadow-lg hover:bg-blue-700 transition-colors duration-200">
              <Mail className="h-5 w-5" />
              <span>Start Classifying</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <Link to="/batch">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Batch Processing</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${stat.color
                    .replace("text-", "bg-")
                    .replace("-600", "-100")}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 rounded-xl p-12 text-center text-white">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Ready to protect your inbox?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get started with our professional AI-powered email classification
            system. Fast, accurate, and reliable spam detection for your
            business needs.
          </p>
          <Link to="/classify">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <Mail className="h-6 w-6" />
              <span>Try Now</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
