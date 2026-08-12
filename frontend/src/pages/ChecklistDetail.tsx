import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import StatusBadge from "../components/StatusBadge";

interface TaskSummary {
    id: number;
    title: string;
    team_id: number;
    frequency: string;
    interval_hours: number;
    latest_status: string;
    latest_due_date?: string;
}

interface ChecklistDetail {
    id: number;
    title: string;
    created_by_name: string;
    created_at: string;
    tasks: TaskSummary[];
}

export default function ChecklistDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState<ChecklistDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch(`/checklists/${id}`)
            .then((data) => setChecklist(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!checklist) return <p>No checklist found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2">{checklist.title}</h1>
                <p>Created By: {checklist.created_by_name}</p>
                <p>Created At: {new Date(checklist.created_at).toLocaleDateString()}</p>

                <h2 className="text-lg font-semibold mt-6 mb-2">Tasks</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Frequency</th>
                            <th className="px-4 py-2 text-left">Team</th>
                            <th className="px-4 py-2 text-left">Latest Status</th>
                            <th className="px-4 py-2 text-left">Latest Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checklist.tasks.map((t) => (
                            <tr key={t.id} className="border-t">
                                <td className="px-4 py-2">{t.title}</td>
                                <td className="px-4 py-2">{t.frequency}</td>
                                <td className="px-4 py-2">Team #{t.team_id}</td>
                                <td className="px-4 py-2">
                                    <StatusBadge status={t.latest_status} /></td>
                                <td className="px-4 py-2">
                                    {t.latest_due_date
                                        ? new Date(t.latest_due_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
