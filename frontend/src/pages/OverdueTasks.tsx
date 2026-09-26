import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

interface OverdueTask {
    task_instance_id: number;
    task_title: string;
    team_id: number;
    due_date: string;
    status: string;
}

const teamNames: Record<number, string> = {
    1: "Security",
    2: "Operations",
    3: "Maintenance",
};

export default function OverdueTasks() {
    const navigate = useNavigate();
    const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/manager/overdue-tasks")
            .then((data) => setOverdueTasks(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div>
                <Skeleton className="h-8 w-56 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />
                <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Overdue Tasks"
                subtitle="View all overdue and locked tasks."
            />

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                </div>
            )}

            {overdueTasks.length === 0 && !error ? (
                <EmptyState
                    icon="🎉"
                    title="Nothing overdue"
                    description="All tasks across your teams are on track. Nice work."
                />
            ) : (
                <div className="space-y-3">
                    {overdueTasks.map((task) => (
                        <div
                            key={task.task_instance_id}
                            onClick={() => navigate(`/task-instances/${task.task_instance_id}`)}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="font-heading text-base font-semibold text-ink-900">
                                    {task.task_title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {teamNames[task.team_id] || `Team ${task.team_id}`} · Due {task.due_date}
                                </p>
                            </div>
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                Locked
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}