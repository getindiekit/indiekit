import sharp from "sharp";

/**
 * Apply media transformation
 * @param {object} imageProcessing - Sharp image processing options
 * @param {object} file - File
 * @returns {Promise<object>} Media file
 */
export const mediaTransform = async (imageProcessing, file) => {
  const { resize } = imageProcessing;

  file.data = await sharp(file.data).resize(resize).toBuffer();

  return file;
};
