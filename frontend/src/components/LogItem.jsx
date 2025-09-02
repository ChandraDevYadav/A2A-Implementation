import React from "react";

export default function LogItem({ log }) {
  return (
    <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 shadow">
      <p className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</p>
      <p className="text-lg font-medium">{log.type}</p>
      {log.data && (
        <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
          {JSON.stringify(log.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
