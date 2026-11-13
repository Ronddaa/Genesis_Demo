// Path: apps/api/src/checks/services/inspect_image.service.ts

import {
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import sharp from 'sharp';

const max_input_pixels = 16_000_000;
const png_signature = Buffer.from('89504e470d0a1a0a', 'hex');
const jpeg_signature = Buffer.from([0xff, 0xd8, 0xff]);

export async function inspect_image(buffer: Buffer) {
  const is_png = buffer.subarray(0, png_signature.length).equals(png_signature);
  const is_jpeg = buffer
    .subarray(0, jpeg_signature.length)
    .equals(jpeg_signature);

  if (!is_png && !is_jpeg) {
    throw new UnsupportedMediaTypeException({
      code: 'UNSUPPORTED_IMAGE_FORMAT',
      message: 'Upload a PNG or JPEG image.',
    });
  }

  try {
    const image = sharp(buffer, {
      limitInputPixels: max_input_pixels,
      failOn: 'warning',
    });

    const { format, width, height } = await image.metadata();
    await image.stats();

    return { format, width, height };
  } catch {
    throw new UnprocessableEntityException({
      code: 'IMAGE_UNREADABLE',
      message:
        'The image could not be a decoded within the 16-megapixel limit.',
    });
  }
}
