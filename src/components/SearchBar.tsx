'use client';

import Close from './icons/Close';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search chats..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-4 py-2 text-sm text-white rounded-lg bg-[#FF7BBF]/10 placeholder-[#964EC2]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-[#50409A]"
        >
          <Close />
        </button>
      )}
    </div>
  );
} 