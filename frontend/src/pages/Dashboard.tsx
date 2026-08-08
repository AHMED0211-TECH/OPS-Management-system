import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { tasks } from "../data/mockData"; // keeping mock for Recent Tasks table for now
import { apiFetch } from "../api";

interface ReportSummary {
    completed: number;
    pending: number;
    overdue: number;
    total: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<ReportSummary | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/reports/summary")
            .then((data) => setStats(data))
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
                Welcome back! Here's today's operations summary.
            </p>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg my-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Tasks" value={stats?.total ?? "..."} />
                <StatCard title="Completed" value={stats?.completed ?? "..."} />
                <StatCard title="Pending" value={stats?.pending ?? "..."} />
                <StatCard title="Overdue" value={stats?.overdue ?? "..."} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold mb-4">
                        Recent Tasks
                    </h2>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="text-left px-6 py-4">Task</th>
                            <th className="text-left px-6 py-4">Team</th>
                            <th className="text-left px-6 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-t hover:bg-slate-50">
                                <td className="px-6 py-4">{task.title}</td>
                                <td className="px-6 py-4">{task.team}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm
                            ${task.status === "Completed"
                                                ? "bg-green-100 text-green-700"
                                                : task.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}