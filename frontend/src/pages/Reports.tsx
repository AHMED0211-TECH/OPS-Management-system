import StatCard from "../components/StatCard";
import { stats } from "../data/mockData";

export default function Reports() {
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
                    value={stats.total}
                />

                <StatCard
                    title="Completed"
                    value={stats.completed}
                />

                <StatCard
                    title="Pending"
                    value={stats.pending}
                />

                <StatCard
                    title="Locked"
                    value={stats.locked}
                />

            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">

                <h2 className="text-xl font-semibold mb-3">
                    Completion Rate
                </h2>

                <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: "75%" }}
                    />

                </div>

                <p className="mt-3 text-gray-600">
                    75% of all scheduled tasks have been completed.
                </p>

            </div>

        </div>
    );
}