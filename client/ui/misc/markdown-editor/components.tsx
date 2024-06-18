import { FileExtension } from '@remirror/extension-file';
import {
  ApplySchemaAttributes,
  NodeExtensionSpec,
  NodeSpecOverride,
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
      },
    };
  }
}

export class CustomImageExtension extends ImageExtension {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    const spec = super.createNodeSpec(extra, override);
    return {
      ...spec,
      selectable: true,
      attrs: {
        ...spec.attrs,
      },
    };
  }
}
