import {
  Avatar,
  Message,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import "../message-container/message-container.css";

const eliotIco =
  "https://firebasestorage.googleapis.com/v0/b/preplaced-upload-dev/o/raj_mentorai.svg?alt=media&token=ba4ad093-a354-4c6c-9649-8488ed6d0061";

const messages = [
  {
    props: {
      model: {
        message: "Hello my friend",
        sentTime: "15 mins ago",
        sender: "Eliot",
        direction: "outgoing",
        position: "single",
      },
    },
  },
  {
    props: {
      model: {
        message: "Hello my friend",
        sentTime: "15 mins ago",
        sender: "Zoe",
        direction: "incoming",
        position: "single",
      },
      children: <Avatar src={eliotIco} name="Eliot" />,
    },
  },
];

const LiveConversationContainer = ({ liveMessages, userLiveMessage }) => {

  return (
    <>
      {/* {[...userLiveMessage, ...liveMessages].map((m, i) =>
        m.type === "separator" ? (
          <MessageSeparator key={i} {...m.props} />
        ) : (
          <Message key={i} {...m.props} />
        )
      )} */}
      {[...userLiveMessage, ...liveMessages].map((m, i) => {
        return (
          <Message key={`${m.props.model.message}-${i}`} {...m.props}>
            {m.props.children}
            <Message.CustomContent>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                className={`prose markdown-prose`}
                key={i}
                components={{
                  code: ({ node, ...props }) => {
                    return (
                      <code
                        style={{
                          display: "inline-flex",
                          backgroundColor: "#282c34",
                          color: "white",
                          maxWidth: "300px",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          overflowX: "auto",
                        }}
                        {...props}
                      />
                    );
                  },
                  p: ({ node, ...props }) => {
                    return <p {...props} />;
                  },
                  pre: ({ node, ...props }) => {
                    return <pre {...props} style={{ maxWidth: "300px" }} />;
                  },
                }}
              >
                {m.props.model.message}
              </ReactMarkdown>
            </Message.CustomContent>
          </Message>
        );
      })}
    </>
  );
};

export default LiveConversationContainer;
