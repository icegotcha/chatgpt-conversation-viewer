'use client';

import { useState } from 'react';
import ChevronRight from './icons/ChevronRight';
import FileBrowser from './FileBrowser';
import SearchBar from './SearchBar';
import ChatView from './ChatView';
import { getMessageUpdateDate } from '../utils/date';
import { MessageNode } from '@/types/chat';

interface ChatData {
  title: string;
  mapping: { [key: string]: MessageNode };
  create_time: number;
}

export default function ChatBrowser() {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedChat) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <ChatView
          chat={selectedChat}
          onBack={() => setSelectedChat(null)}
          chatUpdateDate={getMessageUpdateDate(selectedChat)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <FileBrowser
        onFileSelect={setChats}
        onError={(message) => setError(message)}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />

      {error && (
        <div className="p-4 mb-4 text-sm text-white rounded-lg bg-[#FF7BBF]/10 border border-[#964EC2]">
          {error}
        </div>
      )}

      {chats.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#964EC2]">Chats</h2>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <ul className="divide-y divide-[#FF7BBF]/20">
            {filteredChats.map((chat, index) => (
              <li
                key={index}
                className="py-3 hover:bg-[#FF7BBF]/10 rounded-lg transition-colors cursor-pointer"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center justify-between px-3">
                  <div className="flex-1 min-w-0">
                    <div>
                      <h2 className="text-sm font-medium text-white truncate">
                        {chat.title}
                      </h2>
                      <p className="text-xs text-[#FF7BBF] mt-1">
                        Last Updated: {getMessageUpdateDate(chat)}
                      </p>
                    </div>
                  </div>
                  <div className="text-white hover:text-[#50409A]">
                    <ChevronRight />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
