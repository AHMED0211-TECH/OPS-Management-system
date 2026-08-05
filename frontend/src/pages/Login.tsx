import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Tomorrow replace this with Supabase login
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Operations OS
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Operations Management System
                    </p>

                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>

                        <label className="block mb-2 text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="manager@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                    >
                        Login
                    </button>

                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t"></div>
                    <span className="px-3 text-sm text-gray-400">
                        Demo Access
                    </span>
                    <div className="flex-grow border-t"></div>
                </div>

                <div className="space-y-3">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg transition"
                    >
                        👨‍💼 Login as Manager
                    </button>

                    <button
                        onClick={() => navigate("/team/dashboard")}
                        className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg transition"
                    >
                        👷 Login as Team Member
                    </button>

                </div>

            </div>

        </div>
    );
}