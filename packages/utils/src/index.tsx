import { render } from "@react-email/components";

import EmailAcceptance from "./emails/email-acceptance";

export const renderEmailAcceptance = (firstname: string) => {
  return render(<EmailAcceptance firstName={firstname} />);
};
