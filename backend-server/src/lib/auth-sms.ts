import { sendNetSms } from "../config/sms-config";
import { normalizePhone } from "./utils";

export async function sendLoginCode({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  const text = `Your login code is: ${code}\nUse this code to access your account. It expires in 10 minutes.`;

  return sendNetSms({ mobileNo: to, msgBody: text });
}
