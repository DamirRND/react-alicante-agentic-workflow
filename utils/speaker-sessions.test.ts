import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { groupSessionsBySpeaker } from "./speaker-sessions";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a-session",
    title: "A session",
    speaker: "A speaker",
    track: "React",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("groupSessionsBySpeaker", () => {
  it("groups sessions under their speaker, sorted alphabetically by name", () => {
    const groups = groupSessionsBySpeaker([
      session({ id: "keynote", speaker: "Marta Fernandez" }),
      session({ id: "workshop", speaker: "Evangelia Mitsopoulou" }),
    ]);

    expect(groups.map((group) => group.speaker)).toEqual([
      "Evangelia Mitsopoulou",
      "Marta Fernandez",
    ]);
  });

  it("keeps every session from a speaker giving more than one", () => {
    const groups = groupSessionsBySpeaker([
      session({ id: "first", speaker: "Iker Otxoa", startTime: "10:15" }),
      session({ id: "second", speaker: "Iker Otxoa", startTime: "13:00" }),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].sessions.map((s) => s.id)).toEqual(["first", "second"]);
  });

  it("excludes the closing panel's whole-lineup placeholder speaker", () => {
    const groups = groupSessionsBySpeaker([
      session({ id: "closing-panel", speaker: "Full speaker lineup" }),
      session({ id: "keynote", speaker: "Marta Fernandez" }),
    ]);

    expect(groups.map((group) => group.speaker)).toEqual(["Marta Fernandez"]);
  });

  it("returns nothing for no sessions", () => {
    expect(groupSessionsBySpeaker([])).toEqual([]);
  });
});
