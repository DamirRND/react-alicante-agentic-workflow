import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";
import type { Session } from "@/types/session";

import { SpeakerCard } from "./speaker-card";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "opening-keynote",
    title: "Opening Keynote",
    speaker: "Marta Fernandez",
    track: "React",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("SpeakerCard", () => {
  it("shows the speaker's name and their session's title and start time", () => {
    render(<SpeakerCard speaker="Marta Fernandez" sessions={[session()]} />);

    expect(screen.getByText("Marta Fernandez")).toBeInTheDocument();
    expect(screen.getByText("Opening Keynote")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("links each session to its session page", () => {
    render(
      <SpeakerCard
        speaker="Marta Fernandez"
        sessions={[session({ id: "opening-keynote" })]}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/en/sessions/opening-keynote",
    );
  });

  it("lists every session for a speaker giving more than one", () => {
    render(
      <SpeakerCard
        speaker="Iker Otxoa"
        sessions={[
          session({ id: "first", title: "First talk", startTime: "10:15" }),
          session({ id: "second", title: "Second talk", startTime: "13:00" }),
        ]}
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText("First talk")).toBeInTheDocument();
    expect(screen.getByText("Second talk")).toBeInTheDocument();
  });
});
