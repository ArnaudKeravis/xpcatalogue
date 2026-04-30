/**
 * Shared layout helpers for Sodexo-branded PowerPoint exports.
 * pptxgenjs `fit` hints improve overflow behaviour when opened in PowerPoint.
 */

/** Prefer shrinking font before clipping (paired with generous text box heights). */
export const TEXT_SHRINK = { fit: 'shrink' as const };

/** Let the shape grow vertically when possible (PowerPoint applies on open). */
export const TEXT_RESIZE = { fit: 'resize' as const };

export type BoxInches = { x: number; y: number; w: number; h: number };

export type ImageContainOpts = {
  data: string;
  x: number;
  y: number;
  w: number;
  h: number;
  sizing: { type: 'contain'; w: number; h: number };
};

/**
 * Place an image inside a box without distortion (scale-down + letterbox).
 * pptxgenjs `sizing: contain` matches “object-fit: contain”.
 */
export function imageContainInBox(params: { data: string } & BoxInches): ImageContainOpts {
  const { data, x, y, w, h } = params;
  return {
    data,
    x,
    y,
    w,
    h,
    sizing: { type: 'contain', w, h },
  };
}
