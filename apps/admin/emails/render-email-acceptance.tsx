import { render } from "@react-email/render";

import EmailAcceptance from "./email-acceptance";

export const renderEmailAcceptance = (firstname: string) => {
  return render(<EmailAcceptance firstName={firstname} />);
};
