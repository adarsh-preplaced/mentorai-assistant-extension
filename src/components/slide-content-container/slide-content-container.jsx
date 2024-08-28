import React, { FC, memo, useContext } from "react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
// import SelectorArrayOfOptions from "global-components/ai-assistant/selector-array-of-options/selector-array-of-options";
import { cn } from "../../utils/cn";
import useSlideContentContainer from "./use-slide-content-container";

const SlideContentContainer = memo(
  ({
    lessonDetails,
    handleSubmit = () => {},
    role = "assistant",
    isLastConversation = false,
  }) => {
    console.log("lessonDetails", lessonDetails);
    const { uiComponentsObject, lastSlideMessageHeight } =
      useSlideContentContainer({ lessonDetails, role });

    const { uiComponents, questionId } = uiComponentsObject;

    const renderComponents = (data, index) => {
      try {
        if (data.slide_type === "loader") {
          return <SkeletonLoader />;
        }
        if (data.slide_type === "mcq" && data.data) {
          return <></>;
        }

        if (data.slide_type === "fill_in_the_blanks" && data.data) {
          // console.log("fib", data);
          return <></>;
        }

        if (data.slide_type === "code_editor" && data.data) {
          // console.log("codeeditor", data);
          return <></>;
        }

        if (data.easy_action === "selector") {
          // console.log("selector", data);
          return (
            <SelectorArrayOfOptions
              data={data?.data}
              onSubmit={handleSubmit}
              handleSelect={(e) => console.log(e)}
              buttonContainerClassName=""
              key={index}
              questionId={questionId}
              containerClassName={cn(
                `absolute top-[${lastSlideMessageHeight}px] left-[50px] max-w-[calc(100%-50px)] mt-8`,
                (!isLastConversation || false) && "hidden"
              )}
              slideIndexCount={data?.slide_index_count}
            />
          );
        }

        if (data.slide_type === "lesson_completed") {
          return <></>;
        }

        if (typeof data?.data !== "string") {
          return <></>;
        }

        const checkToSeeIfEasyActionMessage = (value) => {
          const isEasyActionMsg = [].includes(value);
          return isEasyActionMsg;
        };

        return (
          <ReactMarkdown
            rehypePlugins={role !== "user" ? [rehypeRaw] : null}
            className={`prose w-full max-w-[280px] text-[14px]/[22px] text-dashboard-gray-700 md:max-w-[311px]`}
            key={index}
            components={{
              code: ({ node, ...props }) => {
                return (
                  <code
                    style={{
                      display: "inline",
                      backgroundColor: "#282c34",
                      color: "white",
                    }}
                    {...props}
                  />
                );
              },
              p: ({ node, ...props }) => {
                let isAnEasyActionMessage = false;
                if (typeof props?.children === "string") {
                  isAnEasyActionMessage = checkToSeeIfEasyActionMessage(
                    props.children
                  );
                }
                if (isAnEasyActionMessage && props?.children) {
                  return (
                    <div className="flex gap-1">
                      <div className="pt-1">
                        {/* <Lightning /> */}
                        Light
                      </div>
                      <p className="m-0 bg-gradient-to-r from-[#E80E00] to-[#6100DD] bg-clip-text text-[14px]/[22px] font-medium text-transparent">
                        {props.children}
                      </p>
                    </div>
                  );
                }
                return <p {...props} />;
              },
            }}
          >
            {data?.data}
          </ReactMarkdown>
        );
      } catch (e) {
        console.log("error rendering data: ", data);
        return <></>;
      }
    };

    return (
      <div className={`w-full`}>
        <div
          className={`h-fit w-full text-[14px]/[22px] text-dashboard-gray-700 ${
            isLastConversation && `flex flex-col justify-between`
          }`}
        >
          {uiComponents?.map((data, index) => {
            return <div className={``}>{renderComponents(data, index)}</div>;
          })}
        </div>
      </div>
    );
  }
);

export default SlideContentContainer;
