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
