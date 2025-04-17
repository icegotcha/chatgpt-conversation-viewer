'use client';

import { useState, useCallback } from 'react';
import ChevronRight from './icons/ChevronRight';
import Close from './icons/Close';

interface ChatMessage {
  role: string;
  content: string;
}

interface Chat {
  title: string;
  messages: ChatMessage[];
}

export default function ChatBrowser() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedChats = JSON.parse(content);
        
        // Validate the structure
        if (!Array.isArray(parsedChats)) {
          throw new Error('Invalid file format: Expected an array of chats');
        }

        const validChats = parsedChats.map((chat: any) => ({
          title: chat.title || 'Untitled Chat',
          messages: chat.messages || []
        }));

        setChats(validChats);
        setError(null);
      } catch (err) {
        setError('Error parsing file: ' + (err as Error).message);
      }
    };

    reader.readAsText(file);
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="bg-[#FF7BBF]/10 p-3 rounded-lg w-full">
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="bg-[#313866] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#50409A] transition-colors whitespace-nowrap">
                Select files...
              </div>
            </label>
            {selectedFile && (
              <div className="text-sm text-white">
                {selectedFile}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-white rounded-lg bg-[#FF7BBF]/10 border border-[#964EC2]">
          {error}
        </div>
      )}

      {chats.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Chats</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full px-4 py-2 text-sm text-white rounded-lg bg-[#FF7BBF]/10 placeholder-[#964EC2]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-[#50409A]"
                >
                  <Close />
                </button>
              )}
            </div>
          </div>
          <ul className="divide-y divide-[#FF7BBF]/20">
            {filteredChats.map((chat, index) => (
              <li key={index} className="py-3 hover:bg-[#FF7BBF]/10 rounded-lg transition-colors">
                <div className="flex items-center justify-between px-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {chat.title}
                    </p>
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