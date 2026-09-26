import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

interface TaskSummary {
    id: number;
    title: string;
    team_id: number;
    frequency: string;
    interval_hours: number;
    latest_status: string;
    latest_due_date?: string;
    latest_instance_id?: number | null;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-8">
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="h-8 w-72 mb-2" />
                <Skeleton className="h-4 w-56 mb-8" />
                <div className="space-y-3">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) return <p className="text-red-600 p-8">{error}</p>;
    if (!checklist) return <p className="p-8">No checklist found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <nav className="text-sm text-slate-500 mb-4">
                <Link to="/checklists" className="hover:text-brand-600">Checklists</Link>
                <span className="mx-2">/</span>
                <span className="text-ink-900">{checklist.title}</span>
            </nav>

            <PageHeader
                title={checklist.title}
                subtitle={`Created by ${checklist.created_by_name} on ${new Date(
                    checklist.created_at
                ).toLocaleDateString()}`}
            />

            {checklist.tasks.length === 0 ? (
                <EmptyState
                    icon="🗒️"
                    title="No tasks in this checklist yet"
                    description="Add a task to start assigning recurring work to a team."
                    actionLabel="Add Task"
                    onAction={() => navigate("/tasks/new")}
                />
            ) : (
                <div className="space-y-3">
                    {checklist.tasks.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => {
                                if (t.latest_instance_id) {
                                    navigate(`/task-instances/${t.latest_instance_id}`);
                                }
                            }}
                            className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between transition-shadow ${t.latest_instance_id
                                ? "cursor-pointer hover:shadow-md"
                                : "opacity-60"
                                }`}
                        >
                            <div>
                                <h3 className="font-heading text-base font-semibold text-ink-900">
                                    {t.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Team #{t.team_id} · {t.frequency}
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 mb-1">Due</p>
                                    <p className="text-sm text-ink-900">
                                        {t.latest_due_date
                                            ? new Date(t.latest_due_date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "—"}
                                    </p>
                                </div>
                                <StatusBadge status={t.latest_status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}