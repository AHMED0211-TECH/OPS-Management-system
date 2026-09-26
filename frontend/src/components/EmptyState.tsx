interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon = "📋", title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-heading text-lg font-semibold text-ink-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}