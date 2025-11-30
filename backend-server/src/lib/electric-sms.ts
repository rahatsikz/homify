import { sendNetSms } from "../config/sms-config";

export async function sendLowBalanceAlert({ to, balance }: { to: string; balance: number }) {
  const text = `🚨 সতর্কতা: বিদ্যুৎ ব্যালেন্স কমেছে 🚨
আপনার বিদ্যুৎ ব্যালেন্স মাত্র ৳${balance.toFixed(2)}।
দয়া করে দ্রুত রিচার্জ করুন যাতে বিদ্যুৎ সার্ভিস বন্ধ না হয়।`;
  return sendNetSms({ mobileNo: to, msgBody: text });
}