import { cn } from '../ui/Button';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4',
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full border-gray-300 border-t-emerald-600",
                sizes[size],
                className
            )}
        />
    );
};
