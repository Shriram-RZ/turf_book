import React, { useState } from 'react';
import { cn } from './Button';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    className?: string;
}

export const Tabs = ({ tabs, defaultTab, className }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex space-x-1 border-b border-gray-800 mb-4 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                            activeTab === tab.id
                                ? "border-emerald-500 text-emerald-500"
                                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-2">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};
