import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
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
                            <p className="font-semibold">Manager</p>
                            <p className="text-sm text-gray-500">
                                manager@company.com
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            M
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-slate-100 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}