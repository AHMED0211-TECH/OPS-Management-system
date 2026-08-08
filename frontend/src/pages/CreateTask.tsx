import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

interface Checklist {
    id: number;
    title: string;
}

const teams = [
    { id: 1, name: "Security" },
    { id: 2, name: "Operations" },
    { id: 3, name: "Maintenance" },
];

export default function CreateTask() {
    const navigate = useNavigate();

    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [title, setTitle] = useState("");
    const [checklistId, setChecklistId] = useState<number | "">("");
    const [teamId, setTeamId] = useState<number>(1);
    const [frequency, setFrequency] = useState("daily");
    const [intervalHours, setIntervalHours] = useState<number | "">("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        apiFetch("/checklists")
            .then((data) => {
                setChecklists(data);
                if (data.length > 0) setChecklistId(data[0].id);
            })
            .catch((err) => setError(err.message));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !checklistId) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            await apiFetch("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    checklist_id: checklistId,
                    team_id: teamId,
                    frequency,
                    interval_hours: frequency === "every_x_hours" ? Number(intervalHours) : null,
                }),
            });
            navigate("/tasks");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create task");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl">

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create Task</h1>
                <p className="text-gray-500">
                    Create a new operational task.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-8">

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div>
                        <label className="block mb-2 font-medium">
                            Task Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Checklist
                        </label>

                        <select
                            value={checklistId}
                            onChange={(e) => setChecklistId(Number(e.target.value))}
                            className="w-full border rounded-lg p-3"
                        >
                            {checklists.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Team
                        </label>

                        <select
                            value={teamId}
                            onChange={(e) => setTeamId(Number(e.target.value))}
                            className="w-full border rounded-lg p-3"
                        >
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Frequency
                        </label>

                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="every_x_hours">Every X Hours</option>
                        </select>
                    </div>

                    {frequency === "every_x_hours" && (
                        <div>
                            <label className="block mb-2 font-medium">
                                Interval Hours
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 6"
                                value={intervalHours}
                                onChange={(e) => setIntervalHours(Number(e.target.value))}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                    >
                        {submitting ? "Creating..." : "Create Task"}
                    </button>

                </form>

            </div>

        </div>
    );
}