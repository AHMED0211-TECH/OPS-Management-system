import { useEffect, useState } from "react";
//import { tasks } from "../data/mockData";
import { apiFetch } from "../api";

interface OverdueTasks {
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
    const [overdueTasks, setOverdueTasks] = useState<OverdueTasks[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/manager/overdue-tasks")
            .then((data) => setOverdueTasks(data))
            .catch((err) => setError(err.message))
    }, []);

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
                            <tr key={task.task_instance_id} className="border-t">

                                <td className="px-6 py-4">{task.task_title}</td>

                                <td className="px-6 py-4">{teamNames[task.team_id] || `Team ${task.team_id}`}</td>

                                <td className="px-6 py-4">{task.due_date}</td>

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