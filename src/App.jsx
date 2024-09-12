import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorkflowBuilder from "./components/WorkflowBuilder";
import UploadAndRunWorkflow from "./components/UploadAndRunWorkflow";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WorkflowBuilder />} />
          <Route path="/upload-run" element={<UploadAndRunWorkflow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
