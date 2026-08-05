import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    CheckSquare,
    TriangleAlert,
    BarChart3,
    Users,
} from "lucide-react";

const menu = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "Checklists",
        icon: ClipboardList,
        path: "/checklists",
    },
    {
        name: "Tasks",
        icon: CheckSquare,
        path: "/tasks",
    },
    {
        name: "Teams",
        icon: Users,
        path: "/teams",
    },
    {
        name: "Overdue",
        icon: TriangleAlert,
        path: "/overdue",
    },
    {
        name: "Reports",
        icon: BarChart3,
        path: "/reports",
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="text-2xl font-bold p-6 border-b border-slate-700">
                Operations OS
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? "bg-blue-600"
                                    : "hover:bg-slate-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}