import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function DashboardLayout() {
    const { session } = useAuth();
    const email = session?.user?.email ?? "Not logged in";
    const initial = email.charAt(0).toUpperCase();
    const navigate = useNavigate();
    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/");

    }

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Top Navbar */}
                <header className="h-16 bg-white shadow flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800">
                            Operations OS
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-semibold">Account</p>
                            <p className="text-sm text-gray-500">{email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {initial}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-2 text-sm text-red-600 hover:text-red-700 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-slate-100 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

            </div >
        </div >
    );
}