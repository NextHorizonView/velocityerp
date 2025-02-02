import React, { useMemo, useCallback } from 'react';
import { BaseEditor, createEditor, Descendant, Editor } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import { Bold, Italic, Underline, Code } from 'lucide-react';

type CustomElement = {
    type: 'paragraph' | 'code' | 'list-item';
    children: CustomText[];
};

type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
};

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

interface ToolbarButtonProps {
    format: keyof Omit<CustomText, 'text'>;
    icon: React.FC<{ className?: string }>;
    active: boolean;
}

interface RichTextEditorProps {
    initialValue?: Descendant[];
    placeholder?: string;
    className?: string;
    onChange?: (value: Descendant[]) => void;
}

const isMarkActive = (editor: Editor, format: keyof Omit<CustomText, 'text'>): boolean => {
    const marks = Editor.marks(editor) as Partial<CustomText> | null;
    return marks ? !!marks[format] : false;
};

const toggleMark = (editor: Editor, format: keyof Omit<CustomText, 'text'>): void => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const ToolbarButton: React.FC<ToolbarButtonProps & { editor: Editor }> = ({ editor, format, icon: Icon, active }) => {
    return (
        <button
            type="button"
            className={`p-2 rounded hover:bg-gray-200 ${active ? 'bg-gray-200' : ''}`}
            onMouseDown={(event: React.MouseEvent) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    initialValue = [{ type: 'paragraph', children: [{ text: '' }] }],
    placeholder = 'Start typing...',
    className = '',
    onChange,
}) => {
    const editor = useMemo(() => withReact(createEditor()), []);

    const renderElement = useCallback(
        (props: RenderElementProps) => {
            const { attributes, children, element } = props;

            switch (element.type) {
                case 'code':
                    return (
                        <pre {...attributes}>
                            <code>{children}</code>
                        </pre>
                    );
                case 'list-item':
                    return <li {...attributes}>{children}</li>;
                default:
                    return <p {...attributes}>{children}</p>;
            }
        },
        []
    );

    const renderLeaf = useCallback(
        (props: RenderLeafProps) => {
            const { attributes, children, leaf } = props;

            let modifiedChildren = children; // Create a new variable to hold modified children

            if (leaf.bold) {
                modifiedChildren = <strong>{modifiedChildren}</strong>;
            }
            if (leaf.italic) {
                modifiedChildren = <em>{modifiedChildren}</em>;
            }
            if (leaf.underline) {
                modifiedChildren = <u>{modifiedChildren}</u>;
            }
            if (leaf.code) {
                modifiedChildren = <code>{modifiedChildren}</code>;
            }

            return <span {...attributes}>{modifiedChildren}</span>;
        },
        []
    );


    return (
        <div className={`border rounded-md bg-gray-50 ${className}`}>
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={value => {
                    onChange?.(value);
                }}
            >
                <div className="border-b p-2 flex gap-2">
                    <ToolbarButton editor={editor} format="bold" icon={Bold} active={isMarkActive(editor, 'bold')} />
                    <ToolbarButton editor={editor} format="italic" icon={Italic} active={isMarkActive(editor, 'italic')} />
                    <ToolbarButton editor={editor} format="underline" icon={Underline} active={isMarkActive(editor, 'underline')} />
                    <ToolbarButton editor={editor} format="code" icon={Code} active={isMarkActive(editor, 'code')} />
                </div>
                <Editable
                    className="p-3 min-h-[8rem] focus:outline-none"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder={placeholder}
                />
            </Slate>
        </div>
    );
};

export default RichTextEditor;
