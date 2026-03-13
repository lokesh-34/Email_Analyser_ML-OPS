import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Classifier from "./components/Classifier";
import BatchClassifier from "./components/BatchClassifier";
import About from "./components/About";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classify" element={<Classifier />} />
          <Route path="/batch" element={<BatchClassifier />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
