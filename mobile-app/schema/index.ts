import { z } from "zod";

export const mobileSchema = z.object({
  mobile: z.string().refine(
    (val) => {
      const cleaned = val.replace(/\D/g, "");
      return (
        /^01[0-9]{9}$/.test(cleaned) || // local format: 01XXXXXXXXX
        /^8801[0-9]{9}$/.test(cleaned) || // intl without plus: 8801XXXXXXXXX
        /^\+8801[0-9]{9}$/.test(val) // intl with plus: +8801XXXXXXXXX
      );
    },
    {
      message: "Enter a valid Bangladeshi mobile number",
    }
  ),
});
