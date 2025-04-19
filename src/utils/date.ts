import { MessageNode, ChatData } from '../app/components/ChatView';

export function getMessageUpdateDate(msg: { update_time?: number; create_time: number }): string {
  const update = msg.update_time ?? msg.create_time;
  return update ? new Date(update * 1000).toLocaleString() : '';
}

export function getChatUpdateDate(chat: ChatData): string {
  const messages = Object.values(chat.mapping);
  let latest = 0;
  for (const node of messages) {
    const msg = node.message;
    if (!msg) continue;
    const update = msg.update_time ?? msg.create_time;
    if (update && update > latest) latest = update;
  }
  return latest ? new Date(latest * 1000).toLocaleString() : '';
}
