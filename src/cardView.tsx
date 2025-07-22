import React from "react";
import { CardButton, type CardButtonProps } from "./cardButton";
import {
    logo,
    reactLogo,
    golangLogo,
    pythonLogo,
    typescriptLogo,
    // javascriptLogo,
    questionmarkLogo,
} from "./assets";

export type CardViewProps = {
    image: string;
    name: string;
    description: string;
    buttons: CardButtonProps[]; // not sure if this is the best way to handle buttons (but I want the ability to modify the button options for different card types)
    onClick: () => void; // allows for flexible click handling per card type
}

export function CardView({ image, name, description, buttons, onClick }: CardViewProps) {
    return (
        <div className="bg-[#1a1a1a] p-3 rounded-xl font-mono border-2 border-[#fbf0df] transition-colors duration-300 focus-within:border-[#f3d5a3] flex flex-col h-full cursor-pointer transition-transform duration-200 hover:scale-105" onClick={onClick}>
            <div className="w-full h-48 bg-[#fbf0df] flex items-center justify-center rounded-lg overflow-hidden mb-4 bg-[#fbf0df]">
                <img src={image} alt={name} className="max-h-full max-w-full object-contain " />
            </div>
            <div className="p-2 flex-grow flex flex-col text-left">
                <h2 className="text-xl font-bold mb-2 text-[#fbf0df]">{name}</h2>
                <p className="text-[#fbf0df]/80 text-sm flex-grow">{description}</p>
            </div>
            <div className="p-2 border-t border-[#fbf0df]/20 flex justify-end space-x-2 mt-4">
                {buttons.map((button) => (
                    <CardButton key={button.label} {...button} />
                ))}
            </div>
        </div>
    )
}