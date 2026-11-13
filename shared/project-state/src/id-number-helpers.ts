// #region

import {Buffer,} from "node:buffer";
import {open,} from "node:fs/promises";
import {join,} from "node:path";
import {format,} from "date-fns/format";
import {parse,} from "date-fns/parse";

// #endregion
// #region `updateIdNumber`

/**
Comment-202405241 relates and/or applies.
*/
export async function updateIdNumber() {
   // #region

   let newIdNumberAsString_: string;

   // #endregion
   // #region

   {
      // #region

      // We use the minutes field for the sequence number, which becomes the final digit of the ID.
      // Some local timezone transitions skip midnight and jump to 1 AM. As a result, omitted hours on that date parse as 1,
      // but that does not break our logic. Hours also can skip, for example, 1 AM and jump to 2 AM.
      // Therefore we use the minutes field instead of hours.
      // For this format, the parser initializes omitted seconds and milliseconds to zero.
      // JavaScript `Date` does not represent leap seconds.
      // In the original Deno implementation, I tried using milliseconds instead of minutes, but the logic didn't work well,
      // apparently because the "S" format specifier sometimes is treated as milliseconds
      // and sometimes as hundreds of milliseconds.
      const idNumberFormatString_ = "yyyyMMddm";

      // To keep it simple, we will read and then write exactly this many bytes.
      // We will ignore and avoid modifying any bytes beyond.
      // Comment-202405241 relates.
      const idNumberLength_ = idNumberFormatString_.length;

      // #endregion
      // #region

      // [Comment-202405241]
      // The user shall manually create this file and populate it with a `idNumberLength_`-digit number
      // that is less than `newDateTimeMinLimit_`, such as `200912319`.
      // Comment-202611203 relates.
      // [/Comment-202405241]
      // [Comment-202611203]
      // The file mentioned in Comment-202405241 already exists in the poject. But I recommend you using a single file
      // for all your projects. So copy the file to a central location outside this workspace
      // and provide its path in this environment variable.
      // You will likely also have to permit your AI agent sandbox to write to the file,
      // similarly to how it's done near Comment-202611205.
      // [/Comment-202611203]
      let dataFilePath_ = process.env.LAST_GENERATED_ID_NUMBER_FILE_PATH;
      if(dataFilePath_ === undefined || dataFilePath_ === "") {
         console.warn("Warning. The `LAST_GENERATED_ID_NUMBER_FILE_PATH` environment variable is unset or empty; using the fallback file.");
         dataFilePath_ = join(import.meta.dirname, "../data/last-generated-id-number.txt");
      }

      // Issue. If this file opening fails due to the file being in use or other temporary error,
      // it would be nice to make multiple open attempts.
      // Issue. In case someone runs multiple instances of this script,
      // it would be nice that they waited on each other to access this file.
      // But keeping it simple.
      const dataFileObject_ = await open(dataFilePath_, "r+");

      // #endregion
      // #region

      try {
         // #region

         const readDataBuffer_ = Buffer.alloc(idNumberLength_);
         const {bytesRead: readDataSize_,} =
            await dataFileObject_.read(readDataBuffer_, 0, idNumberLength_, null);
         if( ! (readDataSize_ === idNumberLength_) ) {
            throw new Error("Invalid read data size.");
         }

         // [Comment-202511244]
         // This guarantees equal numbers of bytes and characters.
         // [/Comment-202511244]
         const oldIdNumberAsString_ = readDataBuffer_.toString("ascii");

         // #endregion
         // #region

         const oldDateTime_ = parse(oldIdNumberAsString_, idNumberFormatString_, new Date(0));
         if(Number.isNaN(oldDateTime_.getTime())) {
            throw new Error("Invalid read data.");
         }

         // Comment-202405241 relates.
         const newDateTimeMinLimit_ = new Date();
         newDateTimeMinLimit_.setHours(0, 1, 0, 0);

         let newDateTime_: Date;
         if(oldDateTime_ < newDateTimeMinLimit_) {
            newDateTime_ = newDateTimeMinLimit_;
         }
         else {
            newDateTime_ = oldDateTime_;
            let sequenceNumber_ = newDateTime_.getMinutes();
            if(sequenceNumber_ < 9) {
               ++ sequenceNumber_;
            }
            else {
               newDateTime_.setDate(newDateTime_.getDate() + 1);
               sequenceNumber_ = 1;
            }
            newDateTime_.setMinutes(sequenceNumber_);
         }
         newIdNumberAsString_ = format(newDateTime_, idNumberFormatString_);
         // console.info(oldIdNumberAsString_, newIdNumberAsString_, newDateTimeMinLimit_.toISOString(), newDateTime_.toISOString());
         if( ! (newIdNumberAsString_.length === idNumberLength_) ) {
            throw new Error("ID has overflown.");
         }

         // #endregion
         // #region

         // Comment-202511244 applies.
         const writtenDataBuffer_ = Buffer.from(newIdNumberAsString_, "ascii");

         const {bytesWritten: writtenDataSize_,} =
            await dataFileObject_.write(writtenDataBuffer_, 0, idNumberLength_, 0);
         if( ! (writtenDataSize_ === idNumberLength_) ) {
            throw new Error("Invalid written data size.");
         }

         // #endregion
      }
      finally {
         // #region

         await dataFileObject_.close();

         // #endregion
      }

      // #endregion
   }

   // #endregion
   // #region

   return newIdNumberAsString_;

   // #endregion
}

// #endregion
