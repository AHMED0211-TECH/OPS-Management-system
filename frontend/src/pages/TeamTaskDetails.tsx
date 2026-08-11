import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api";

interface TaskDetails {
    id: number;
    task_id: number;
    title: string;
    checklist_id: number;
    team_id: number;
    frequency: string;
    status: string;
    due_date: string;
    completed_at?: string;
}


export default function TeamTaskDetail() {
    const { taskId } = useParams(); // this is actually the instance_id
    const navigate = useNavigate();
    const [completing, setCompleting] = useState(false);
    const [task, setTask] = useState<TaskDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //const [done, setDone] = useState(false);

    useEffect(() => {
        apiFetch(`/task-instances/${taskId}`)
            .then((data) => setTask(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [taskId]);

    const handleComplete = async () => {
        setCompleting(true);
        setError("");
        try {
            await apiFetch(`/task-instances/${taskId}/complete`, { method: "POST" });
            setTask((prev) => prev ? { ...prev, status: "completed", completed_at: new Date().toISOString() } : prev);
            // setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete task");
        } finally {
            setCompleting(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!task) return <p>No task found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-bold text-slate-800 mb-2">{task.title}</h1>
                <p>Status: {task.status}</p>
                <p>Due Date: {task.due_date}</p>
                <p>Frequency: {task.frequency} </p>
                {task.completed_at && <p>Completed At: {task.completed_at}</p>}
                <p>Task ID: {task.task_id}</p>
                <p>Checklist ID: {task.checklist_id}</p>
                <p>Team ID: {task.team_id}</p>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {task.status !== "completed" && (
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {completing ? "Completing..." : "Mark Complete"}
                    </button>
                )}
            </div>
        </div>
    );
}