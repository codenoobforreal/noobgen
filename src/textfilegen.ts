import fsp from "node:fs/promises";
import fs from "node:fs";
import { Buffer } from "node:buffer";
// import { CommanderError } from "commander";

const DEFAULT_SIZE = "1kb";

export async function action(filename: string, options: any) {
  const size = parseSizeOption(options.size);
  if (size) {
    await createEmptyTextFileWithCertainSize(filename, size);
  }
}

export async function createEmptyTextFileWithCertainSize(
  name: string,
  size: number
) {
  return new Promise(async (resolve, reject) => {
    if (size <= 0) {
      reject("size should be bigger than 0");
      return;
    }

    try {
      const filehandler = fs.openSync(name, "w");
      if (size > 0) {
        fs.writeSync(filehandler, Buffer.alloc(1), 0, 1, size - 1);
      }
      fs.closeSync(filehandler);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * parse size option
 * @param value file size with unit
 * @returns actual number
 */
export function parseSizeOption(value?: string) {
  if (!value) {
    value = DEFAULT_SIZE;
  }

  const length = value.length;
  const unit = value.substring(length - 2).toLocaleLowerCase();
  if (unit !== "mb" && unit !== "kb") {
    console.error("size unit should be mb and kb");
    return;
  }

  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    console.error("the number part of size should be valid");
    return;
  }

  if (unit === "mb") {
    return parsedValue * 1000 * 1000;
  } else {
    return parsedValue * 1000;
  }
}
