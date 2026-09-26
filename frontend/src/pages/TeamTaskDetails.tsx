import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { supabase } from "../supabaseClient";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import Skeleton from "../components/Skeleton";

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
    const [noteText, setNoteText] = useState("");
    const [savingNote, setSavingNote] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        apiFetch(`/task-instances/${taskId}`)
            .then((data) => {
                setTask(data);
                setNoteText(data.notes || "");
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [taskId]);

    const handleComplete = async () => {
        setCompleting(true);
        setError("");
        try {
            await apiFetch(`/task-instances/${taskId}/complete`, { method: "POST" });
            setTask((prev) =>
                prev ? { ...prev, status: "completed", completed_at: new Date().toISOString() } : prev
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete task");
        } finally {
            setCompleting(false);
        }
    };

    const handleSaveNote = async () => {
        setSavingNote(true);
        setError("");
        setNoteSaved(false);
        try {
            await apiFetch(`/task-instances/${taskId}/notes`, {
                method: "PATCH",
                body: JSON.stringify({ content: noteText }),
                headers: { "Content-Type": "application/json" },
            });
            setTask((prev) => (prev ? { ...prev, notes: noteText } : prev));
            setNoteSaved(true);
            setTimeout(() => setNoteSaved(false), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save note");
        } finally {
            setSavingNote(false);
        }
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;

            const res = await fetch(`http://127.0.0.1:8000/task-instances/${taskId}/images`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.json();
            setTask((prev) => (prev ? { ...prev, image_urls: result.image_urls } : prev));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
            setUploading(false);
            setPreviewUrl(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-8">
                <Skeleton className="h-4 w-16 mb-4" />
                <Skeleton className="h-8 w-72 mb-6" />
                <Skeleton className="h-40 w-full rounded-xl mb-4" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
        );
    }
    if (error && !task) return <p className="text-red-600 p-8">{error}</p>;
    if (!task) return <p className="p-8">No task found.</p>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-sm text-brand-600 hover:text-brand-700 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="font-heading text-xl font-semibold text-ink-900">{task.title}</h1>
                    <StatusBadge status={task.status} />
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-700 mb-6">
                    <p className="font-medium">Due Date</p>
                    <p>{task.due_date}</p>

                    <p className="font-medium">Frequency</p>
                    <p className="capitalize">{task.frequency}</p>

                    {task.completed_at && (
                        <>
                            <p className="font-medium">Completed At</p>
                            <p>{new Date(task.completed_at).toLocaleString()}</p>
                        </>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="border-t border-slate-100 pt-6 mb-6">
                    <label className="block text-sm font-semibold text-ink-900 mb-2">Notes</label>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        rows={3}
                        placeholder="Add a note..."
                    />
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={handleSaveNote}
                            disabled={savingNote}
                            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
                        >
                            {savingNote ? "Saving..." : "Save Note"}
                        </button>
                        {noteSaved && <span className="text-sm text-green-600">✓ Saved</span>}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <label className="block text-sm font-semibold text-ink-900 mb-2">Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        disabled={uploading}
                        className="block w-full text-sm text-slate-500 disabled:opacity-50"
                    />
                    {uploading && (
                        <p className="text-sm text-slate-500 mt-2">Uploading...</p>
                    )}

                    <div className="flex gap-3 flex-wrap mt-4">
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Upload preview"
                                className="w-24 h-24 object-cover rounded-lg border border-slate-300 opacity-60"
                            />
                        )}
                        {task.image_urls?.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`Task evidence ${idx + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                            />
                        ))}
                    </div>
                </div>

                {task.status !== "completed" && (
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        {completing ? "Completing..." : "✓ Mark Complete"}
                    </button>
                )}
            </div>
        </div>
    );
}