import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from './Button';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    position?: 'left' | 'right';
    className?: string;
}

export const Drawer = ({ isOpen, onClose, title, children, position = 'right', className }: DrawerProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const positionClasses = {
        left: 'left-0 top-0 bottom-0 border-r border-gray-800',
        right: 'right-0 top-0 bottom-0 border-l border-gray-800',
    };

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/70 transition-opacity" onClick={onClose} />
            <div className={cn("absolute w-full max-w-md bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out transform flex flex-col", positionClasses[position], className)}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
