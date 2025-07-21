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
        return <input type="text" value={field.fieldValue} onChange={field.onChange} />;
    } else {
        if (field.cssClass) {
            return <field.htmlTag className={field.cssClass}>{field.fieldValue}</field.htmlTag>;
        } else {
            return <field.htmlTag>{field.fieldValue}</field.htmlTag>;
        }
    }
}

export function DetailView(props: DetailViewProps) {
    // HEADER SECTION
    const { headerSection, headerButtons, sections } = props;
    let headerSectionJSX: JSX.Element[] = [];
    for (const field of headerSection.fields) {
        if (!field.cssClass) {
            field.cssClass = "text-2xl font-bold";
        }
        headerSectionJSX.push(generateFieldJSX(field));
    }

    let headerButtonsJSX: JSX.Element[] = [];
    for (const button of headerButtons) {
        headerButtonsJSX.push(<button className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap">{button.label}</button>);
    }

    let sectionsJSX: JSX.Element[] = [];
    for (const section of sections) {
        let sectionJSX: JSX.Element[] = [];
        // Adding section headers and description if they exist
        for (const headerField of section.sectionHeaders) {
            if (!headerField.cssClass) {
                headerField.cssClass = "text-2xl font-bold";
            }
            sectionJSX.push(generateFieldJSX(headerField));
        }
        if (section.sectionDescription) {
            if (!section.sectionDescription.cssClass) {
                section.sectionDescription.cssClass = "text-lg text-gray-400";
            }
            sectionJSX.push(generateFieldJSX(section.sectionDescription));
        }

        for (const field of section.fields) {
            sectionJSX.push(generateFieldJSX(field));
        }
        sectionsJSX.push(<div className="flex flex-col gap-2 p-4 rounded-xl border-2 border-[#fbf0df] bg-[#1a1a1a]">{sectionJSX}</div>);
    }

    return (
        <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4 p-4 rounded-xl border-2 border-[#fbf0df] bg-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-4">
                {headerSectionJSX}
                <div className="flex-grow"></div>
                {headerButtonsJSX}
            </div>
            {sectionsJSX}
        </div>
    )
}