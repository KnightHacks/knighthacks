import { render } from "@react-email/components";
import { Resend } from "resend";

import EmailConfirmation from "./emails/email-acceptance";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const renderEmailConfirmation = (firstname: string) => {
  return render(<EmailConfirmation firstName={firstname} />);
};
