import type { RouterOutput } from "@knighthacks/api";
import { renderEmailConfirmation, resend } from "@knighthacks/utils";

type HackerType = RouterOutput["hacker"]["adminAll"][number];

export async function sendAcceptanceEmail(hacker: HackerType) {
  try {
    console.log("async: ", hacker);
    await resend.emails.send({
      from: "status@knighthacks.org",
      to: hacker.user.email,
      subject: "Knighthacks Acceptance",
      html: renderEmailConfirmation(hacker.user.firstName),
    });

    return {
      success: hacker,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}
