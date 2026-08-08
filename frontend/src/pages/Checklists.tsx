import { useEffect, useState } from "react";
import { apiFetch } from "../api";

interface Checklist {
    id: number;
    title: string;
    created_by: number;
    created_at: string;
}

export default function Checklists() {
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    const loadChecklists = () => {
        apiFetch("/checklists")
            .then((data) => setChecklists(data))
            .catch((err) => setError(err.message));
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

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Master Checklists
                    </h1>

                    <p className="text-gray-500">
                        Manage operational checklists.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {creating ? "Creating..." : "+ New Checklist"}
                </button>

            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left">Title</th>
                            <th className="px-6 py-4 text-left">Created By</th>
                            <th className="px-6 py-4 text-left">Created On</th>
                        </tr>
                    </thead>

                    <tbody>
                        {checklists.map((c) => (
                            <tr key={c.id} className="border-t">
                                <td className="px-6 py-4">{c.title}</td>
                                <td className="px-6 py-4">User #{c.created_by}</td>
                                <td className="px-6 py-4">
                                    {new Date(c.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

            {checklists.length === 0 && !error && (
                <p className="text-gray-500 mt-4">No checklists yet. Create one to get started.</p>
            )}

        </div>
    );
}