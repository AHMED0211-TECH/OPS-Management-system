//import { tasks } from "../data/mockData";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate, } from "react-router-dom"

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
    const navigate = useNavigate()
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/tasks")
            .then((data) => setTasks(data))
            .catch((err) => setError(err.message));
    }, []);
    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Tasks
                    </h1>

                    <p className="text-gray-500">
                        Manage all operational tasks.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/tasks/new")}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                    + Create Task
                </button>


            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-50">

                        <tr>

                            <th className="text-left px-6 py-4">Task</th>

                            <th className="text-left px-6 py-4">Team</th>

                            <th className="text-left px-6 py-4">Frequency</th>

                        </tr>

                    </thead>

                    <tbody>

                        {tasks.map(task => (
                            <tr key={task.id} className="border-t hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{task.title}</td>
                                <td className="px-6 py-4">{teamNames[task.team_id] ?? "Unknown"}</td>
                                <td className="px-6 py-4 capitalize">
                                    {task.frequency}
                                    {task.frequency === "every_x_hours" && task.interval_hours
                                        ? ` (${task.interval_hours}h)`
                                        : ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

            {tasks.length === 0 && !error && (
                <p className="text-gray-500 mt-4">No tasks yet.</p>
            )}

        </div>
    );
}