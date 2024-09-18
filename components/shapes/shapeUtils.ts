export const getStrokeWidth = (
  strokeWidth: number | undefined,
  width: number | undefined,
  height: number | undefined,
) => {
  if (width && height) {
    const minStrokeWidth = Math.max(Math.min(width, height) / 2, 1);
    if (strokeWidth && strokeWidth * 2 > Math.min(width, height)) {
      return minStrokeWidth;
    }
    return strokeWidth;
  }
};

export const SHAPE_MIN_WIDTH = 5;
export const SHAPE_MIN_HEIGHT = 5;
export const SHAPE_DEFAULT_WIDTH = 50;
export const SHAPE_DEFAULT_HEIGHT = 50;
