import { Messages } from "@/ui_components/Messages";

export default function MessagesPage() {
  return (
    <>
      <div className="md:hidden h-full">
        <Messages />
      </div>
      <div className="hidden md:flex items-center justify-center h-full">
        <p className="text-grey-500">Select a conversation to start chatting</p>
      </div>
    </>
  );
}
