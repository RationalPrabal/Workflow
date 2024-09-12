import axios from "axios";
import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
// Define types for the custom nodes
const nodeTypes = {
  filterData: ({ data }) => (
    <div style={{ padding: 10, backgroundColor: "#e3f7e3" }}>
      <strong>{data.label}</strong>
      <br />
      <input
        placeholder="Column Name"
        onChange={(e) => data.onInputChange(e.target.value)}
      />
    </div>
  ),
  wait: ({ data }) => (
    <div style={{ padding: 10, backgroundColor: "#f3e3e3" }}>
      <strong>{data.label}</strong>
      <br />
    </div>
  ),
  convertFormat: ({ data }) => (
    <div style={{ padding: 10, backgroundColor: "#e3e3f7" }}>
      <strong>{data.label}</strong>
      <br />
      <p>Converts CSV to JSON</p>
    </div>
  ),
  sendPost: ({ data }) => (
    <div style={{ padding: 10, backgroundColor: "#f7e3e3" }}>
      <strong>{data.label}</strong>
      <br />
      <input
        placeholder="API URL"
        onChange={(e) => data.onInputChange(e.target.value)}
      />
    </div>
  ),
};

const initialElements = [];

const WorkflowBuilder = () => {
  const [nodes, setNodes] = useState(initialElements);
  const [edges, setEdges] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const nav = useNavigate();
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Function to add new node to the flow
  const addNode = (type) => {
    const id = `${type}-${nodes.length + 1}`;
    let newNode = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `${type}`,
        onInputChange: (value) => console.log(`${type} Input: `, value), // Placeholder for input handling
      },
      type: type.toLowerCase().replace(" ", ""), // Custom node type
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Function to save the current workflow
  const saveWorkflow = async () => {
    const workflow = { nodes, edges };
    try {
      // Make a POST request to save the workflow
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/save-workflows`,
        workflow
      );
      const workflowId = response.data._id;
      setCurrentId(workflowId); // Set the current ID to MongoDB's _id
      alert(`Workflow saved with ID: ${workflowId}`);
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert("Failed to save workflow");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => addNode("Filter Data")}>Filter Data</button>
        <button onClick={() => addNode("Do Wait")}>Wait</button>
        <button onClick={() => addNode("Convert Format")}>
          Convert Format
        </button>
        <button onClick={() => addNode("Send POST Request")}>
          POST Request
        </button>
        <button onClick={saveWorkflow}>Save Workflow</button>
        <button onClick={() => nav("upload-run")}>Run Workflow</button>
      </div>
      <div style={{ height: 600, width: "150%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes} // Registering the custom nodes
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {currentId && <p>Current Workflow ID: {currentId}</p>}
    </div>
  );
};

export default WorkflowBuilder;
