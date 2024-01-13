export const commands = [
  {
    name: "ping",
    description: "Responds with pong!",
  },
] as const;

export type Command = (typeof commands)[number];
