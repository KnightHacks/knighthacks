import { render } from "@react-email/components";
import { Resend } from "resend";

import EmailAcceptance from "./emails/email-acceptance";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const renderEmailConfirmation = (firstname: string) => {
  return render(<EmailAcceptance firstName={firstname} />);
};
