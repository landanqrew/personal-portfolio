import React from "react";

export type CardButtonProps = {
    label: string;
    icon: React.ReactNode; // or should this be a string for the svg path?
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CardButton({ label, icon, onClick }: CardButtonProps) {
    return (
        <button onClick={onClick} className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap inline-flex items-center justify-center">
            {icon}
            {label}
        </button>
    )
}