import { useEffect, useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { supabase } from '../supabase/client-supabase';

dayjs.extend(relativeTime);

export default function RealtimeChat({ data }) {
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  const chatContainerStyle = {
    marginTop: '5px',
    padding: '0px 3px',
    width: '100%',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#1b121b',
    overflowY: 'auto',
  };

  const scrollSmoothToBottom = useCallback(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, []);

  const getInitialMessages = useCallback(async () => {
    setLoadingInitial(true);
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("game_id", data?.id)
      .order("created_at");

    if (error) {
      setError(error.message);
      return;
    }
    setLoadingInitial(false);
    setMessages(messages);
  }, [data?.id]);

  useEffect(() => {
    if (!data?.id) return;
    getInitialMessages();

    const channel = supabase
      .channel(`game_chat_${data.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${data.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [data?.id, getInitialMessages]);

  useEffect(() => {
    if (!loadingInitial && messages.length > 0) {
      scrollSmoothToBottom();
    }
  }, [messages, loadingInitial, scrollSmoothToBottom]);

  return (
    <div className="chat-container-cyber" ref={messageRef} style={chatContainerStyle}>
      {loadingInitial && (
        <div className="text-center text-cyber mt-3">
          <span>Caricamento messaggi...</span>
        </div>
      )}
      {error && (
        <div className="chat-error-cyber text-center mt-3">
          Errore: {error}
        </div>
      )}
      {!loadingInitial && !error && messages.length === 0 && (
        <div className="text-center text-cyber mt-3">
          <span>Nessun messaggio ancora. Inizia a chattare!</span>
        </div>
      )}
      {messages.map((message) => (
        <article key={message.id} className="chat-message-cyber">
          <p className="chat-username-cyber">{message.profile_username}</p>
          <small className="chat-content-cyber">{message.content}</small>
          <p className="chat-timestamp-cyber">
            {dayjs().to(dayjs(message.created_at))}
          </p>
        </article>
      ))}
    </div>
  );
}
