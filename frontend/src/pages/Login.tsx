import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        navigate("/dashboard");
    };

    const handleDemoLogin = async (demoEmail: string, demoPassword: string, path: string) => {
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        navigate(path);
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

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

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
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
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
                        onClick={() => handleDemoLogin("newuser1@example.com", "test1234", "/dashboard")}
                        disabled={loading}
                        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg transition disabled:opacity-50"
                    >
                        👨‍💼 Login as Manager
                    </button>

                    <button
                        onClick={() => handleDemoLogin("testuser123@example.com", "123456789", "/team/dashboard")}
                        disabled={loading}
                        className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg transition disabled:opacity-50"
                    >
                        👷 Login as Team Member
                    </button>

                </div>

            </div>

        </div>
    );
}