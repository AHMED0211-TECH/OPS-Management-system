import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TeamLayout() {
    const { session } = useAuth();
    const email = session?.user?.email ?? "Not logged in";
    const initial = email.charAt(0).toUpperCase();

    return (
        <div className="flex h-screen bg-slate-100">
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="text-2xl font-bold p-6 border-b border-slate-700">
                    Operations OS
                </div>
                <div className="p-4 text-sm text-slate-400">
                    Team Member View
                </div>
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="h-16 bg-white shadow flex items-center justify-between px-8">
                    <h1 className="text-lg font-semibold text-slate-800">
                        Operations OS
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-semibold">Team Member</p>
                            <p className="text-sm text-gray-500">{email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                            {initial}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-slate-100 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}