'use client';

import { useCallback, useMemo } from 'react';
import ChevronLeft from './icons/ChevronLeft';
import ReactMarkdown from 'react-markdown';

interface MessageContent {
  content_type: string;
  parts: string[];
}

interface MessageAuthor {
  role: "user" | "assistant" | "system";
}

interface MessageMetadata {
  is_visually_hidden_from_conversation?: boolean;
}

interface Message {
  author: MessageAuthor;
  content: MessageContent;
  metadata?: MessageMetadata;
  create_time: number;

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

interface ChatViewProps {
  chat: ChatData;
  onBack: () => void;
}

export default function ChatView({ chat, onBack }: ChatViewProps) {

  const isVisibleMessage = useCallback((node: MessageNode) => {
    return node.message &&
      !node.message?.metadata?.is_visually_hidden_from_conversation &&
      node.message?.author?.role !== 'system' &&
      node.message?.content.content_type === 'text' &&
      node.message?.content?.parts[0] !== '';
  }, []);

  const orderedMessages = useMemo(() => {
    const messages: MessageNode[] = [];
    const mapping = chat.mapping;
    let leafNodes = Object.values(mapping).filter(node => node.children.length === 0);

    const activeChat = leafNodes.sort((a, b) => b.message.create_time - a.message.create_time)[0];
    let currentId = activeChat.id;

    // Follow the chain of messages
    while (currentId && mapping[currentId] && mapping[currentId].parent !== 'client-created-root') {
      const currentNode = mapping[currentId];
      if (isVisibleMessage(currentNode)) {
        messages.push(currentNode);
      }
      // Get the parent as the next message
      currentId = currentNode.parent;
    }

    return messages.reverse();
  }, [chat.mapping]);

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
            className={`flex ${node.message.author.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${node.message.author.role === 'assistant'
                ? 'bg-[#313866] text-white'
                : 'bg-[#FF7BBF]/10 text-white'
                }`}
            >
              {node.message.author.role === 'assistant' ? (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {node.message.content.parts?.join('') || ''}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm">
                  {node.message.content.parts?.join('') || ''}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
