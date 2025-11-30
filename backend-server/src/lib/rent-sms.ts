import { sendNetSms } from "../config/sms-config";
import { normalizePhone } from "./utils";

export async function sendRentReminder({
  to,
  month,
  houseRent,
  waterBill,
  electricityBill,
  gasBill,
  utilityBill,
}: {
  to: string;
  month: string;
  houseRent: number;
  waterBill: number;
  electricityBill: number | null;
  gasBill: number;
  utilityBill: number | null;
}) {
  const banglaMonth = banglaMonths[month] || month;
  let text = `📢 ${banglaMonth} মাসের ভাড়ার বিবরণ:\n`;
  text += `• বাসা ভাড়া: ৳${houseRent}\n`;
  text += `• পানির বিল: ৳${waterBill}\n`;
  if (electricityBill != null) {
    text += `• বিদ্যুৎ বিল: ৳${electricityBill}\n`;
  }
  text += `• গ্যাস বিল: ৳${gasBill}\n`;
  if (utilityBill != null) {
    text += `• ময়লার বিল: ৳${utilityBill}\n`;
  }
  text += `\nঅনুগ্রহ করে নির্ধারিত সময়ের মধ্যে পরিশোধ করুন।\n`;
  text += `- মোঃ আলী নেওয়াজ শিকদার`;

  const normalizedNumber = normalizePhone(to);

  return sendNetSms({ mobileNo: to, msgBody: text });
}

const banglaMonths: Record<string, string> = {
  January: "জানুয়ারি",
  February: "ফেব্রুয়ারি",
  March: "মার্চ",
  April: "এপ্রিল",
  May: "মে",
  June: "জুন",
  July: "জুলাই",
  August: "আগস্ট",
  September: "সেপ্টেম্বর",
  October: "অক্টোবর",
  November: "নভেম্বর",
  December: "ডিসেম্বর",
};
