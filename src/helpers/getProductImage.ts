export const getProductImage = (img: string) => {
  return img
    ? `https://app.mymazix.com/Uploads/${img?.split("/Uploads")[1]}`
    : "";
};
