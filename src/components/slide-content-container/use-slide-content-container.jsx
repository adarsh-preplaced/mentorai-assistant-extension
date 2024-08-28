import { useEffect, useState } from "react";
import { detectAndFixStructure } from "../../utils/message-container-helper";

const useSlideContentContainer = ({
  lessonDetails,
  isLastConversation,
  role,
}) => {
  const [lastSlideMessageHeight, setLastSlideMessageHeight] = useState(0);

  function convertYoutubeUrlToEmbedUrl(url) {
    // Check if the URL is a valid YouTube video URL
    if (!/youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/.test(url)) {
      return null;
    }
    // Extract the video ID from the URL
    const videoId = url.match(/v=([a-zA-Z0-9_-]+)/)[1];
    // Create the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return embedUrl;
  }

  const getEmbedableUrl = (resourceObject) => {
    if (resourceObject.resource_type === "video") {
      return convertYoutubeUrlToEmbedUrl(resourceObject.resource_data);
    }
    return resourceObject.resource_data;
  };

  function convertToIdentifier(str) {
    return str
      .toLowerCase()
      .replace(/[\s\(\),.'']/g, "")
      .replaceAll(/[^\w\s]/gi, "");
  }

  const convertQuizDataToDesiredData = (quizData, index) => {
    const newQuizData = quizData;

    if (quizData?.question_type || quizData?.slide_type) {
      newQuizData.slide_type = quizData.question_type ?? quizData?.slide_type;
      newQuizData.slide_index_count = index;
      if (quizData?.question_type) delete newQuizData.question_type;
      quizData.data.id = convertToIdentifier(quizData.data.question);
    }
    return newQuizData;
  };

  const getResourcesElement = (resourceObject) => {
    if (resourceObject.resource_type === "video") {
      return `<iframe src='${getEmbedableUrl(
        resourceObject
      )}' width='100%' height='500px' style="margin:20px 0px;"/>`;
    }
    return `<iframe src='${resourceObject.resource_data}'/>`;
  };

  const parseText = (resourceString) => {
    const _uiComponents = [];
    const splitText = resourceString?.split("#-#-#").map((value, index) => ({
      splitTextIndex: index,
      splitTextValue: value.trim(),
    }));
    const marker = {
      quizStart: "[quiz start]",
      quizEnd: "[quiz end]",
      easyActionStart: "[easy action start]",
      easyActionEnd: "[easy action end]",
      codeAreaStart: "[coding area start]",
      codeAreaEnd: "[coding area end]",
      lessonCompleted: "LessonComplete",
      resourceStart: "[resource start]",
      resourceEnd: "[resource end]",
      howLessonsWork: "[how lessons work]",
    };

    for (let i = 0; i < splitText?.length; i++) {
      const { splitTextIndex, splitTextValue } = splitText[i];
      const textDetails = splitTextValue.trim();

      if (textDetails.includes(marker.quizStart)) {
        const startIndex =
          textDetails.indexOf(marker.quizStart) + marker.quizStart.length;
        if (textDetails.includes(marker.quizEnd)) {
          const endIndex = textDetails.indexOf(marker.quizEnd);
          const quizData = textDetails.substring(startIndex, endIndex).trim();
          try {
            let quizObject = JSON.parse(quizData);
            quizObject = convertQuizDataToDesiredData(
              quizObject,
              splitTextIndex
            );
            _uiComponents.push(quizObject);
          } catch (e) {
            console.error("Error Parsing quiz data", e);
          }
        } else {
          const endIndex = textDetails.length - 1;
          const quizData = textDetails.substring(startIndex, endIndex).trim();
          try {
            let quizObject = JSON.parse(detectAndFixStructure(quizData));
            quizObject = convertQuizDataToDesiredData(
              quizObject,
              splitTextIndex
            );
            _uiComponents.push(quizObject);
          } catch (e) {
            console.error("Error Parsing quiz data", e);
            _uiComponents.push({
              slide_type: "loader",
              data: "quiz",
            });
          }
        }
      } else if (textDetails.includes(marker.codeAreaStart)) {
        const startIndex =
          textDetails.indexOf(marker.codeAreaStart) +
          marker.codeAreaStart.length;
        if (textDetails.includes(marker.codeAreaEnd)) {
          const endIndex = textDetails.indexOf(marker.codeAreaEnd);
          const codeAreaData = textDetails
            .substring(startIndex, endIndex)
            .trim();

          try {
            const codeAreaObject = JSON.parse(codeAreaData);
            codeAreaObject.slide_type = "code_editor";
            codeAreaObject.slide_index_count = splitTextIndex;
            delete codeAreaObject.type;
            _uiComponents.push(codeAreaObject);
          } catch (e) {
            console.error("Error Parsing code data", e);
          }
        } else {
          const endIndex = textDetails.length - 1;
          const codeAreaData = textDetails
            .substring(startIndex, endIndex)
            .trim();
          try {
            const codeAreaObject = JSON.parse(
              detectAndFixStructure(codeAreaData)
            );
            codeAreaObject.slide_type = "code_editor";
            delete codeAreaObject.type;
            _uiComponents.push(codeAreaObject);
          } catch (e) {
            console.error("Error Parsing code data", e);
            _uiComponents.push({
              slide_type: "loader",
              data: "code_editor",
            });
          }
        }
      } else if (textDetails.includes(marker.easyActionStart)) {
        const startIndex =
          textDetails.indexOf(marker.easyActionStart) +
          marker.easyActionStart.length;
        if (textDetails.includes(marker.easyActionEnd)) {
          const endIndex = textDetails.indexOf(marker.easyActionEnd);
          const easyActionData = textDetails.substring(startIndex, endIndex);
          try {
            const easyActionObject = JSON.parse(easyActionData);
            easyActionObject.slide_index_count = splitTextIndex;
            _uiComponents.push(easyActionObject);
          } catch (e) {
            console.error("Error Parsing quiz data", e);
          }
        } else {
          const endIndex = textDetails.length - 1;
          const easyActionData = textDetails.substring(startIndex, endIndex);
          try {
            const easyActionObject = JSON.parse(
              detectAndFixStructure(easyActionData)
            );
            _uiComponents.push(easyActionObject);
          } catch (e) {
            console.error("Error Parsing quiz data", e);
            _uiComponents.push({
              slide_type: "loader",
              data: "easy_action",
            });
          }
        }
      } else if (textDetails.includes(marker.resourceStart)) {
        if (textDetails.includes(marker.resourceEnd)) {
          const startIndex =
            textDetails.indexOf(marker.resourceStart) +
            marker.resourceStart.length;
          const endIndex = textDetails.indexOf(marker.resourceEnd);
          const resourceData = textDetails
            .substring(startIndex, endIndex)
            .trim();
          try {
            const resourceObject = JSON.parse(resourceData);
            resourceObject.slide_index_count = splitTextIndex;
            _uiComponents.push({
              type: "text",
              data: getResourcesElement(resourceObject),
            });
          } catch (e) {
            console.error("Error Parsing resource data", e);
          }
        } else {
          _uiComponents.push({
            slide_type: "loader",
            data: "resource",
          });
        }
      } else if (textDetails.includes(marker.lessonCompleted)) {
        const regex = /score is (\d+)\/\d+/;
        const match = textDetails.match(regex);
        let score = 0;
        if (match) {
          score = match[1];
        }
        const component = {
          slide_type: "lesson_completed",
          data: score,
          slide_index_count: splitTextIndex,
        };
        _uiComponents.push(component);
      } else if (textDetails.includes(marker.howLessonsWork)) {
        const component = {
          slide_type: "how_lessons_work",
          slide_index_count: splitTextIndex,
        };
        _uiComponents.push(component);
      } else {
        _uiComponents.push({
          type: "text",
          data: textDetails.replaceAll(/\\n/g, "\n"),
        });
      }
    }

    return _uiComponents;
  };

  const [uiComponents, setUiComponents] = useState(
    parseText(lessonDetails?.content) || []
  );

  const hasAnySildeType = uiComponents.some(
    (obj) =>
      obj.hasOwnProperty("slide_type") || obj.hasOwnProperty("easy_action")
  );

  const showUserInputOnLastMessage =
    isLastConversation &&
    !hasAnySildeType &&
    !lessonDetails.streaming &&
    role === "assistant";

  const uiComponentsObject = {
    uiComponents,
    questionId: lessonDetails.questionId,
    streaming: lessonDetails.streaming,
    showUserInputOnLastMessage,
  };

  const element = document.getElementById("slide-last-message");
  useEffect(() => {
    if (element) {
      setLastSlideMessageHeight(element.offsetHeight + 100);
    }
  }, [element]);

  useEffect(() => {
    setUiComponents(parseText(lessonDetails?.content) || []);
  }, [lessonDetails]);
  return { uiComponentsObject, lastSlideMessageHeight };
};

export default useSlideContentContainer;
