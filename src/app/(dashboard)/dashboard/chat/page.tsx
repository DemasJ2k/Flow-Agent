import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Chat</h1>
        <p className="text-gray-600">Get trading insights from AI</p>
      </div>
      <div className="h-[calc(100%-4rem)]">
        <ChatInterface />
      </div>
    </div>
  );
}
