import { Avatar } from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import scrapeData from "../../utils/scraper";
// import { transformChatMessages } from "./utils/message-container";

const useMessageContainer = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [liveMessages, setLiveMessages] = useState([]);
  const [userLiveMessage, setUserLiveMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLiveMessageStreaming, setisLiveMessageStreaming] = useState(false);

  const eliotIco =
    "https://firebasestorage.googleapis.com/v0/b/preplaced-upload-dev/o/raj_mentorai.svg?alt=media&token=ba4ad093-a354-4c6c-9649-8488ed6d0061";

  const userIco = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

  const setLiveMessageFromAssistant = async (reader) => {
    const { done, value } = await reader.read();
    if (done) {
      try {
        fetchMessages();
        setisLiveMessageStreaming(false);
      } catch (e) {}
      return;
    }
    // Convert Uint8Array to string and set the current letter
    const letter = new TextDecoder().decode(value).trim();
    setLiveMessages([
      {
        props: {
          model: {
            message: letter,
            sentTime: "15 mins ago",
            sender: "assistant",
            direction: "incoming",
            position: "single",
          },
          children: <Avatar src={eliotIco} name="Eliot" size="32" />,
        },
      },
    ]);
    setTimeout(() => {
      setLiveMessageFromAssistant(reader);
    }, 0);
  };

  const readStream = async (stream) => {
    const reader = stream.getReader();
    setLiveMessageFromAssistant(reader);
  };

  const sendMessage = async (message) => {
    setisLiveMessageStreaming(true);
    setLiveMessages([]);
    setUserLiveMessage([]);
    setUserLiveMessage([
      {
        props: {
          model: {
            message: message,
            sentTime: "15 mins ago",
            sender: "user",
            direction: "outgoing",
            position: "single",
          },
          children: <Avatar src={userIco} name="Eliot" size="32" />,
        },
      },
    ]);
    // Note - Uncomment if need for waiting message while receving streaming response
    // setTimeout(() => {
    //   setLiveMessages([
    //     {
    //       props: {
    //         model: {
    //           message: "Waiting for response...",
    //           sentTime: "15 mins ago",
    //           sender: "assistant",
    //           direction: "incoming",
    //           position: "single",
    //         },
    //         children: <Avatar src={eliotIco} name="Eliot" />,
    //       },
    //     },
    //   ]);
    // }, 300);
    const body = {
      message: message,
      user_id: "recE6DvZMSfXoxU20",
      mentor_ai_id: "recdIrEzeo6GIXB2C",
      page_context: {
        url: window.location.href,
        content: scrapeData(),
      },
    };
    fetch(
      `${import.meta.env.VITE_PREPLACED_BACKEND_AI_URL}/extension/send_message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => {
        if (res.body) {
          readStream(res.body);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (text) => {
    sendMessage(text);
  };

  const transformChatMessages = (chatMessages) => {
    return chatMessages.map((chatMessage) => {
      const { sent_by, text } = chatMessage;
      return {
        props: {
          model: {
            message: text,
            sentTime: "15 mins ago",
            sender: sent_by !== "assistant" ? "assistant" : "user",
            direction: sent_by !== "assistant" ? "outgoing" : "incoming",
            position: "single",
          },
          children: (
            <Avatar
              src={sent_by === "assistant" ? eliotIco : userIco}
              name={sent_by !== "assistant" ? "assistant" : "user"}
            />
          ),
        },
      };
    });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${
          import.meta.env.VITE_PREPLACED_BACKEND_AI_URL
        }/extension/get_conversation_messages?user_id=recE6DvZMSfXoxU20&mentor_ai_id=recdIrEzeo6GIXB2C`
      );
      const sortedMessages = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const transformedMessages =
        transformChatMessages(sortedMessages).reverse();
      setLoading(false);
      setChatMessages(transformedMessages);
      setLiveMessages([]);
      setUserLiveMessage([]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    chatMessages,
    handleSubmit,
    loading,
    liveMessages,
    userLiveMessage,
    isLiveMessageStreaming,
  };
};

export default useMessageContainer;
