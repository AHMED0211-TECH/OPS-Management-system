import { tasks } from "../data/mockData";

export default function OverdueTasks() {
    const overdueTasks = tasks.filter(
        (task) => task.status === "Locked"
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Overdue Tasks</h1>
                <p className="text-gray-500">
                    View all overdue and locked tasks.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">

                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left px-6 py-4">Task</th>
                            <th className="text-left px-6 py-4">Team</th>
                            <th className="text-left px-6 py-4">Due Date</th>
                            <th className="text-left px-6 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {overdueTasks.map((task) => (
                            <tr key={task.id} className="border-t">

                                <td className="px-6 py-4">{task.title}</td>

                                <td className="px-6 py-4">{task.team}</td>

                                <td className="px-6 py-4">{task.dueDate}</td>

                                <td className="px-6 py-4">
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                        Locked
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