// components/StatusBadge.tsx
import React from "react";

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let colorClasses = "";
    let label = status;

    switch (status.toLowerCase()) {
        case "completed":
            colorClasses = "bg-green-100 text-green-800";
            label = "✅ Completed";
            break;
        case "pending":
            colorClasses = "bg-yellow-100 text-yellow-800";
            label = "⏳ Pending";
            break;
        case "locked":
            colorClasses = "bg-gray-200 text-gray-700";
            label = "🔒 Locked";
            break;
        default:
            colorClasses = "bg-slate-100 text-slate-700";
            label = status;
    }

    return (
        <span className={`px-2 py-1 rounded text-sm font-medium ${colorClasses}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
