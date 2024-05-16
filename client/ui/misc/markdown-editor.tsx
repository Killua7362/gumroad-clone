import '@remirror/styles/all.css';

import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import jsx from 'refractor/lang/jsx.js';
import typescript from 'refractor/lang/typescript.js';
import { ExtensionPriority } from 'remirror';
import {
	BlockquoteExtension,
	BoldExtension,
	BulletListExtension,
	CodeBlockExtension,
	CodeExtension,
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
	CommandButtonGroup,
	CreateTableButton,
	EditorComponent,
	HeadingLevelButtonGroup,
	HistoryButtonGroup,
	ListButtonGroup,
	MarkdownToolbar,
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
	VerticalDivider,
	useRemirror,
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';

import type { CreateEditorStateProps, RemirrorJSON } from 'remirror';
import type { RemirrorProps, UseThemeProps } from '@remirror/react';
import { useSearchParams } from 'react-router-dom';

interface ReactEditorProps
	extends Pick<CreateEditorStateProps, 'stringHandler'>,
	Pick<RemirrorProps, 'initialContent' | 'editable' | 'autoFocus' | 'hooks'> {
	placeholder?: string;
	theme?: UseThemeProps['theme'];
}

export interface MarkdownEditorProps extends Partial<Omit<ReactEditorProps, 'stringHandler'>> {
	pageContent: string;
	setPages: React.Dispatch<React.SetStateAction<PageSchema[]>>;
}

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MarkdownEditor: FC<PropsWithChildren<MarkdownEditorProps>> = ({
	pageContent,
	setPages,
	placeholder,
	children,
	theme,
	...rest
}) => {
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
		],
		[placeholder],
	);

	const { manager, state, setState } = useRemirror({
		extensions,
		stringHandler: 'markdown',
	});

	const [searchParams, setSearchParams] = useSearchParams()
	const [initContent] = useState<RemirrorJSON | undefined>(() => {
		if (pageContent) {
			return JSON.parse(pageContent);
		}
		return undefined;
	})

	return (
		<AllStyledComponent>
			<ThemeProvider theme={theme}>
				<Remirror
					initialContent={initContent}
					manager={manager}
					autoFocus {...rest}>
					<Toolbar>
						<CommandButtonGroup>
							<ToggleBoldButton />
							<ToggleItalicButton />
							<ToggleStrikeButton />
							<ToggleCodeButton />
						</CommandButtonGroup>
						<VerticalDivider />
						<HeadingLevelButtonGroup showAll />
						<VerticalDivider />
						<CommandButtonGroup>
							<ToggleBlockquoteButton />
							<ToggleCodeBlockButton />
						</CommandButtonGroup>
						<VerticalDivider />
						<ListButtonGroup>
							<CreateTableButton />
						</ListButtonGroup>
						<VerticalDivider />
						<HistoryButtonGroup />
					</Toolbar>
					<EditorComponent />
					<TableComponents />
					{children}
					<OnChangeJSON onChange={(data) => {
						setPages(prev => {
							let temp = [...prev]
							temp[(searchParams.get('page') || 1) as number - 1].content = JSON.stringify(data);
							return [...temp]
						})
					}} />
				</Remirror>
			</ThemeProvider>
		</AllStyledComponent>
	);
};
