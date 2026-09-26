interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryLabel?: string;
    onSecondaryAction?: () => void;
    secondaryDisabled?: boolean;
}

export default function PageHeader({
    title,
    subtitle,
    actionLabel,
    onAction,
    secondaryLabel,
    onSecondaryAction,
    secondaryDisabled,
}: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold text-ink-900">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            <div className="flex gap-3">
                {secondaryLabel && onSecondaryAction && (
                    <button
                        onClick={onSecondaryAction}
                        disabled={secondaryDisabled}
                        className="bg-slate-600 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {secondaryLabel}
                    </button>
                )}
                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}