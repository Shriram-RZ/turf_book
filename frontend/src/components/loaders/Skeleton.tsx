import { cn } from '../ui/Button';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-700/50", className)}
            {...props}
        />
    );
};
