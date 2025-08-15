export type ChatMessage = {
  id: number;
  message: string;
  time: string; // ISO date string
  sender: string;
  receiver: string;
};

export type ChatMessageGroup = {
  sender: string;
  messages: ChatMessage[];
};

export type ChatDateGroup = {
  date: string; // YYYY-MM-DD
  groups: ChatMessageGroup[];
};

// Groups messages by date (YYYY-MM-DD), then by consecutive sender within that date.
export function groupMessagesByDateAndSender(
  messages: ChatMessage[],
): ChatDateGroup[] {
  if (!messages || messages.length === 0) return [];

  // Sort messages by time ascending to ensure deterministic grouping
  const sorted = [...messages].sort((a, b) => {
    const ta = new Date(a.time).getTime();
    const tb = new Date(b.time).getTime();
    return ta - tb;
  });

  // Bucket by date
  const byDate: Record<string, ChatMessage[]> = {};
  for (const msg of sorted) {
    const date = new Date(msg.time).toISOString().slice(0, 10);
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(msg);
  }

  // Build date groups with consecutive-sender grouping
  const result: ChatDateGroup[] = Object.keys(byDate)
    .sort() // ascending date order
    .map((date) => {
      const dayMessages = byDate[date];
      const groups: ChatMessageGroup[] = [];

      for (const msg of dayMessages) {
        const lastGroup = groups[groups.length - 1];
        if (!lastGroup || lastGroup.sender !== msg.sender) {
          groups.push({ sender: msg.sender, messages: [msg] });
        } else {
          lastGroup.messages.push(msg);
        }
      }

      return { date, groups };
    });

  return result;
}
