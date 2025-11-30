import axios from "axios";
import config from "./index";

const API_URL = "https://netsmsbd.com/v1.1/sms";

interface NetSmsResponseItem {
  statusCode: string; // "1000" = success
  statusMsg: string;
  mobileNo?: string;
  smsId?: string;
}

export async function sendNetSms({
  mobileNo,
  msgBody,
}: {
  mobileNo: string;
  msgBody: string;
}) {
  const payload = {
    apiKey: config.netsmsBD_api_key,
    senderId: config.netsmsBD_sender_id,
    mobileNo,
    msgBody,
  };

  try {
    const response = await axios.post<NetSmsResponseItem[]>(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const [firstIndex] = response.data;
    const { statusCode, statusMsg } = firstIndex;

    if (statusCode !== "1000") {
      throw new Error(`NetSMSBD Error ${statusCode}: ${statusMsg}`);
    }

    return firstIndex; // you can return smsId, mobileNo, statusMsg as needed
  } catch (err: any) {
    console.error("SMS API error:", err.response?.data || err.message);
    throw err;
  }
}
