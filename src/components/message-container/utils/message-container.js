import { Avatar } from "@chatscope/chat-ui-kit-react";

const eliotIco =
  "https://firebasestorage.googleapis.com/v0/b/preplaced-upload-dev/o/raj_mentorai.svg?alt=media&token=ba4ad093-a354-4c6c-9649-8488ed6d0061";

const transformChatMessages = (chatMessages) => {
  return chatMessages.map((chatMessage) => {
    const { sent_by } = chatMessage;
    return {
      props: {
        model: {
          message: chatMessage.message,
          sentTime: "15 mins ago",
          sender: "Eliot",
          direction: sent_by === "assistant" ? "incoming" : "outgoing",
          position: "single",
        },
      },
      children: <Avatar src={eliotIco} name="Eliot" />,
    };
  });
};

export { transformChatMessages };
