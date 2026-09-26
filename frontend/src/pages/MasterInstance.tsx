import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import StatusBadge from "../components/StatusBadge";
import Skeleton from "../components/Skeleton";

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
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

    useEffect(() => {
        apiFetch(`/task-instances/${id}`)
            .then((data) => setInstance(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-8">
                <Skeleton className="h-4 w-16 mb-4" />
                <Skeleton className="h-64 w-full max-w-2xl rounded-xl" />
            </div>
        );
    }
    if (error) return <p className="text-red-600 p-8">{error}</p>;
    if (!instance) return <p className="p-8">No task instance found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-sm text-brand-600 hover:text-brand-700 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="font-heading text-xl font-semibold text-ink-900">{instance.title}</h1>
                    <StatusBadge status={instance.status} />
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-700 mb-6">
                    <p className="font-medium">Team</p>
                    <p>{instance.team_name}</p>

                    <p className="font-medium">Frequency</p>
                    <p className="capitalize">{instance.frequency}</p>

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

                <div className="border-t border-slate-100 pt-6 mb-6">
                    <h2 className="text-sm font-semibold text-ink-900 mb-2">Notes</h2>
                    {instance.notes ? (
                        <p className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm whitespace-pre-wrap">
                            {instance.notes}
                        </p>
                    ) : (
                        <p className="text-slate-400 italic text-sm">No notes submitted.</p>
                    )}
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h2 className="text-sm font-semibold text-ink-900 mb-2">Images</h2>
                    {instance.image_urls && instance.image_urls.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {instance.image_urls.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxUrl(url)}
                                    className="block border border-slate-200 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                                >
                                    <img
                                        src={url}
                                        alt={`Task evidence ${idx + 1}`}
                                        className="w-full h-24 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic text-sm">No images uploaded.</p>
                    )}
                </div>
            </div>

            {lightboxUrl && (
                <div
                    onClick={() => setLightboxUrl(null)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50 cursor-zoom-out"
                >
                    <img
                        src={lightboxUrl}
                        alt="Task evidence full size"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                    <button
                        onClick={() => setLightboxUrl(null)}
                        className="absolute top-6 right-6 text-white text-3xl leading-none hover:text-slate-300"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}