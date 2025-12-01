import { cn } from './Button';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    online?: boolean;
}

export const Avatar = ({ src, alt, fallback, size = 'md', className, online }: AvatarProps) => {
    const sizes = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
    };

    return (
        <div className="relative inline-block">
            <div className={cn("rounded-full overflow-hidden bg-gray-700", sizes[size], className)}>
                {src ? (
                    <img
                        src={src}
                        alt={alt || fallback}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center font-medium text-white">
                        {fallback.substring(0, 2).toUpperCase()}
                    </div>
                )}
            </div>
            {online !== undefined && (
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${online ? 'bg-green-500' : 'bg-gray-500'}`} />
            )}
        </div>
    );
};
