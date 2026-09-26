import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

interface Checklist {
    id: number;
    title: string;
    created_by: number;
    created_by_name: string;
    created_at: string;
}

export default function Checklists() {
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    const loadChecklists = () => {
        apiFetch("/checklists")
            .then((data) => setChecklists(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadChecklists();
    }, []);

    const handleCreate = async () => {
        const title = prompt("Enter checklist title:");
        if (!title) return;

        setCreating(true);
        try {
            await apiFetch("/checklists", {
                method: "POST",
                body: JSON.stringify({ title }),
            });
            loadChecklists();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to create checklist");
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48 mb-6" />
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
                title="Master Checklists"
                subtitle="Manage operational checklists."
                actionLabel={creating ? "Creating..." : "+ New Checklist"}
                onAction={handleCreate}
            />

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                </div>
            )}

            {checklists.length === 0 && !error ? (
                <EmptyState
                    icon="📋"
                    title="No checklists yet"
                    description="Create your first checklist to start assigning recurring tasks to your teams."
                    actionLabel="+ New Checklist"
                    onAction={handleCreate}
                />
            ) : (
                <div className="space-y-3">
                    {checklists.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => navigate(`/checklists/${c.id}`)}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="font-heading text-base font-semibold text-ink-900">
                                    {c.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Created by{" "}
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                                        {c.created_by_name}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 mb-1">Created</p>
                                <p className="text-sm text-ink-900">
                                    {new Date(c.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}