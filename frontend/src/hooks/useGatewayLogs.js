import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useGatewayLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("✅ Connected to Gateway WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        setLogs((prev) => [...prev, log]);

        // 🔔 Show toast on log event
        toast.success(`${log.agent} ${log.status} ✅`, { duration: 3000 });
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from Gateway WebSocket");
    };

    return () => ws.close();
  }, []);

  return logs;
}
