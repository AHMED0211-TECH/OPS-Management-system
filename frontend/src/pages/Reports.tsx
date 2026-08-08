import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
//import { stats } from "../data/mockData";
import { apiFetch } from "../api";

interface ReportSummary {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    //locked: number;
}

export default function Reports() {
    const [stats, setStats] = useState<ReportSummary | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/reports/summary")
            .then((data) => setStats(data))
            .catch((err) => setError(err.message))
    }, []);

    const completionRate = stats && stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;
    return (
        <div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Reports
                </h1>

                <p className="text-gray-500">
                    Operations performance summary.
                </p>
            </div>

            <div className="grid grid-cols-4 gap-6">

                <StatCard
                    title="Total Tasks"
                    value={stats?.total ?? "..."}
                />

                <StatCard
                    title="Completed"
                    value={stats?.completed ?? "..."}
                />

                <StatCard
                    title="Pending"
                    value={stats?.pending ?? "..."}
                />

                <StatCard
                    title="Overdue"
                    value={stats?.overdue ?? "..."}
                />


            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">

                <h2 className="text-xl font-semibold mb-3">
                    Completion Rate
                </h2>

                <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${completionRate}%` }}
                    />

                </div>

                <p className="mt-3 text-gray-600">
                    {completionRate}% of all scheduled tasks have been completed.
                </p>

            </div>

        </div>
    );
}