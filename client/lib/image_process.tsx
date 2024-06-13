export const convertToBase64 = (image: File) => {
  const reader = new FileReader();

  reader.readAsDataURL(image);

  return new Promise((res) => {
    reader.onload = () => {
      return res(reader.result);
    };
  });
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
