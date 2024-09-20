import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailAcceptanceProps {
  firstName: string;
}

const EmailAcceptance: React.FC<Readonly<EmailAcceptanceProps>> = ({
  firstName,
}) => (
  <Html>
    <Head />
    <Preview>
      🎉 Congratulations! You've been accepted to Knight Hacks! 🚀
    </Preview>
    <Tailwind>
      <Body className="m-0 bg-[#f6f9fc] bg-[url('https://storage.googleapis.com/knighthacks-email/background%20(6).png')] bg-cover bg-no-repeat p-0 font-sans">
        <Container className="relative mx-auto my-8 w-[600px] bg-white px-5 pb-0 pt-0 shadow-lg">
          <table cellPadding="0" cellSpacing="0" width="100%">
            <tr>
              <td align="center" style={{ paddingBottom: "10px" }}>
                <table cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ height: "60px" }}></td>
                  </tr>
                  <tr>
                    <td align="center">
                      <Img
                        src="https://storage.googleapis.com/knighthacks-email/lenny%20(1).png"
                        width="120"
                        height="120"
                        alt="Knight Hacks Mascot"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <Heading className="mb-2.5 mt-8 text-center text-4xl font-bold leading-tight text-[#1C5699]">
            Congrats, {firstName}! 🎊
          </Heading>
          <Heading className="m-0 mb-5 text-center text-2xl font-bold leading-tight text-[#4782C6]">
            You've been accepted to Knight Hacks 2024!
          </Heading>
          <Text className="mb-6 text-center text-lg leading-relaxed text-gray-700">
            We can't wait to see you on UCF Campus on October 4th - 6th.
          </Text>

          <Section className="relative -mx-5 -mb-5">
            <div className="h-30 flex items-center justify-center bg-[url('https://storage.googleapis.com/knighthacks-email/sand.png')] bg-cover">
              <Heading className="text-shadow mt-14 pl-5 text-center text-2xl font-bold leading-tight text-[#633F07]">
                Next Steps
              </Heading>
            </div>

            <div className="py-7.5 bg-gradient-to-b from-[rgba(46,144,255,0.08)] to-[rgba(28,86,153,0.32)] px-5">
              <Section className="mb-7.5 mt-12">
                <Heading className="m-0 mb-2.5 text-xl font-bold leading-tight text-[#1C5699]">
                  1. Confirm Your Spot
                  <Text className="mt-1.25 mb-0 text-base font-medium text-[#4782C6]">
                    (Required by October 3rd)
                  </Text>
                </Heading>
                <Text className="mb-6 text-lg leading-relaxed text-gray-700">
                  You applied and have been accepted to Knight Hacks 2024, but
                  there is one more step. Click the button below, sign in, and
                  confirm your attendance to be able to attend the event. Even
                  if you have been accepted, there is a chance to lose the
                  ability to confirm if you wait too long. So please confirm
                  ASAP spots are filling quickly
                </Text>
                <Link
                  href="https://2024.knighthacks.org/sign-in"
                  className="inline-block rounded-lg bg-[#4782C6] px-6 py-3 text-center text-lg font-bold leading-relaxed text-white no-underline shadow-md transition duration-300 ease-in-out hover:bg-[#3671B5]"
                >
                  🚀 Confirm Attendance
                </Link>
              </Section>

              <Img
                src="https://storage.googleapis.com/knighthacks-email/seperator%20(1).png"
                alt="Divider"
                className="my-7.5 -ml-5 mt-12 w-[calc(100%)]"
              />

              <Section className="mb-7.5 mt-12">
                <Heading className="m-0 mb-2.5 text-xl font-bold leading-tight text-[#1C5699]">
                  2. Join Our Discord Community
                </Heading>
                <Text className="mt-1.25 mb-0 text-base font-medium text-[#4782C6]">
                  (Required by October 3rd)
                </Text>
                <Text className="mb-6 text-lg leading-relaxed text-gray-700">
                  Connect with fellow hackers, mentors, and organizers on our
                  Discord server. Stay updated on announcements, find teammates,
                  and get your questions answered.{" "}
                  <span className="font-bold">
                    Remember to set your correct Discord handle in the Knight
                    Hacks portal, as joining the Discord is required this year.
                  </span>
                </Text>
                <Link
                  href="https://discord.com/invite/Kv5g9vf"
                  className="inline-block rounded-lg bg-[#4782C6] px-6 py-3 text-center text-lg font-bold leading-relaxed text-white no-underline shadow-md transition duration-300 ease-in-out hover:bg-[#3671B5]"
                >
                  💬 Join Discord
                </Link>
              </Section>

              <Img
                src="https://storage.googleapis.com/knighthacks-email/seperator%20(1).png"
                alt="Divider"
                className="my-7.5 -ml-5 mt-12 w-[calc(100%)]"
              />

              <Section className="mb-7.5 mt-12">
                <Heading className="m-0 mb-2.5 text-xl font-bold leading-tight text-[#1C5699]">
                  3. Spread the Excitement
                </Heading>
                <Text className="mb-6 text-lg leading-relaxed text-gray-700">
                  You've earned your spot at Knight Hacks 2024 – it's time to
                  celebrate! Share your achievement on social media and inspire
                  others. Plus, it's a great way to catch the eye of potential
                  recruiters!
                </Text>
                <Link
                  href="https://i.imgur.com/XQXmUvb.png"
                  className="inline-block rounded-lg bg-[#4782C6] px-6 py-3 text-center text-lg font-bold leading-relaxed text-white no-underline shadow-md transition duration-300 ease-in-out hover:bg-[#3671B5]"
                >
                  🎨 Get Social Graphics
                </Link>
              </Section>
            </div>
          </Section>

          <Section className="-mt-0">
            <table cellPadding="0" cellSpacing="0" border={0} width="100%">
              <tr>
                <td align="right" style={{ paddingTop: "20px" }}>
                  <Img
                    src="https://storage.googleapis.com/knighthacks-email/tk.png"
                    width="150"
                    alt="Pirate Knight"
                  />
                </td>
              </tr>
            </table>
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              className="-mt-32"
              style={{ backgroundColor: "#f0f7ff" }}
            >
              <tr>
                <td
                  align="center"
                  style={{ paddingTop: "30px", paddingBottom: "24px" }}
                >
                  <Heading className="text-center text-2xl font-bold leading-tight text-[#1C5699]">
                    Essential Resources
                  </Heading>
                </td>
              </tr>
              <tr>
                <td>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    width="100%"
                  >
                    <tr>
                      <td
                        width="50%"
                        align="center"
                        valign="top"
                        style={{ paddingBottom: "30px" }}
                      >
                        <Link
                          href="https://2024.knighthacks.org"
                          className="inline-block text-center no-underline"
                        >
                          <Text className="block text-lg font-semibold text-[#1C5699]">
                            Official Website
                          </Text>
                        </Link>
                      </td>
                      <td
                        width="50%"
                        align="center"
                        valign="top"
                        style={{ paddingBottom: "30px" }}
                      >
                        <Link
                          href="https://knight-hacks.notion.site/Hackers-Guide-Knight-Hacks-VII-9e103bd7de114151887e0da523076ecd"
                          className="inline-block text-center no-underline"
                        >
                          <Text className="block text-lg font-semibold text-[#1C5699]">
                            Hacker's Guide
                          </Text>
                        </Link>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </Section>

          <Section className="bg-[#1C5699] p-5 text-center">
            <Text className="my-1.25 text-sm text-white">
              Questions? Reach out to us at{" "}
              <Link
                href="mailto:team@knighthacks.org"
                className="text-[#FFD700] underline"
              >
                hackteam@knighthacks.org
              </Link>
            </Text>
            <Text className="my-1.25 text-sm text-white">
              We can't wait to see what you'll create at Knight Hacks 2024!
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailAcceptance;
