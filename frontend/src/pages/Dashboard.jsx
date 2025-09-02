import useGatewayLogs from "../hooks/useGatewayLogs";

export default function Dashboard() {
  const logs = useGatewayLogs();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Workflow Logs</h1>

      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className="flex justify-between p-2 border-b last:border-none"
          >
            <span className="font-medium">{log.agent}</span>
            <span className="text-green-600">{log.status}</span>
            <span className="text-gray-500 text-sm">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
