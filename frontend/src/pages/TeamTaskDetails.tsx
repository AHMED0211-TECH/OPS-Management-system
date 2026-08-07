import { useParams, useNavigate } from "react-router-dom";

export default function TeamTaskDetail() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
                ← Back
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-bold text-slate-800 mb-2">Task #{taskId}</h1>
                <p className="text-gray-500 mb-6">Details coming tomorrow — completion logic needs one backend fix first.</p>

                <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                >
                    Mark Complete (fixing tomorrow)
                </button>
            </div>
        </div>
    );
}