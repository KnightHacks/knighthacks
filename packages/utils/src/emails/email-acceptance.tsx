import * as React from "react";
import {
  Button,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import acceptance from "../assets/Acceptance.jpg";

interface EmailAcceptanceProps {
  firstName: string;
}

const buttonStyle = {
  backgroundColor: "#7CCCFF",
  color: "black",
  border: "2px solid #7CCCFF",
  padding: "10px 20px",
  borderRadius: "0.375rem",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  textDecoration: "none",
};

const sectionStyle = {
  backgroundColor: "#164460",
  color: "#FFD166",
  border: "2px solid #164460",
  padding: "20px",
  borderRadius: "0.375rem",
  marginBottom: "20px", // Add white space between sections
};

export const EmailAcceptance: React.FC<Readonly<EmailAcceptanceProps>> = ({
  firstName,
}) => (
  <Tailwind>
    <Preview>Thank you for your interest in KnightHacks!</Preview>
    <Section>
      <Img src="https://imgur.com/a/3P7aXuc" alt="ocean" />
      <Text className="mb-4 text-[24px] font-bold text-[#8E3B46]">
        Congratulations {firstName}!
      </Text>
      <Text className="mb-4 text-gray-700">
        We are thrilled to inform you that you have been accepted to
        KnightHacks! Your application stood out, and we can't wait to see the
        innovative ideas you'll bring to the event.
      </Text>
    </Section>
    <Text className="text-[24px] font-bold text-[#8E3B46]">Next Steps:</Text>
    <div className="space-y-6">
      <Section style={sectionStyle}>
        <h1 className="mb-2 text-xl font-semibold ">
          1. Confirm your Attendance
        </h1>
        <Text>
          You've been accepted to KnightHacks! But you're not quite done. Please
          click the link below to confirm your attendance and let us know you're
          going.
        </Text>
        <Button
          style={buttonStyle}
          href="https://2024.knighthacks.org/dashboard"
        >
          Confirm Your Attendance
        </Button>
        <br />
      </Section>
      <Section style={sectionStyle}>
        <h1 className="text-xl">2. Join Our Discord Channel:</h1>
        <Text className="mt-2">
          Connect with fellow hackers, get updates, and collaborate.
        </Text>
        <Button style={buttonStyle} href="https://discord.com/invite/Kv5g9vf">
          Join our Discord!
        </Button>
      </Section>
      <Section style={sectionStyle}>
        <h1 className="text-xl ">3. Post on Social Media</h1>
        <Text className="mt-2 ">
          Let everyone know you will be at KnightHacks.
        </Text>
        <Button
          style={buttonStyle}
          href={acceptance}
          download="Knighthacks-graphic.png"
        >
          Download Graphics
        </Button>
      </Section>
    </div>
    <Text className="mt-6 text-gray-700">
      We're excited to have you on board, {firstName}. If you have any
      questions, don't hesitate to reach out to us.
    </Text>
    <Text className="mt-6 text-gray-700">Best regards,</Text>
    <Text className="text-gray-700">The KnightHacks Team</Text>
  </Tailwind>
);

export default EmailAcceptance;
