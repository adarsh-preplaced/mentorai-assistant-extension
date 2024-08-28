import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import useMessageContainer from "./use-message-container";
import LiveConversationContainer from "../live-conversation-container/live-conversation-container";

const MessageContainer = () => {
  const {
    chatMessages,
    handleSubmit,
    loading,
    liveMessages,
    userLiveMessage,
    isLiveMessageStreaming,
  } = useMessageContainer();

  return (
    <div className="h-full py-4 overflow-hidden">
      <MainContainer className="rounded-lg pt-3">
        <ChatContainer>
          <MessageList
            typingIndicator={
              isLiveMessageStreaming && (
                <TypingIndicator content="Striver is typing" />
              )
            }
            autoScrollToBottom={true}
            loading={loading}
          >
            {chatMessages.map((m, i) => {
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
            <LiveConversationContainer
              liveMessages={liveMessages}
              userLiveMessage={userLiveMessage}
            />
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={handleSubmit}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default MessageContainer;
