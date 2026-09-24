import type { Session } from "@/types/session";

/**
 * Not an individual speaker — the closing panel's `speaker` field names the
 * whole day's lineup rather than one person, so it doesn't get its own card.
 */
const NON_SPEAKER_VALUES = new Set(["Full speaker lineup"]);

export interface SpeakerSessions {
  speaker: string;
  sessions: Session[];
}

/**
 * Groups sessions by speaker, alphabetically by name. `sessions` is expected
 * pre-sorted by start time (as `fetchSessions()` returns it), so each group's
 * sessions stay chronological without a second sort here.
 */
export function groupSessionsBySpeaker(sessions: Session[]): SpeakerSessions[] {
  const bySpeaker = new Map<string, Session[]>();

  for (const session of sessions) {
    if (NON_SPEAKER_VALUES.has(session.speaker)) continue;

    const existing = bySpeaker.get(session.speaker);
    if (existing) {
      existing.push(session);
    } else {
      bySpeaker.set(session.speaker, [session]);
    }
  }

  return Array.from(bySpeaker, ([speaker, speakerSessions]) => ({
    speaker,
    sessions: speakerSessions,
  })).sort((a, b) => a.speaker.localeCompare(b.speaker));
}
