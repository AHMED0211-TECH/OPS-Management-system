import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

interface Task {
    id: number;
    title: string;
    checklist_id: number;
    team_id: number;
    frequency: string;
    interval_hours: number | null;
}

const teamNames: Record<number, string> = {
    1: "Security",
    2: "Operations",
    3: "Maintenance",
};

export default function Tasks() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [generating, setGenerating] = useState(false);

    const loadTasks = () => {
        apiFetch("/tasks")
            .then((data) => setTasks(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await apiFetch("/generate-tasks", { method: "POST" });
            alert(result.message);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to generate tasks");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-56 mb-6" />
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
                title="Tasks"
                subtitle="Manage all operational tasks."
                actionLabel="+ Create Task"
                onAction={() => navigate("/tasks/new")}
                secondaryLabel={generating ? "Generating..." : "🔄 Generate Today's Tasks"}
                onSecondaryAction={handleGenerate}
                secondaryDisabled={generating}
            />

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                </div>
            )}

            {tasks.length === 0 && !error ? (
                <EmptyState
                    icon="✅"
                    title="No tasks yet"
                    description="Create a task within a checklist to start assigning recurring work."
                    actionLabel="+ Create Task"
                    onAction={() => navigate("/tasks/new")}
                />
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between"
                        >
                            <h3 className="font-heading text-base font-semibold text-ink-900">
                                {task.title}
                            </h3>
                            <div className="flex items-center gap-6 text-sm text-slate-600">
                                <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                                    {teamNames[task.team_id] ?? "Unknown"}
                                </span>
                                <span className="capitalize">
                                    {task.frequency}
                                    {task.frequency === "every_x_hours" && task.interval_hours
                                        ? ` (${task.interval_hours}h)`
                                        : ""}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}