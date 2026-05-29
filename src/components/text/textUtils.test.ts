import { describe, expect, it } from "vitest";
import {
  convertTextPropertiesToTextStyleArray,
  getFontStyleStringFromTextStyleArray,
  getTextDecorationStringFromTextStyleArray,
  TEXT_DEFAULT_HEIGHT,
  TEXT_DEFAULT_WIDTH,
} from "./textUtils";

describe("getFontStyleStringFromTextStyleArray", () => {
  it("returns empty string for no styles", () => {
    expect(getFontStyleStringFromTextStyleArray([])).toBe("");
  });

  it("returns bold", () => {
    expect(getFontStyleStringFromTextStyleArray(["bold"])).toBe("bold");
  });

  it("returns italic", () => {
    expect(getFontStyleStringFromTextStyleArray(["italic"])).toBe(" italic");
  });

  it("returns bold italic", () => {
    expect(getFontStyleStringFromTextStyleArray(["bold", "italic"])).toBe(
      "bold italic",
    );
  });

  it("ignores underline (handled by textDecoration)", () => {
    expect(getFontStyleStringFromTextStyleArray(["underline"])).toBe("");
  });
});

describe("getTextDecorationStringFromTextStyleArray", () => {
  it("returns empty string for no styles", () => {
    expect(getTextDecorationStringFromTextStyleArray([])).toBe("");
  });

  it("returns underline when present", () => {
    expect(getTextDecorationStringFromTextStyleArray(["underline"])).toBe(
      "underline",
    );
  });

  it("ignores non-underline styles", () => {
    expect(getTextDecorationStringFromTextStyleArray(["bold", "italic"])).toBe(
      "",
    );
  });
});

describe("convertTextPropertiesToTextStyleArray", () => {
  it("converts bold fontStyle", () => {
    expect(convertTextPropertiesToTextStyleArray("bold", "")).toEqual(["bold"]);
  });

  it("converts italic fontStyle", () => {
    expect(convertTextPropertiesToTextStyleArray("italic", "")).toEqual([
      "italic",
    ]);
  });

  it("converts underline textDecoration", () => {
    expect(convertTextPropertiesToTextStyleArray("", "underline")).toEqual([
      "underline",
    ]);
  });

  it("converts all three styles", () => {
    expect(
      convertTextPropertiesToTextStyleArray("bold italic", "underline"),
    ).toEqual(["bold", "italic", "underline"]);
  });

  it("handles undefined inputs", () => {
    expect(convertTextPropertiesToTextStyleArray(undefined, undefined)).toEqual(
      [],
    );
  });
});

describe("text constants", () => {
  it("exports expected default dimensions", () => {
    expect(TEXT_DEFAULT_WIDTH).toBe(200);
    expect(TEXT_DEFAULT_HEIGHT).toBe(50);
  });
});
