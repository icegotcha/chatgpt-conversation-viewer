import ChatBrowser from './components/ChatBrowser';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          ChatGPT Conversation Viewer
        </h1>
        <ChatBrowser />
      </main>
    </div>
  );
}
