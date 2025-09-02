export default function AgentCard({ title, description, onRun }) {
  return (
    <div className="bg-white shadow p-4 rounded w-64">
      <h2 className="font-bold text-lg">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
      <button
        onClick={onRun}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run
      </button>
    </div>
  );
}
