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

import "./message-container.css";
import ChatHeader from "./components/chat-header/chat-header";

const MessageContainer = () => {
  const {
    chatMessages,
    handleSubmit,
    loading,
    liveMessages,
    userLiveMessage,
    isLiveMessageStreaming,
  } = useMessageContainer();

  // const handleKeyDown = useCallback((event) => {
  //   if (event.key === " ") {
  //     event.preventDefault(); // Prevents the default action of the space key (pausing YouTube video)

  //     // Manually insert a space character into the input box
  //     const input = inputRef.current;
  //     if (input) {
  //       const { selectionStart, selectionEnd } = input;
  //       const value = input.value;

  //       // Insert a space character at the cursor's position
  //       input.value =
  //         value.slice(0, selectionStart) + " " + value.slice(selectionEnd);
  //       // Move the cursor to the right of the inserted space
  //       input.setSelectionRange(selectionStart + 1, selectionStart + 1);
  //     }
  //   }
  // }, []);

  return (
    <div
      // className="h-full py-4 overflow-hidden"
      className="chatWrapper"
    >
      <MainContainer
        // className="rounded-[12px] pt-3 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]"
        className="mainContainer"
      >
        <ChatContainer>
          <MessageList
            typingIndicator={
              isLiveMessageStreaming && (
                <TypingIndicator content="Striver is typing" />
              )
            }
            autoScrollToBottom={true}
            autoScrollToBottomOnMount={true}
            loading={loading}
          >
            {chatMessages.map((m, i) => {
              return (
                <Message
                  key={`${m.props.model.message}-${i}`}
                  {...m.props}
                  // style={{ width: "450px" }}
                >
                  {m.props.children}
                  <Message.CustomContent>
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      // className={`prose w-full max-w-[280px] text-[14px]/[22px] md:max-w-[311px]`}
                      className={"prose markdown-prose"}
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
                          return (
                            <pre
                              {...props}
                              // className="max-w-[300px]"
                              style={{ maxWidth: "300px" }}
                            />
                          );
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
            onKeyDownCapture={(e) => {
              e.preventDefault();
            }}
            // onKeyDown={handleKeyDown}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default MessageContainer;
