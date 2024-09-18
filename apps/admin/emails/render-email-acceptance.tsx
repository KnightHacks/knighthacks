import { render } from "@react-email/components";

import EmailAcceptance from "./email-acceptance";
import EmailWaitlist from "./email-waitlist";

export const renderEmailAcceptance = (firstname: string) => {
  return render(<EmailAcceptance firstName={firstname} />);
};

export const renderEmailWaitlist = (firstname: string) => {
  return render(<EmailWaitlist firstName={firstname} />);
};
