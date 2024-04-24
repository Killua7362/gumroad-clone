import '@remirror/styles/all.css';

import React, { FC, PropsWithChildren, useCallback } from 'react';
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

import type { CreateEditorStateProps } from 'remirror';
import type { RemirrorProps, UseThemeProps } from '@remirror/react';

interface ReactEditorProps
	extends Pick<CreateEditorStateProps, 'stringHandler'>,
	Pick<RemirrorProps, 'initialContent' | 'editable' | 'autoFocus' | 'hooks'> {
	placeholder?: string;
	theme?: UseThemeProps['theme'];
}

export default { title: 'Editors / Markdown' };

export interface MarkdownEditorProps extends Partial<Omit<ReactEditorProps, 'stringHandler'>> { }

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MarkdownEditor: FC<PropsWithChildren<MarkdownEditorProps>> = ({
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

	const { manager } = useRemirror({
		extensions,
		stringHandler: 'markdown',
	});

	return (
		<AllStyledComponent>
			<ThemeProvider theme={theme}>
				<Remirror manager={manager} autoFocus {...rest}>
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
				</Remirror>
			</ThemeProvider>
		</AllStyledComponent>
	);
};
