import { commands } from "./commands";

const token = process.env.DISCORD_BOT_TOKEN!;
const appId = process.env.DISCORD_APPLICATION_ID!;

const url = `https://discord.com/api/v10/applications/${appId}/commands`;

const response = await fetch(url, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${token}`,
  },
  method: "PUT",
  body: JSON.stringify(commands),
});

if (response.ok) {
  console.log("Registered all commands");
} else {
  console.error("Error registering commands");
}
