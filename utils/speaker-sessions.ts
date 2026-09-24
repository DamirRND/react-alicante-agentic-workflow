import type { Session } from "@/types/session";

/**
 * Not an individual speaker — the closing panel's `speaker` field names the
 * whole day's lineup rather than one person, so it doesn't get its own card.
 *
 * This matches by the exact string seeded in
 * `supabase/migrations/20260917090100_seed_sessions.sql` for the
 * `closing-panel` session. If that seed value is ever edited, update this
 * set to match — an unmatched value fails open (the panel shows up as its
 * own "speaker" card) rather than crashing, so it's easy to miss.
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
