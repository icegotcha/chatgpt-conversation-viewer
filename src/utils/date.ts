export function getMessageUpdateDate(msg: { update_time?: number; create_time: number }): string {
  const update = msg.update_time ?? msg.create_time;
  return update ? new Date(update * 1000).toLocaleString() : '';
}
