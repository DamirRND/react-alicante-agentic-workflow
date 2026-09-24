import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Link } from "@/i18n/navigation";
import type { SpeakerSessions } from "@/utils/speaker-sessions";
import { Flex, Text } from "@chakra-ui/react";

export function SpeakerCard({ speaker, sessions }: SpeakerSessions) {
  return (
    <Card height="full">
      <CardHeader>
        <CardTitle fontSize="md">{speaker}</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex direction="column" gap="2" as="ul" listStyleType="none">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link href={`/sessions/${session.id}`}>
                <Flex
                  justify="space-between"
                  align="baseline"
                  gap="2"
                  color="var(--text-primary)"
                  _hover={{ color: "var(--accent-hex)" }}
                >
                  <Text fontSize="sm" truncate>
                    {session.title}
                  </Text>
                  <Text fontSize="sm" color="var(--text-muted)" flexShrink="0">
                    {session.startTime}
                  </Text>
                </Flex>
              </Link>
            </li>
          ))}
        </Flex>
      </CardContent>
    </Card>
  );
}
