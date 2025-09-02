import React from "react";

export default function WorkflowStarter() {
  const startWorkflow = async () => {
    await fetch("http://localhost:4000/start-workflow", {
      method: "POST",
    });
  };

  return (
    <button
      onClick={startWorkflow}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
    >
      🚀 Start Workflow
    </button>
  );
}
