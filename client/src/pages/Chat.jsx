import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getChatRooms, getMessages, sendMessage as sendChatMessage } from "../api/chatrooms";

function Chat() {
  const role = useSelector((state) => state.firebaseLogin.role);
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const currentRoom = useMemo(() => rooms.find((room) => room._id === activeRoomId) || null, [rooms, activeRoomId]);

  async function loadRooms() {
    try {
      const response = await getChatRooms();
      const nextRooms = response.data.rooms || [];
      setRooms(nextRooms);

      if (!nextRooms.length) {
        setActiveRoomId("");
        setMessages([]);
        return;
      }

      if (!activeRoomId || !nextRooms.some((room) => room._id === activeRoomId)) {
        setActiveRoomId(nextRooms[0]._id);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not load your conversations right now.");
    } finally {
      setLoadingRooms(false);
    }
  }

  async function loadMessages(chatRoomId) {
    if (!chatRoomId) return;
    setLoadingMessages(true);
    try {
      const response = await getMessages(chatRoomId);
      setMessages(response.data.messages || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not load this conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (!active) return;
      try {
        const response = await getChatRooms();
        const nextRooms = response.data.rooms || [];
        setRooms(nextRooms);

        if (!nextRooms.length) {
          setActiveRoomId("");
          setMessages([]);
          return;
        }

        if (!activeRoomId || !nextRooms.some((room) => room._id === activeRoomId)) {
          setActiveRoomId(nextRooms[0]._id);
        }
      } catch (error) {
        if (active) {
          setMessage(error.response?.data?.message || "We could not refresh your conversations.");
        }
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 500000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [activeRoomId]);

  useEffect(() => {
    if (!activeRoomId) return;
    loadMessages(activeRoomId);
    const interval = window.setInterval(() => {
      loadMessages(activeRoomId);
    }, 500000);

    return () => window.clearInterval(interval);
  }, [activeRoomId]);

  async function handleSend(event) {
    event.preventDefault();
    if (!activeRoomId || !draft.trim()) return;
    setSending(true);
    try {
      const response = await sendChatMessage(activeRoomId, { message: draft.trim() });
      const created = response.data.data;
      setMessages((prev) => [...prev, created]);
      setDraft("");
      await loadRooms();
    } catch (error) {
      setMessage(error.response?.data?.message || "Your message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  const unreadCount = rooms.filter((room) => room.lastMessageId && room.lastMessageId.sender?.role !== role && room.lastMessageId.isSeen === false).length;

  return (
    <main className="care24-page mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="care24-card care24-card--elevated rounded-[2rem] p-7 sm:p-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="care24-badge care24-badge--success">Real-time chat</span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Stay connected with your care team</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Open chats, review recent conversations, and send messages that are stored in MongoDB for a persistent care history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/bookings" className="care24-btn care24-btn--ghost">View bookings</Link>
          </div>
        </div>

        {message ? <div className={`care24-alert mt-5 ${message.includes("could not") || message.includes("not") ? "care24-alert--error" : "care24-alert--success"}`}>{message}</div> : null}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="care24-card rounded-[2rem] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Conversation list</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{unreadCount} unread</span>
          </div>

          {loadingRooms ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="care24-skeleton h-20" />)}
            </div>
          ) : rooms.length ? (
            <ul className="mt-5 space-y-3">
              {rooms.map((room) => {
                const isUnread = room.lastMessageId && room.lastMessageId.sender?.role !== role && room.lastMessageId.isSeen === false;
                return (
                  <li key={room._id}>
                    <button
                      type="button"
                      onClick={() => setActiveRoomId(room._id)}
                      className={`w-full rounded-[1.25rem] border p-4 text-left transition ${activeRoomId === room._id ? "border-primary bg-slate-50" : "border-slate-200 bg-white"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">Care conversation</p>
                          <p className="mt-1 text-sm text-slate-600">{room.bookingId?.status || "Booking active"}</p>
                        </div>
                        {isUnread ? <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">New</span> : null}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="care24-empty mt-6">No conversations have been created yet.</div>
          )}
        </div>

        <div className="care24-card rounded-[2rem] p-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Active chat</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{currentRoom ? "Live conversation" : "Select a conversation"}</h2>
            </div>
            {currentRoom ? <span className="text-sm text-slate-500">{currentRoom.bookingId?.status || "Active"}</span> : null}
          </div>

          {loadingMessages ? (
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="care24-skeleton h-16" />)}
            </div>
          ) : currentRoom ? (
            <>
              <div className="mt-5 space-y-3 overflow-y-auto rounded-[1.5rem] bg-slate-50 p-4">
                {messages.length ? messages.map((item) => {
                  const isOwn = item.sender?.role === role;
                  return (
                    <div key={item._id || `${item.createdAt}-${item.message}`} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-[1.25rem] px-4 py-3 ${isOwn ? "bg-primary text-white" : "bg-white text-slate-700"}`}>
                        <p className="text-sm leading-6">{item.message || "Shared a message"}</p>
                        <p className={`mt-2 text-[11px] uppercase tracking-[0.2em] ${isOwn ? "text-sky-100" : "text-slate-400"}`}>
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                }) : <div className="care24-empty">No messages yet. Start the conversation.</div>}
              </div>

              <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="care24-input flex-1"
                  placeholder="Type your message"
                  maxLength="1000"
                />
                <button type="submit" disabled={sending} className="care24-btn care24-btn--primary">
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="care24-empty mt-6">Select a conversation to open the chat panel.</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Chat;
