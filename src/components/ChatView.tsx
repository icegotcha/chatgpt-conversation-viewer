'use client';

import { useMemo } from 'react';
import ChevronLeft from './icons/ChevronLeft';
import ReactMarkdown from 'react-markdown';
import { getMessageUpdateDate } from '../utils/date';
import { isVisibleMessage } from '@/utils/chat';
import { ChatData, MessageNode } from '@/types/chat';

interface ChatViewProps {
  chat: ChatData;
  onBack: () => void;
  chatUpdateDate: string;
}

export default function ChatView({ chat, onBack, chatUpdateDate }: ChatViewProps) {

  const orderedMessages = useMemo(() => {
    const messages: MessageNode[] = [];
    const mapping = chat.mapping;
    const leafNodes = Object.values(mapping).filter(node => node.children.length === 0);

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
        <div>
          <h2 className="text-xl font-semibold text-[#964EC2]">{chat.title}</h2>
          <p className="text-xs text-[#FF7BBF] mt-1">Last Updated: {chatUpdateDate}</p>
        </div>
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
              <p className="text-xs text-[#FF7BBF] mt-2 text-right">
                {getMessageUpdateDate(node.message)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
