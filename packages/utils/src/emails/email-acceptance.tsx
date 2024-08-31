import * as React from "react";

interface EmailAcceptanceProps {
  firstName: string;
}

export const EmailAcceptance: React.FC<Readonly<EmailAcceptanceProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);

export default EmailAcceptance;
