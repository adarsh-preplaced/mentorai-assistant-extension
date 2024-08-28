import {
  Avatar,
  Message,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

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
  console.log("liveMessages", liveMessages);

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
        console.log("live", m);
        return (
          <Message key={`${m.props.model.message}-${i}`} {...m.props}>
            {m.props.children}
            <Message.CustomContent>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                className={`prose w-full max-w-[280px] text-[14px]/[22px] text-dashboard-gray-700 md:max-w-[311px]`}
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
                    return <pre {...props} className="max-w-[300px]" />;
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
