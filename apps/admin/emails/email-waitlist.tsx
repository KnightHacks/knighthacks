import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailAcceptanceProps {
  firstName: string;
}

const EmailWaitlist: React.FC<Readonly<EmailAcceptanceProps>> = ({
  firstName,
}) => (
  <Html>
    <Head />
    <Preview>You're on the Waitlist for Knighthacks – Stay Tuned!</Preview>
    <Tailwind>
      <Body className="min-h-screen bg-[#f6f9fc] bg-[url('https://storage.googleapis.com/knighthacks-email/background%20(6).png')] bg-cover bg-no-repeat font-sans">
        <Container className="h-full w-full max-w-2xl bg-white px-5 pb-10 shadow-lg">
          <Text className="text-left text-lg leading-relaxed text-gray-700">
            Hi {firstName}, <br />
            <br />
            Thank you for applying to KnightHacks! We're thrilled by the
            overwhelming response and interest in our event. Unfortunately, due
            to limited spots, we've placed you on our waitlist for now. Don't
            worry, though—spots do open up, and we'll keep you updated if any
            become available. You'll be the first to know when a space opens up!
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailWaitlist;
