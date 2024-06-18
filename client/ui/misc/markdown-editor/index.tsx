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
import {
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
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

import { FileExtension } from '@remirror/extension-file';

import { productEditContext } from '@/ui/pages/_protected/_layout.products.edit.$id/_layout_edit';
import type { RemirrorProps, UseThemeProps } from '@remirror/react';
import type {
  ApplySchemaAttributes,
  CreateEditorStateProps,
  NodeExtensionSpec,
  NodeSpecOverride,
  RemirrorJSON,
} from 'remirror';
import FileCard from './file-card';

interface ReactEditorProps
  extends Pick<CreateEditorStateProps, 'stringHandler'>,
    Pick<RemirrorProps, 'initialContent' | 'editable' | 'autoFocus' | 'hooks'> {
  placeholder?: string;
  theme?: UseThemeProps['theme'];
}

export interface MarkdownEditorProps
  extends Partial<Omit<ReactEditorProps, 'stringHandler'>> {
  pageContent: string;
  setContent: (data: RemirrorJSON) => void;
}

class CustomUploadExtension extends FileExtension {
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
      },
    };
  }
}

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MarkdownEditor: FC<PropsWithChildren<MarkdownEditorProps>> = ({
  pageContent,
  placeholder,
  setContent,
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
      new CustomUploadExtension({
        render: (props) => {
          return <FileCard {...props} />;
        },
      }),
      new DropCursorExtension({ color: 'white' }),
    ],
    [placeholder]
  );

  const localProductEditContext = useContext(productEditContext);
  const { setValue } = localProductEditContext!;

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
    <AllStyledComponent>
      <ThemeProvider theme={theme}>
        <Remirror
          initialContent={initContent}
          manager={manager}
          autoFocus
          {...rest}>
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
          <EditorComponent />
          <TableComponents />
          {children}
          <OnChangeJSON
            onChange={(data) => {
              setContent(data);
            }}
          />
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
};
