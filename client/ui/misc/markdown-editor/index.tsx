import '@remirror/styles/all.css';

import {
    CommandButtonGroup,
    CreateTableButton,
    EditorComponent,
    HeadingLevelButtonGroup,
    HistoryButtonGroup,
    ListButtonGroup,
    OnChangeJSON,
    Remirror,
    TableComponents,
    ThemeProvider,
    ToggleBlockquoteButton,
    ToggleBoldButton,
    ToggleCodeBlockButton,
    ToggleCodeButton,
    ToggleItalicButton,
    ToggleStrikeButton,
    Toolbar,
    useRemirror,
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import jsx from 'refractor/lang/jsx.js';
import typescript from 'refractor/lang/typescript.js';
import { ExtensionPriority } from 'remirror';
import {
    BlockquoteExtension,
    BoldExtension,
    BulletListExtension,
    CodeBlockExtension,
    CodeExtension,
    DropCursorExtension,
    HardBreakExtension,
    HeadingExtension,
    ItalicExtension,
    LinkExtension,
    ListItemExtension,
    MarkdownExtension,
    OrderedListExtension,
    PlaceholderExtension,
    StrikeExtension,
    TableExtension,
    TrailingNodeExtension,
} from 'remirror/extensions';

import {
    CustomImageExtension,
    CustomUploadExtension,
} from '@/ui/misc/markdown-editor/components';
import { css, cx } from '@emotion/css';
import type { RemirrorProps, UseThemeProps } from '@remirror/react';
import type { CreateEditorStateProps, RemirrorJSON } from 'remirror';
import FileCard from './file-card';
import { DataUrlFileUploader } from './file-upload';

interface ReactEditorProps
    extends Pick<CreateEditorStateProps, 'stringHandler'>,
        Pick<
            RemirrorProps,
            'initialContent' | 'editable' | 'autoFocus' | 'hooks'
        > {
    placeholder?: string;
    theme?: UseThemeProps['theme'];
}

export interface MarkdownEditorProps
    extends Partial<Omit<ReactEditorProps, 'stringHandler'>> {
    pageContent: string;
    setContent?: (data: RemirrorJSON) => void;
    editable?: boolean;
}

export const MarkdownEditor: FC<PropsWithChildren<MarkdownEditorProps>> = ({
    pageContent,
    placeholder = '',
    setContent,
    editable = true,
    children,
    theme,
    ...rest
}) => {
    const markdownStyles = css`
        img {
            max-width: 80%;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        .ProseMirror-selectednode {
            outline: 0 !important;
            position: relative;
            height: fit-content;

            img {
                outline: 0 !important;
            }
        }
        .remirror-theme {
            @media (min-width: 640px) {
                width: 97% !important;
            }

            width: 100% !important;

            .ProseMirror {
                padding: 0 !important;
                min-height: 55vh !important;
                overflow: hidden !important;
                box-shadow: none !important;
                .file-node-view-wrapper {
                    outline: 0;
                    margin: 1rem 0;
                }
            }

            .ProseMirror:focus {
                box-shadow: none;
                overflow: hidden !important;
            }

            .MuiStack-root {
                border-radius: 0.5rem;
                background-color: #181a1a;
                border: rgba(255, 255, 255, 0.3) 0.1px solid;
                padding: 8px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                @media (min-width: 768px) {
                    width: 100%;
                }
                width: 100%;
                .MuiBox-root {
                    display: flex;
                    gap: 5px;
                    background-color: #181a1a;
                    margin: 0;
                    .MuiButtonBase-root {
                        background-color: #181a1a;
                        svg {
                            color: white;
                            height: 1rem;
                            width: 1rem;
                        }
                    }
                    .Mui-selected {
                        background-color: white;
                        svg {
                            color: black;
                            height: 1rem;
                            width: 1rem;
                        }
                    }
                }
            }
        }
    `; /**
     * The editor which is used to create the annotation. Supports formatting.
     */

    const extensions = useCallback(
        () => [
            new LinkExtension({ autoLink: true }),
            new PlaceholderExtension({ placeholder }),
            new BoldExtension({}),
            new StrikeExtension(),
            new ItalicExtension(),
            new HeadingExtension({}),
            new BlockquoteExtension(),
            new BulletListExtension({ enableSpine: true }),
            new OrderedListExtension(),
            new ListItemExtension({
                priority: ExtensionPriority.High,
                enableCollapsible: true,
            }),
            new CodeExtension(),
            new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
            new TrailingNodeExtension({}),
            new TableExtension({}),
            new MarkdownExtension({ copyAsMarkdown: false }),
            /**
             * `HardBreakExtension` allows us to create a newline inside paragraphs.
             * e.g. in a list item
             */
            new HardBreakExtension(),
            new CustomUploadExtension({
                render: (props) => {
                    return <FileCard {...props} />;
                },
                uploadFileHandler: () => {
                    return new DataUrlFileUploader();
                },
            }),
            new DropCursorExtension({ color: 'white' }),
            new CustomImageExtension({}),
        ],
        [placeholder]
    );

    const { manager, state, setState } = useRemirror({
        extensions,
        stringHandler: 'markdown',
    });

    const [initContent] = useState<RemirrorJSON | undefined>(() => {
        try {
            return JSON.parse(pageContent);
        } catch (err) {
            return undefined;
        }
    });

    return (
        <section
            className={cx(
                markdownStyles,
                'w-full overflow-auto p-4 scrollbar-thin scrollbar-thumb-white scrollbar-track-background'
            )}>
            <AllStyledComponent>
                <ThemeProvider theme={theme}>
                    <Remirror
                        initialContent={initContent}
                        manager={manager}
                        editable={editable}
                        {...rest}>
                        {editable && (
                            <>
                                <Toolbar>
                                    <CommandButtonGroup>
                                        <ToggleBoldButton />
                                        <ToggleItalicButton />
                                        <ToggleStrikeButton />
                                        <ToggleCodeButton />
                                    </CommandButtonGroup>
                                    <HeadingLevelButtonGroup showAll />
                                    <CommandButtonGroup>
                                        <ToggleBlockquoteButton />
                                        <ToggleCodeBlockButton />
                                    </CommandButtonGroup>
                                    <ListButtonGroup>
                                        <CreateTableButton />
                                    </ListButtonGroup>
                                    <HistoryButtonGroup />
                                </Toolbar>
                                <TableComponents />
                            </>
                        )}
                        <EditorComponent />
                        {children}
                        <OnChangeJSON
                            onChange={(data) => {
                                setContent && setContent(data);
                            }}
                        />
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </section>
    );
};
