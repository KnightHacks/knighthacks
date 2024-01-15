export const commands = [
  {
    name: "ping",
    description: "Responds with pong!",
  },
  {
    name: "createevent",
    description: "Creates a new social event.",
    options: [
      {
        name: "name",
        description: "The name of the event.",
        type: 3,
        required: true,
      },
      {
        name: "secret",
        description: "The secret password for the event.",
        type: 3,
        required: true,
      },
      {
        name: "date",
        description: "The date of the event in the format of YYYY-MM-DD.",
        type: 3,
        required: true,
      },
      {
        name: "location",
        description: "The location of the event.",
        type: 3,
        required: true,
      },
      {
        name: "points",
        description: "The points this event is worth.",
        type: 4,
        required: true,
      },
    ],
  },
  {
    name: "clearevents",
    description: "Clears all events.",
  },
  {
    name: "checkpoints",
    description: "Checks your points.",
  },
  {
    name: "checkleaderboard",
    description: "Checks the leaderboard.",
  },
  {
    name: "signin",
    description: "Signs you into an event.",
    options: [
      {
        name: "secret",
        description: "The secret password for the event.",
        type: 3,
        required: true,
      },
    ],
  },
] as const;

export type Command = (typeof commands)[number];
