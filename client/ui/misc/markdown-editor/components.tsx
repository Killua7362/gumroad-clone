import Button from '@/ui/components/button';
import { FileExtension } from '@remirror/extension-file';
import { NodeViewComponentProps, useCommands } from '@remirror/react';
import { ComponentType, useState } from 'react';
import { IoTrashBin } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {
    ApplySchemaAttributes,
    DOMCompatibleAttributes,
    ExtensionCommandReturn,
    ExtensionTag,
    NodeExtensionSpec,
    NodeSpecOverride,
    omitExtraAttributes,
} from 'remirror';
import { ImageExtension } from 'remirror/extensions';

export class CustomUploadExtension extends FileExtension {
    createNodeSpec(
        extra: ApplySchemaAttributes,
        override: NodeSpecOverride
    ): NodeExtensionSpec {
        const spec = super.createNodeSpec(extra, override);
        return {
            ...spec,
            attrs: {
                ...spec.attrs,
                description: { default: '' },
                src: { default: '' },
            },
            toDOM: (node) => {
                const { src, error, ...rest } = omitExtraAttributes(
                    node.attrs,
                    extra
                );
                const attrs: DOMCompatibleAttributes = {
                    ...extra.dom(node),
                    ...rest,
                    'data-url': src,
                    'data-file': '',
                    'data-filename': node.attrs.fileName,
                    'data-filetype': node.attrs.fileType,
                    'data-filesize': node.attrs.fileSize,
                    'data-id': node.attrs.id,
                };

                if (error) {
                    attrs['data-error'] = error;
                }

                return ['div', attrs];
            },
        };
    }
}

export class CustomImageExtension extends ImageExtension {
    get name() {
        return 'image' as const;
    }

    createTags() {
        return [ExtensionTag.Media];
    }
    createNodeSpec(
        extra: ApplySchemaAttributes,
        override: NodeSpecOverride
    ): NodeExtensionSpec {
        const spec = super.createNodeSpec(extra, override);
        return {
            ...spec,
            inline: false,
            group: 'block',
            attrs: {
                ...spec.attrs,
                description: { default: '' },
            },
        };
    }

    createCommands(): ExtensionCommandReturn {
        return {
            setImageCaption:
                (attrs: { description: string }) =>
                ({ tr, dispatch, state }) => {
                    const { description } = attrs;
                    let pos = tr.selection.from + 1;
                    const node = state.doc.nodeAt(pos);
                    if (node && node.type === super.type) {
                        dispatch?.(
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                description,
                            })
                        );
                        return true;
                    }
                    return false;
                },
            deleteImage:
                () =>
                ({ tr, dispatch, state }) => {
                    let pos = tr.selection.from + 1;
                    const node = state.doc.nodeAt(pos);

                    if (node && node.type === super.type) {
                        tr.delete(pos, pos + 1).scrollIntoView();
                        dispatch?.(tr);
                        return true;
                    }
                    return false;
                },
        };
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({ node }) => {
        const { setImageCaption, deleteImage } = useCommands();
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="bg-white/5 px-3 py-1 rounded-lg border-white/30 border-[0.1px]">
                <div className="relative flex gap-x-4 left-1">
                    <img
                        src={node.attrs.src}
                        className="border-white/10 border-[0.1px]"
                    />
                    <div className="flex flex-col gap-y-2 justify-end mb-4 items-end">
                        <Button
                            buttonName=""
                            variant="destructive"
                            extraClasses={['!p-3 !rounded-none']}
                            onClickHandler={() => {
                                deleteImage();
                            }}>
                            <IoTrashBin />
                        </Button>
                        <Button
                            buttonName=""
                            isActive={isOpen}
                            extraClasses={['!p-3 !rounded-none']}
                            onClickHandler={() => {
                                setIsOpen(!isOpen);
                            }}>
                            <MdKeyboardArrowDown />
                        </Button>
                    </div>
                </div>
                {isOpen && (
                    <input
                        className="mt-4 relative bottom-[1rem] left-1 text-lg transition-colors duration-200 bg-inherit text-white outline-0 border-white/30 border-[0.1px] px-4 py-2 w-[88%]"
                        placeholder="Enter the caption..."
                        value={node.attrs.description}
                        onChange={(e) => {
                            e.preventDefault();
                            setImageCaption({ description: e.target.value });
                        }}
                    />
                )}
            </div>
        );
    };
}
