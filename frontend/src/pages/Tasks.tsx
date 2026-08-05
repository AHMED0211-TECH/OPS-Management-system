import { tasks } from "../data/mockData";
import { useNavigate } from "react-router-dom"

export default function Tasks() {
    const navigate = useNavigate()
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

                            <th className="text-left px-6 py-4">Due Date</th>

                            <th className="text-left px-6 py-4">Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {tasks.map(task => (

                            <tr
                                key={task.id}
                                className="border-t hover:bg-slate-50"
                            >

                                <td className="px-6 py-4 font-medium">
                                    {task.title}
                                </td>

                                <td className="px-6 py-4">
                                    {task.team}
                                </td>

                                <td className="px-6 py-4">
                                    {task.frequency}
                                </td>

                                <td className="px-6 py-4">
                                    {task.dueDate}
                                </td>

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