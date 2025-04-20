// src/tyowa/chat.ts

export interface MessageContent {
  content_type: string;
  parts: string[];
}

export interface MessageAuthor {
  role: "user" | "assistant" | "system";
}

export interface MessageMetadata {
  is_visually_hidden_from_conversation?: boolean;
}

export interface Message {
  author: MessageAuthor;
  content: MessageContent;
  metadata?: MessageMetadata;
  create_time: number;
  update_time?: number;
}

export interface MessageNode {
  id: string;
  message: Message;
  parent: string;
  children: string[];
}

export interface ChatData {
  title: string;
  mapping: { [key: string]: MessageNode };
  create_time: number;
}
