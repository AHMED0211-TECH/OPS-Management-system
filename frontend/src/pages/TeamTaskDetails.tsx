import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { supabase } from "../supabaseClient";

interface TaskDetails {
    id: number;
    task_id: number;
    title: string;
    checklist_id: number;
    team_id: number;
    frequency: string;
    status: string;
    due_date: string;
    completed_at?: string;
    notes?: string;
    image_urls?: string[];
}


export default function TeamTaskDetail() {
    const { taskId } = useParams(); // this is actually the instance_id
    const navigate = useNavigate();
    const [completing, setCompleting] = useState(false);
    const [task, setTask] = useState<TaskDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //const [done, setDone] = useState(false);
    const [noteText, setNoteText] = useState("");
    // const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        apiFetch(`/task-instances/${taskId}`)
            .then((data) => setTask(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [taskId]);

    const handleComplete = async () => {
        setCompleting(true);
        setError("");
        try {
            await apiFetch(`/task-instances/${taskId}/complete`, { method: "POST" });
            setTask((prev) => prev ? { ...prev, status: "completed", completed_at: new Date().toISOString() } : prev);
            // setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete task");
        } finally {
            setCompleting(false);
        }
    };
    const handleSaveNote = async () => {
        try {
            await apiFetch(`/task-instances/${taskId}/notes`, {
                method: "PATCH",
                body: JSON.stringify({ content: noteText }),
                headers: { "Content-Type": "application/json" }
            });
            setTask((prev) =>
                prev ? { ...prev, notes: noteText } : prev
            );
            setNoteText("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save note");
        }
    };
    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            console.log("TOKEN:", token);

            const res = await fetch(`http://127.0.0.1:8000/task-instances/${taskId}/images`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.json();
            console.log("Uploaded:", result);
            // Update task state with new image URLs
            setTask((prev) =>
                prev ? { ...prev, image_urls: result.image_urls } : prev
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image");
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!task) return <p>No task found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-bold text-slate-800 mb-2">{task.title}</h1>
                <p>Status: {task.status}</p>
                <p>Due Date: {task.due_date}</p>
                <p>Frequency: {task.frequency} </p>
                {task.completed_at && <p>Completed At: {task.completed_at}</p>}
                <p>Task ID: {task.task_id}</p>
                <p>Checklist ID: {task.checklist_id}</p>
                <p>Team ID: {task.team_id}</p>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes
                    </label>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        rows={3}
                        placeholder="Add a note..."
                    />
                    <button
                        onClick={handleSaveNote}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Save Note
                    </button>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="block w-full text-sm text-slate-500"
                    />
                </div>

                {task.image_urls && task.image_urls.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-sm font-medium text-slate-700 mb-2">Uploaded Images</h2>
                        <div className="flex gap-4 flex-wrap">
                            {task.image_urls.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Task image ${idx + 1}`}
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    </div>
                )}




                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {task.status !== "completed" && (
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {completing ? "Completing..." : "Mark Complete"}
                    </button>
                )}
            </div>
        </div>
    );
}