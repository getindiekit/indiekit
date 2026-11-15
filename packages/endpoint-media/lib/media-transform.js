import sharp from "sharp";

/**
 * Apply media transformation
 * @template {{ data: Buffer, mimetype: string }} File
 * @param {{ resize?: ResizeOptions }} imageProcessing - Sharp image processing options
 * @param {File} file - File
 * @returns {Promise<File>} Media file
 */
export const mediaTransform = async (imageProcessing, file) => {
  // Function currently only supports transforming images
  if (!file.mimetype.includes("image/")) {
    return file;
  }

  const { resize } = imageProcessing;

  file.data = await sharp(file.data).rotate().resize(resize).toBuffer();

  return file;
};

/**
 * @import { Buffer } from "node:buffer"
 * @import { ResizeOptions } from "sharp"
 */
