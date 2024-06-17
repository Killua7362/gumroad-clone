import { FileAttributes } from '@remirror/extension-file';
import { FileUploader } from 'remirror';

const getDefaultFileAttrs = (file: File) => {
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  } as FileAttributes;
};

export const createObjectUrlFileUploader = () => {
  let file: File;
  return {
    insert: (f: File) => {
      file = f;
      return getDefaultFileAttrs(file);
    },

    upload: () => {
      const url = URL.createObjectURL(file);
      return Promise.resolve({ ...getDefaultFileAttrs(file), url });
    },

    // `URL.createObjectURL` is sychronous. There is no change to abort the loading process.
    abort: (): void => {},
  } as FileUploader<FileAttributes>;
};
