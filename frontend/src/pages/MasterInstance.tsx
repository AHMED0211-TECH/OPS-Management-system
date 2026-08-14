import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import StatusBadge from "../components/StatusBadge";

interface InstanceDetail {
    id: number;
    task_id: number;
    title: string;
    checklist_id: number;
    team_name: string;
    frequency: string;
    status: string;
    due_date: string;
    completed_at: string | null;
    notes: string | null;
    image_urls: string[];
}

export default function ManagerInstanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instance, setInstance] = useState<InstanceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch(`/task-instances/${id}`)
            .then((data) => setInstance(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!instance) return <p>No task instance found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="text-2xl font-bold">{instance.title}</h1>
                    <StatusBadge status={instance.status} />
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-700 mb-6">
                    <p className="font-medium">Team</p>
                    <p>{instance.team_name}</p>

                    <p className="font-medium">Frequency</p>
                    <p>{instance.frequency}</p>

                    <p className="font-medium">Due Date</p>
                    <p>
                        {new Date(instance.due_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>

                    <p className="font-medium">Completed At</p>
                    <p>
                        {instance.completed_at
                            ? new Date(instance.completed_at).toLocaleString()
                            : "—"}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Notes</h2>
                    {instance.notes ? (
                        <p className="bg-slate-50 border rounded p-3 whitespace-pre-wrap">
                            {instance.notes}
                        </p>
                    ) : (
                        <p className="text-slate-400 italic">No notes submitted.</p>
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Images</h2>
                    {instance.image_urls && instance.image_urls.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {instance.image_urls.map((url, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block border rounded overflow-hidden hover:opacity-80"
                                >
                                    <img
                                        src={url}
                                        alt={`Task evidence ${idx + 1}`}
                                        className="w-full h-24 object-cover"
                                    />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic">No images uploaded.</p>
                    )}
                </div>
            </div>
        </div>
    );
}