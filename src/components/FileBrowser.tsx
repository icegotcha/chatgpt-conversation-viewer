'use client';

import { ChatData } from "@/types/chat";

interface FileBrowserProps {
  onFileSelect: (chats: ChatData[]) => void;
  onError: (error: string) => void;
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
}

export default function FileBrowser({ onFileSelect, onError, selectedFile, setSelectedFile }: FileBrowserProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // Validate each chat has required fields
        const validChats = parsedChats.map((chat: ChatData) => {
          if (!chat.mapping || typeof chat.mapping !== 'object') {
            throw new Error('Invalid chat format: Missing or invalid mapping object');
          }
          if (!chat.title) {
            chat.title = 'Untitled Chat';
          }
          return chat;
        });

        onFileSelect(validChats);
      } catch (err) {
        onError('Error parsing file: ' + (err as Error).message);
        setSelectedFile(null);
      }
    };

    reader.readAsText(file);
  };

  return (
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
  );
}
