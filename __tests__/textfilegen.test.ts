import { afterEach } from "node:test";
import {
  parseSizeOption,
  createEmptyTextFileWithCertainSize,
} from "../src/textfilegen";
import { describe, test, expect, vi } from "vitest";
import path from "node:path";
import fs from "node:fs";

const testFileName = "test.txt";
const genFile = path.join(".", testFileName);

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(genFile, { recursive: true, force: true });
});

describe("parseSizeOption", () => {
  test("return default size when size is omitted", () => {
    expect(parseSizeOption(undefined)).toBe(1 * 1000);
  });

  test("return exact number when using correct input", () => {
    expect(parseSizeOption("10kb")).toBe(10 * 1000);
    expect(parseSizeOption("100kb")).toBe(100 * 1000);
    expect(parseSizeOption("1mb")).toBe(1 * 1000 * 1000);
    expect(parseSizeOption("10mb")).toBe(10 * 1000 * 1000);
    expect(parseSizeOption("100mb")).toBe(100 * 1000 * 1000);
  });

  test("log error message when size is not end with kb or mb", () => {
    const errorSpy = vi.spyOn(console, "error");
    parseSizeOption("10");
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("size unit should be mb and kb");
    parseSizeOption("10xx");
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("size unit should be mb and kb");
  });

  test("log error message when size number is not a number", () => {
    const errorSpy = vi.spyOn(console, "error");
    parseSizeOption("NaNmb");
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      "the number part of size should be valid"
    );
  });
});

describe("createEmptyTextFileWithCertainSize", () => {
  test("reject negative size", async () => {
    await expect(
      createEmptyTextFileWithCertainSize(testFileName, -10)
    ).rejects.toBe("size should be bigger than 0");
  });

  test("resolve positive size", async () => {
    const size = 1000;
    const spyFn = vi.fn(createEmptyTextFileWithCertainSize);
    await spyFn(testFileName, size);
    expect(spyFn).toHaveResolvedWith(true);
  });

  test("create file correctly", async () => {
    const size = 1000;
    await createEmptyTextFileWithCertainSize(testFileName, size);
    const genfileStat = fs.statSync(genFile);
    expect(genfileStat.isFile()).toBe(true);
    expect(genfileStat.size).toBeGreaterThanOrEqual(size);
  });
});
