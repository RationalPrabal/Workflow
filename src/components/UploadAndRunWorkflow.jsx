import axios from "axios";
import { useState, useEffect } from "react";

const UploadAndRunWorkflow = () => {
  const [file, setFile] = useState(null);
  const [workflowId, setWorkflowId] = useState("");
  const [workflowIds, setWorkflowIds] = useState([]);

  // Fetch the workflow IDs from the backend on component mount
  useEffect(() => {
    const fetchWorkflowIds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/get-workflows`
        );
        const workflows = response.data;

        // Extract the _id fields and store them in the state
        const ids = workflows?.map((workflow) => workflow._id);
        setWorkflowIds(ids);
      } catch (error) {
        console.error("Error fetching workflow IDs:", error);
      }
    };

    fetchWorkflowIds();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleWorkflowIdChange = (event) => {
    setWorkflowId(event.target.value);
  };

  // Function to run the workflow on backend
  const handleRunWorkflow = async () => {
    if (!file || !workflowId) {
      alert("Please upload a file and select a workflow.");
      return;
    }

    const formData = new FormData();
    formData.append("workflowId", workflowId);
    formData.append("file", file);

    try {
      // Post workflow ID and file to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/run-workflow`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      alert(
        `Workflow executed successfully! Result: ${JSON.stringify(result)}`
      );
    } catch (error) {
      console.error("Error running workflow:", error);
      alert("Failed to run workflow.");
    }
  };

  return (
    <div>
      <h2>Upload File and Run Workflow</h2>

      <input type="file" onChange={handleFileChange} />
      <br />

      <select value={workflowId} onChange={handleWorkflowIdChange}>
        <option value="">Select Workflow ID</option>
        {workflowIds?.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <br />

      <button onClick={handleRunWorkflow}>Run Workflow</button>
    </div>
  );
};

export default UploadAndRunWorkflow;
