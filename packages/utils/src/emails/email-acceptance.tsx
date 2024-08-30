import * as React from "react";

interface EmailConfirmationProps {
  firstName: string;
}

export const EmailConfirmation: React.FC<Readonly<EmailConfirmationProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);

export default EmailConfirmation;
