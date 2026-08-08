import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api";

export default function TeamTaskDetail() {
    const { taskId } = useParams(); // this is actually the instance_id
    const navigate = useNavigate();
    const [completing, setCompleting] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleComplete = async () => {
        setCompleting(true);
        setError("");
        try {
            await apiFetch(`/task-instances/${taskId}/complete`, { method: "POST" });
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete task");
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-bold text-slate-800 mb-2">Task Instance #{taskId}</h1>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {done ? (
                    <p className="text-green-600 font-medium">✅ Task marked complete!</p>
                ) : (
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {completing ? "Completing..." : "Mark Complete"}
                    </button>
                )}
            </div>
        </div>
    );
}