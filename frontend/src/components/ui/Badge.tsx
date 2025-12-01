import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'error' | 'info' | 'primary';
    size?: 'sm' | 'md';
}

export const Badge = ({ className, variant = 'default', size = 'sm', ...props }: BadgeProps) => {
    const variants = {
        default: 'bg-gray-700 text-gray-300',
        success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
        warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
        danger: 'bg-red-900/50 text-red-400 border border-red-800',
        error: 'bg-red-900/50 text-red-400 border border-red-800',
        info: 'bg-blue-900/50 text-blue-400 border border-blue-800',
        primary: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    };

    const sizes = {
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-medium transition-colors",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
