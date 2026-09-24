import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";
import type { Session } from "@/types/session";

import { SessionBlock } from "./session-block";

const session: Session = {
  id: "opening-keynote",
  title: "Opening Keynote",
  speaker: "Marta Fernandez",
  track: "React",
  level: "beginner",
  room: "Main Hall",
  startTime: "09:00",
  durationMinutes: 45,
  description: "",
};

describe("SessionBlock", () => {
  it("shows the title, the start time, the speaker and the level", () => {
    render(<SessionBlock session={session} top={0} height={72} />);

    expect(screen.getByText("Opening Keynote")).toBeInTheDocument();
    // RTL's default text matching only concatenates an element's own direct
    // text-node children, so this matches the visible text and naturally
    // skips the nested srOnly label span checked separately below.
    expect(
      screen.getByText("09:00 · Marta Fernandez · beginner"),
    ).toBeInTheDocument();
  });

  it("gives the level a screen-reader-only label", () => {
    render(<SessionBlock session={session} top={0} height={72} />);

    // Sighted users just see "beginner" (asserted above); assistive tech
    // additionally gets a "Level:" label via a visually-hidden span.
    expect(screen.getByText("Level:")).toBeInTheDocument();
  });

  it("links to the session page", () => {
    render(<SessionBlock session={session} top={0} height={72} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/en/sessions/opening-keynote",
    );
  });

  it("shows a level other than beginner", () => {
    render(
      <SessionBlock
        session={{ ...session, level: "advanced" }}
        top={0}
        height={72}
      />,
    );

    expect(
      screen.getByText("09:00 · Marta Fernandez · advanced"),
    ).toBeInTheDocument();
  });
});
