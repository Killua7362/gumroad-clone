import { FileUploader } from '@remirror/core';
import { FileAttributes } from '@remirror/extension-file';

interface CustomFileAttributes extends FileAttributes {
  src: string;
}

export class DataUrlFileUploader implements FileUploader<CustomFileAttributes> {
  private file: File | null = null;
  private readonly fileReader: FileReader;

  constructor() {
    this.fileReader = new FileReader();
  }

  insert(file: File): CustomFileAttributes {
    this.file = file;
    return this.getBaseAttrs();
  }

  upload(): Promise<CustomFileAttributes> {
    const fileReader = this.fileReader;
    const file = this.file;

    if (!file) {
      throw new Error('No file to upload');
    }

    fileReader.readAsDataURL(file);
    return new Promise<CustomFileAttributes>((resolve, reject) => {
      fileReader.addEventListener('load', () =>
        resolve({ ...this.getBaseAttrs(), src: fileReader.result as string })
      );
      fileReader.addEventListener('error', () => {
        reject(fileReader.error);
      });
    });
  }

  abort(): void {
    this.fileReader.abort();
  }

  private getBaseAttrs(): CustomFileAttributes {
    if (!this.file) {
      throw new Error('No file to upload');
    }

    return getDefaultFileAttrs(this.file);
  }
}

export function getDefaultFileAttrs(file: File): CustomFileAttributes {
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  } as CustomFileAttributes;
}
