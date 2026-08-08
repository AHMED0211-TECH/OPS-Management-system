import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";


interface MyTask {
    instance_id: number;
    task_id: number;
    title: string;
    frequency: string;
    status: string;
    due_date: string;
}

export default function TeamDashboard() {
    const [tasks, setTasks] = useState<MyTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [completingId, setCompletingId] = useState<number | null>(null);
    const navigate = useNavigate();


    const loadTasks = () => {
        setLoading(true);
        apiFetch("/my-tasks")
            .then((data) => setTasks(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleComplete = async (taskId: number) => {
        setCompletingId(taskId);
        try {
            // Note: this completes a TASK's latest instance in a real flow,
            // for now we assume task.id maps to a known instance for demo purposes
            await apiFetch(`/task-instances/${taskId}/complete`, { method: "POST" });
            loadTasks();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to complete task");
        } finally {
            setCompletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">
                My Team's Tasks
            </h1>

            {loading && <p className="text-gray-500">Loading tasks...</p>}

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                </div>
            )}

            {!loading && !error && tasks.length === 0 && (
                <p className="text-gray-500">No tasks assigned to your team yet.</p>
            )}

            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.instance_id}
                        onClick={() => navigate(`/team/tasks/${task.instance_id}`)}
                        className="bg-white rounded-lg shadow p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition"
                    >
                        <div>
                            <h2 className="font-semibold text-slate-800">{task.title}</h2>
                            <p className="text-sm text-gray-500">Frequency: {task.frequency}</p>
                        </div>

                        {task.status === "completed" ? (
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                                ✅ Completed
                            </span>
                        ) : task.status === "locked" ? (
                            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                                🔒 Locked
                            </span>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleComplete(task.instance_id);
                                }}
                                disabled={completingId === task.instance_id}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
                            >
                                {completingId === task.instance_id ? "Completing..." : "Mark Complete"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}