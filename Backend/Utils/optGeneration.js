import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import { TOTP } from "totp-generator";
import thirtyTwo from "thirty-two";

export const otpgeneration = (phoneNumber) => {
  const cleanedphoneNumber = phoneNumber.replace("+", "");

  const phoneNumberHash = crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(cleanedphoneNumber)
    .digest("hex");

  const base32key = thirtyTwo.encode(Buffer.from(phoneNumberHash, "hex")).toString('utf-8');

  return TOTP.generate(base32key, { period: 120, digits: 6 });
};
