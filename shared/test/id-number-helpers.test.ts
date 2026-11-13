// todo-2 Review this.

import {deepEqual, equal, match, rejects,} from "node:assert/strict";
import {Buffer,} from "node:buffer";
import {copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile,} from "node:fs/promises";
import {tmpdir,} from "node:os";
import {join,} from "node:path";
import {fileURLToPath, pathToFileURL,} from "node:url";
import {parse,} from "date-fns/parse";
import {after, afterEach, before, beforeEach, describe, it,} from "mocha";
import type {updateIdNumber,} from "../project-state/src/id-number-helpers.ts";

describe("updateIdNumber", function () {
   const realDate_ = Date;
   const originalWarn_ = console.warn;
   const fixedTime_ = new realDate_(2026, 10, 8, 23, 59, 0, 0).getTime();
   const warnings_: unknown[][] = [];
   let fixtureDirectory_: string | undefined;
   let previousEnvironmentValue_: string | undefined;
   let dataFilePath_: string;
   let fallbackFilePath_: string;
   let updateIdNumber_: typeof updateIdNumber;

   before(function () {
      globalThis.Date = new Proxy(realDate_, {
         construct(target_, args_) {
            return Reflect.construct(target_, (args_.length === 0) ? [fixedTime_] : args_);
         },
      });
   });

   after(function () {
      globalThis.Date = realDate_;
   });

   beforeEach(async function () {
      fixtureDirectory_ = undefined;
      previousEnvironmentValue_ = process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH;
      warnings_.length = 0;
      console.warn = (...args_: unknown[]) => {
         warnings_.push(args_);
      };

      fixtureDirectory_ = await mkdtemp(join(tmpdir(), "dapp-id-"));
      await mkdir(join(fixtureDirectory_, "src"));
      await mkdir(join(fixtureDirectory_, "data"));
      await mkdir(join(fixtureDirectory_, "node_modules"));
      await symlink(
         fileURLToPath(new URL(".", import.meta.resolve("date-fns"))),
         join(fixtureDirectory_, "node_modules", "date-fns"),
         "junction"
      );
      dataFilePath_ = join(fixtureDirectory_, "external-state.txt");
      fallbackFilePath_ = join(fixtureDirectory_, "data", "last-generated-id-number.txt");
      process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH = dataFilePath_;

      const modulePath_ = join(fixtureDirectory_, "src", "id-number-helpers.ts");
      await copyFile(
         new URL("../project-state/src/id-number-helpers.ts", import.meta.url),
         modulePath_
      );
      ({updateIdNumber: updateIdNumber_,} = await import(pathToFileURL(modulePath_).href));
   });

   afterEach(async function () {
      try {
         if(fixtureDirectory_ !== undefined) {
            await rm(fixtureDirectory_, {recursive: true, force: true,});
         }
      }
      finally {
         if(previousEnvironmentValue_ === undefined) {
            delete process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH;
         }
         else {
            process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH = previousEnvironmentValue_;
         }
         console.warn = originalWarn_;
      }
   });

   const cases_ = [
      ["starts at today's first ID for stale data", "200912319", "202611081"],
      ["increments today's sequence", "202611081", "202611082"],
      ["accepts an initial zero sequence", "202611080", "202611081"],
      ["preserves a future date", "202611151", "202611152"],
      ["rolls sequence nine to the next day", "202611089", "202611091"],
      ["rolls to the next month", "202611309", "202612011"],
      ["rolls to the next year", "202612319", "202701011"],
      ["enters leap day", "202802289", "202802291"],
      ["leaves leap day", "202802299", "202803011"],
      ["skips leap day in a non-leap year", "202702289", "202703011"],
      ["accepts a stored year below 100", "009912319", "202611081"],
   ];

   for(const [description_, previous_, expected_] of cases_) {
      it(description_, async function () {
         await writeFile(dataFilePath_, previous_);
         equal(await updateIdNumber_(), expected_);
         equal(await readFile(dataFilePath_, "utf8"), expected_);
      });
   }

   it("uses the environment path without warning or changing the fallback file", async function () {
      await writeFile(dataFilePath_, "202611081");
      await writeFile(fallbackFilePath_, "200912319");
      equal(await updateIdNumber_(), "202611082");
      equal(await readFile(dataFilePath_, "utf8"), "202611082");
      equal(await readFile(fallbackFilePath_, "utf8"), "200912319");
      equal(warnings_.length, 0);
   });

   for(const value_ of [undefined, ""]) {
      it(`warns and uses the fallback when the environment variable is ${(value_ === undefined) ? "unset" : "empty"}`, async function () {
         if(value_ === undefined) {
            delete process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH;
         }
         else {
            process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH = value_;
         }
         await writeFile(fallbackFilePath_, "202611081");
         equal(await updateIdNumber_(), "202611082");
         equal(await readFile(fallbackFilePath_, "utf8"), "202611082");
         equal(warnings_.length, 1);
         match(String(warnings_[0][0]), /LAST_GENERATED_ID_NUMBER_FILE_PATH.*unset or empty.*fallback/);
      });
   }

   it("preserves every byte after the ID across successive updates", async function () {
      const suffix_ = Buffer.from([0x0a, 0x00, 0xff, 0x41]);
      await writeFile(dataFilePath_, Buffer.concat([Buffer.from("202611081"), suffix_]));
      equal(await updateIdNumber_(), "202611082");
      equal(await updateIdNumber_(), "202611083");
      deepEqual(
         await readFile(dataFilePath_),
         Buffer.concat([Buffer.from("202611083"), suffix_])
      );
   });

   for(const [previous_, message_] of [
      ["123", "Invalid read data size."],
      ["abcdefghi", "Invalid read data."],
      ["999912319", "ID has overflown."],
   ]) {
      it(`rejects ${JSON.stringify(previous_)} without changing the file`, async function () {
         await writeFile(dataFilePath_, previous_);
         await rejects(updateIdNumber_(), {message: message_,});
         equal(await readFile(dataFilePath_, "utf8"), previous_);
      });
   }

   it("reports a missing configured file without falling back or creating it", async function () {
      await writeFile(fallbackFilePath_, "200912319");
      await rejects(updateIdNumber_(), {code: "ENOENT",});
      await rejects(readFile(dataFilePath_), {code: "ENOENT",});
      equal(await readFile(fallbackFilePath_, "utf8"), "200912319");
      equal(warnings_.length, 0);
   });
});

describe("ID date parsing", function () {
   it("zeros omitted time fields for an ordinary local date", function () {
      for(const referenceDate_ of [new Date(0), new Date(2026, 10, 9, 17, 48, 23, 456)]) {
         const parsedDate_ = parse("202611085", "yyyyMMddm", referenceDate_);
         deepEqual(
            [parsedDate_.getHours(), parsedDate_.getMinutes(), parsedDate_.getSeconds(), parsedDate_.getMilliseconds()],
            [0, 5, 0, 0]
         );
      }
   });
});
