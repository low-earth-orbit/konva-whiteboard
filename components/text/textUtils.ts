export const TEXT_DEFAULT_WIDTH = 200;
export const TEXT_DEFAULT_HEIGHT = 50;
export const TEXT_MIN_WIDTH = 5;
export const TEXT_MIN_HEIGHT = 5;

export function convertTextPropertiesToTextStyleArray(
  fontStyle: string | undefined,
  textDecoration: string | undefined,
): string[] {
  let textStyle = [];
  if (fontStyle?.includes("bold")) {
    textStyle.push("bold");
  }
  if (fontStyle?.includes("italic")) {
    textStyle.push("italic");
  }
  if (textDecoration?.includes("underline")) {
    textStyle.push("underline");
  }
  return textStyle;
}

export function getFontStyleStringFromTextStyleArray(
  textStyle: string[],
): string {
  let fontStyle = "";
  if (textStyle.includes("bold")) {
    fontStyle += "bold";
  }
  if (textStyle.includes("italic")) {
    fontStyle += " italic";
  }
  return fontStyle;
}

export function getTextDecorationStringFromTextStyleArray(
  textStyle: string[],
): string {
  let textDecoration = "";
  if (textStyle.includes("underline")) {
    textDecoration += "underline";
  }
  return textDecoration;
}
