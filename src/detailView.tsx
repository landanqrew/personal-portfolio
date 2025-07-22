import React from "react";
import type { CardButtonProps } from "./cardButton";
import type { JSX } from "react";

export type DetailViewField = {
    fieldName: string;
    fieldValue: string;
    isEditable: boolean;
    buttons: CardButtonProps[];
    htmlTag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "code";
    cssClass?: string;
}

export type EditableDetailViewField = DetailViewField & {
    isEditable: true;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function isEditableDetailViewField(field: DetailViewField): field is EditableDetailViewField {
    return field.isEditable;
}

export type DetailViewSection = {
    fields: DetailViewField[];
    sectionHeaders: DetailViewField[];
    sectionDescription?: DetailViewField;
}

export type DetailViewProps = {
    headerSection: DetailViewSection;
    headerButtons: CardButtonProps[];
    sections: DetailViewSection[];
}

function generateFieldJSX(field: DetailViewField): JSX.Element {
    // should be of type EditableDetailViewField if isEditable is true
    if (isEditableDetailViewField(field)) {
        return (
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#fbf0df]/70">{field.fieldName}</label>
                <input 
                    type="text" 
                    value={field.fieldValue} 
                    onChange={field.onChange}
                    className="bg-[#2a2a2a] border border-[#fbf0df]/30 rounded px-3 py-2 font-mono text-[#fbf0df] focus:border-[#f3d5a3] focus:outline-none"
                />
            </div>
        );
    } else {
        // For non-editable fields, show as "Field Name: Value" format
        if (field.fieldName) {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-[#fbf0df]/90 min-w-[120px] font-mono">{field.fieldName}:</span>
                    <field.htmlTag className={field.cssClass || "text-[#fbf0df]"}>{field.fieldValue}</field.htmlTag>
                </div>
            );
        } else {
            // For headers or fields without names, just show the value
            if (field.cssClass) {
                return <field.htmlTag className={field.cssClass}>{field.fieldValue}</field.htmlTag>;
            } else {
                return <field.htmlTag>{field.fieldValue}</field.htmlTag>;
            }
        }
    }
}

export function DetailView(props: DetailViewProps) {
    // HEADER SECTION
    const { headerSection, headerButtons, sections } = props;
    let headerSectionJSX: JSX.Element[] = [];
    for (let i = 0; i < headerSection.fields.length; i++) {
        const field = headerSection.fields[i]!;
        if (!field.cssClass) {
            field.cssClass = "text-2xl font-bold";
        }
        headerSectionJSX.push(<div key={`header-field-${i}`}>{generateFieldJSX(field)}</div>);
    }

    let headerButtonsJSX: JSX.Element[] = [];
    for (let i = 0; i < headerButtons.length; i++) {
        const button = headerButtons[i]!;
        headerButtonsJSX.push(
            <button 
                key={`header-button-${i}`}
                className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-mono font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap text-sm inline-flex items-center justify-center"
                onClick={button.onClick}
            >
                {button.icon && <span className="mr-2">{button.icon}</span>}
                {button.label}
            </button>
        );
    }

    let sectionsJSX: JSX.Element[] = [];
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex]!;
        let sectionJSX: JSX.Element[] = [];
        
        // Adding section headers and description if they exist
        for (let i = 0; i < section.sectionHeaders.length; i++) {
            const headerField = section.sectionHeaders[i]!;
            if (!headerField.cssClass) {
                headerField.cssClass = "text-2xl font-mono font-bold";
            }
            sectionJSX.push(<div key={`section-${sectionIndex}-header-${i}`}>{generateFieldJSX(headerField)}</div>);
        }
        
        if (section.sectionDescription) {
            if (!section.sectionDescription.cssClass) {
                section.sectionDescription.cssClass = "text-lg text-[#fbf0df]/80 font-mono";
            }
            sectionJSX.push(<div key={`section-${sectionIndex}-description`}>{generateFieldJSX(section.sectionDescription)}</div>);
        }

        for (let i = 0; i < section.fields.length; i++) {
            const field = section.fields[i]!;
            sectionJSX.push(<div key={`section-${sectionIndex}-field-${i}`}>{generateFieldJSX(field)}</div>);
        }
        
        sectionsJSX.push(
            <div key={`section-${sectionIndex}`} className="flex flex-col gap-3 p-4 rounded-xl border-2 border-[#fbf0df] bg-[#1a1a1a]">
                {sectionJSX.slice(0, section.sectionHeaders.length + (section.sectionDescription ? 1 : 0))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sectionJSX.slice(section.sectionHeaders.length + (section.sectionDescription ? 1 : 0))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4 p-4 rounded-xl border-2 border-[#fbf0df] bg-[#1a1a1a]">
            <div className="flex flex-col gap-3">
                {headerSectionJSX}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {headerButtonsJSX.slice(0, Math.ceil(headerButtonsJSX.length / 2))}
                    </div>
                    <div className="flex gap-2">
                        {headerButtonsJSX.slice(Math.ceil(headerButtonsJSX.length / 2))}
                    </div>
                </div>
            </div>
            {sectionsJSX}
        </div>
    )
}