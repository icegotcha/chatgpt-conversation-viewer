'use client';

import { useMemo } from 'react';
import ChevronLeft from './icons/ChevronLeft';

interface MessageContent {
  content_type: string;
  parts: string[];
}

interface MessageAuthor {
  role: "user" | "assistant" | "system";
}

interface MessageMetadata {
  is_visually_hidden_from_conversation?: boolean;
  [key: string]: any;
}

interface Message {
  author: MessageAuthor;
  content: MessageContent;
  create_time: number;
  metadata?: MessageMetadata;
}

interface MessageNode {
  id: string;
  message: Message;
  parent: string;
  children: string[];
}

interface ChatData {
  title: string;
  mapping: { [key: string]: MessageNode };
  create_time: number;
}

interface ChatViewProps {
  chat: ChatData;
  onBack: () => void;
}

export default function ChatView({ chat, onBack }: ChatViewProps) {
  // Build ordered list of messages by following parent-child relationships
  const orderedMessages = useMemo(() => {
    const messages: MessageNode[] = [];
    const mapping = chat.mapping;
    
    // Find the last message (one without children)
    let currentId = Object.values(mapping).findLast(node => node.children.length === 0)?.id;
    
    // Follow the chain of messages
    while (currentId && mapping[currentId] && mapping[currentId].parent !== 'client-created-root') {
      const currentNode = mapping[currentId];
      
      // Only add messages that are not hidden
      if (!currentNode.message.metadata?.is_visually_hidden_from_conversation) {
        messages.push(currentNode);
      }
      
      // Get the parent as the next message
      currentId = currentNode.parent;
    }

    // Add the root message if it's not hidden
    const rootMessageId = mapping['client-created-root'].children[0];
    const rootMessage = mapping[rootMessageId];
    if (rootMessage && !rootMessage.message.metadata?.is_visually_hidden_from_conversation) {
      messages.push(rootMessage);
    }
    
    return messages.reverse();
  }, [chat.mapping]);

  console.log(orderedMessages);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-white hover:text-[#50409A] transition-colors"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[#964EC2]">{chat.title}</h2>
      </div>

      <div className="space-y-4">
        {orderedMessages.map((node) => (
          <div
            key={node.id}
            className={`flex ${
              node.message.author.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                node.message.author.role === 'assistant'
                  ? 'bg-[#313866] text-white'
                  : 'bg-[#FF7BBF]/10 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">
                {node.message.content.parts?.join('') || ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 