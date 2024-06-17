export const convertToBase64 = (image: File) => {
  if (image.type.match('image/png') || image.type.match('image/jpeg')) {
    const reader = new FileReader();

    reader.readAsDataURL(image);

    return new Promise((res) => {
      reader.onload = () => {
        return res(reader.result);
      };
    });
  }
  throw 'Not a image';
};

export const isBase64 = (base64string: string) => {
  const pattern = new RegExp(
    '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$'
  );
  return base64string.match(pattern);
};

export const isImage = (imageSrc: string) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((res) => {
    image.onload = () => {
      if (image.height === 0 || image.width === 0) {
        return res(false);
      } else {
        return res(true);
      }
    };
    image.onerror = () => {
      return res(false);
    };
  });
};
