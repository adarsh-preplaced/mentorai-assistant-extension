import useMenteeData from 'core/hook/use-mentee-data';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isValidJSON } from 'routes/dashboard/session-v3/utils/is-valid-json';
import { Message } from 'provider/ai-propilot/message';
import { useAppSelector } from 'core/redux/hooks';
import { getLocalStorageItem, removeFromLocalStorage } from 'core/utils/get-item-to-localstorage/get-item-to-localstorage';
import { setLocalStorageItem } from 'core/utils/set-item-to-localstorage/set-item-to-localstorage';
import {
  useLazyGetConversationMessagesQuery,
  // usePostSendMessageMutation
} from 'services/preplaced-ai/mentor-ai-chat/mentor-ai-chat.query';
import { AiMentorDataContext } from 'provider/ai-mentor-data/ai-mentor-data.context';
import { detectAndFixStructure } from 'views/mentorai/id/roadmap/utils/lesson-messages-helper';

export const PREPLACED_ANONYMOUS_ID_CONST = 'preplacedAnonymousId';

type useAiProPilotContextProp = {
  useFor?: 'widget' | 'page';
};

const useAiProPilotContext = ({ useFor = 'page' }: useAiProPilotContextProp) => {
  /* -------------------------------------------------------------------------- */
  /*                                Local States                                */
  /* -------------------------------------------------------------------------- */
  const [isLoading, setIsLoading] = useState(false);
  const [actionInputData, setActionInputData] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [showRightSection, setShowRightSection] = useState(false);
  const [showSkipResponse, setShowSkipResponse] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [currentLetter, setCurrentLetter] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const preplacedAnonymousId = getLocalStorageItem(PREPLACED_ANONYMOUS_ID_CONST);
  const segmentAnonymousId = getLocalStorageItem('ajs_anonymous_id');
  const authState = useAppSelector(state => state.authState);
  const { firebaseLoading, isProfileCompleted, currentUser } = authState;

  const { aiMentorRecordId } = useContext(AiMentorDataContext);

  /* -------------------------------------------------------------------------- */
  /*                              GLobal Data Usage                             */
  /* -------------------------------------------------------------------------- */
  const { menteeProfileData, recordId } = useMenteeData();
  const { propilotConversationId } = menteeProfileData;

  const getUserId = () => {
    if (firebaseLoading === false) {
      // If User is Logged In
      if (recordId) {
        return { isLoggedInUser: true, recordId };
      }
      return { isLoggedInUser: false, recordId: getLocalStorageItem(PREPLACED_ANONYMOUS_ID_CONST) };
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Updater Function                          */
  /* -------------------------------------------------------------------------- */

  const updateCurrentLetter = useCallback((_letter: string) => {
    setCurrentLetter(_letter);
  }, []);

  const updateShowSkipResponse = useCallback((value: boolean) => {
    setShowSkipResponse(value);
  }, []);

  const updateRunId = useCallback((runId: string) => {
    setRunId(runId);
  }, []);

  const updateLoading = useCallback((loadingState: boolean) => {
    setIsLoading(loadingState);
  }, []);

  const updateActionInputData = useCallback((_actionInputData: any) => {
    setActionInputData(_actionInputData);
  }, []);

  const updateMessages = useCallback((_messages: any) => {
    localStorage.setItem(propilotConversationId, JSON.stringify(_messages));
    return setMessages(_messages);
  }, []);

  const updateShowRightSection = () => {
    setShowRightSection(!showRightSection);
  };

  /* -------------------------------------------------------------------------- */
  /*                                Get Messages                                */
  /* -------------------------------------------------------------------------- */

  function parseMessage(message: string) {
    // Find the part that starts with '[easy action start]' and ends with '[easy action end]'
    const easyActionStartIndex = message.indexOf('[easy action start]');
    const easyActionEndIndex = message.indexOf('[easy action end]');

    let messageWithoutEasyActionPart = message;
    let easyActionContent;
    // Extract the easyActionPart and remove it from the message
    if (easyActionStartIndex !== -1 && easyActionEndIndex !== -1) {
      const easyActionPart = message.substring(easyActionStartIndex, easyActionEndIndex + '[easy action end]'.length);
      messageWithoutEasyActionPart = message.replace(easyActionPart, '').trim();
      messageWithoutEasyActionPart = messageWithoutEasyActionPart.replace('[Function call to functions.find_suitable_mentor]', '');
      // Remove '[easy action start]' and '[easy action end]' from the easyActionPart
      easyActionContent = easyActionPart.replace('[easy action start]', '').replace('[easy action end]', '').trim();
    }

    // Split the message (without the easyActionPart) at '#-#-#'
    const parts = [messageWithoutEasyActionPart]; // .split('#-#-#');

    return {
      parts,
      easyActionContent,
    };
  }

  const processMessages = (message: string, _messagesArray: any, totalNumberOfMessages: number, msgDetails: any, currentMessageIndex: number): any => {
    if (msgDetails?.sent_by === 'assistant') {
      const { parts, easyActionContent } = parseMessage(message);
      let skipProfileRepeat = false;
      if (parts?.length) {
        parts.forEach((part: any) => {
          _messagesArray.push({
            ...msgDetails,
            role: 'assistant',
            message: {
              type: 'text',
              value: part,
              skipProfileRepeat,
            },
          });
          skipProfileRepeat = true;
        });
      }

      if (currentMessageIndex === totalNumberOfMessages && easyActionContent && isValidJSON(easyActionContent)) {
        const parsedValue = JSON.parse(easyActionContent);
        setActionInputData(parsedValue);
      }
    } else {
      _messagesArray.push({
        ...msgDetails,
        role: 'user',
        message: {
          type: 'text',
          value: message,
        },
      });
    }
  };

  const handleContent = (msgDetails: any, _messagesArray: any, totalNumberOfMessages: number, currentMessageIndex: any) => {
    // Initialize an empty array for the messages

    if (msgDetails?.text) {
      return processMessages(msgDetails.text, _messagesArray, totalNumberOfMessages, msgDetails, currentMessageIndex);
    }
  };

  const [getConversationMessages] = useLazyGetConversationMessagesQuery();
  // const [postSendMessages] = usePostSendMessageMutation();

  const removeHiddenMessages = (data: any) => {
    return data?.filter((item: any) => item.text && !item.text.includes('Prompt]'));
  };

  // Main function to get messages
  const getMessages = async () => {
    // Get the response from the handleGetMessage function
    const tempData = localStorage.getItem(propilotConversationId);
    if (tempData) {
      setMessages(JSON.parse(detectAndFixStructure(tempData)));
    }

    const { data } = await getConversationMessages({
      user_id: getUserId()?.recordId,
      mentor_ai_id: aiMentorRecordId,
    });

    // Initialize an empty array for the messages
    const _messagesArray: any = [];
    const messages_array = removeHiddenMessages(data)?.map((item: any) => item);
    const reversedArray = messages_array?.reverse();
    const totalNumberOfMessages = reversedArray?.length - 1;
    // Check if the response has data
    if (data?.length) {
      // Reverse the data array and loop through it
      reversedArray.forEach((msgDetails: any, currentMessageIndex: number) => {
        // Check if the message details have content
        if (msgDetails) {
          // If so, handle the content and add the resulting messages to the _messages object
          handleContent(msgDetails, _messagesArray, totalNumberOfMessages, currentMessageIndex);
        }
      });
    }

    if (_messagesArray.length === 0) {
      if (useFor === 'page') {
        _messagesArray.push({
          id: 'msg_inital',
          object: 'thread.message',
          created_at: new Date().toTimeString(),
          thread_id: 'thread_initial',
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: {
                value: 'Hello! How can I assist you today on your journey?',
                annotations: [],
              },
            },
          ],
          file_ids: [],
          assistant_id: 'assistant_initial',
          run_id: 'run_initial',
          metadata: {},
          message: {
            type: 'text',
            value: 'Hello! How can I assist you today on your journey?',
          },
        });
        setActionInputData({
          easy_action: 'selector',
          data: ['Help me learn or practice a concept', 'Help me find the right mentor'],
        });
      } else {
        setActionInputData({
          easy_action: 'selector',
          data: ['I have Preplaced related query', 'Help me with booking a trial session', 'Help me find the right mentor'],
        });
      }
    }

    return updateMessages(_messagesArray);
  };

  /* -------------------------------------------------------------------------- */
  /*                              createThread ID                              */
  /* -------------------------------------------------------------------------- */

  const readStream = async (stream: any) => {
    setIsLoading(false);
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        await getMessages();
        return updateCurrentLetter('');
      }
      // Convert Uint8Array to string and set the current letter
      const letter = new TextDecoder().decode(value).trim();
      updateCurrentLetter(letter);
    }
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setActionInputData(null);
    const newMsg: Message = {
      id: '',
      assistant_id: null,
      content: [
        {
          text: {
            annotations: [],
            value: message,
          },
          type: 'text',
        },
      ],
      created_at: Date.now(),
      file_ids: [],
      metadata: {},
      object: 'thread.message',
      role: 'user',
      run_id: null,
      thread_id: '',
      isLatestUserMessage: false,
      message: { value: message, type: 'text' },
    };
    const assistantLoadingMessage: any = {
      created_at: Date.now(),
      role: 'loading',
      run_id: null,
      thread_id: '',
      isLoading: true,
      message: { value: 'Typing...', type: 'text' },
    };

    const newMessages = [...messages, newMsg, assistantLoadingMessage];
    await updateMessages(newMessages);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL_AI_BACKEND}mentor_ai_chat/send_message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_id: getUserId()?.recordId,
        mentor_ai_id: aiMentorRecordId,
      }),
    })
      .then(response => {
        // const filteredMessages = newMessages.filter((message: any) => message.role !== 'loading');
        const filteredMessages = newMessages.slice(0, newMessages.length - 1);
        updateMessages([...filteredMessages]);
        if (response.body) {
          readStream(response.body);
        }
      })
      .catch(err => console.error('fetch failed', err));
  };

  const aiProPilotContextData = useMemo(() => {
    return {
      centeralSection: {
        messages,
        setMessages: updateMessages,
        getMessages,
        sendMessage,
        currentLetter,
      },
      rightSection: {},
      shared: {
        isLoading,
        updateLoading,
        actionInputData,
        setActionInputData: updateActionInputData,
        showRightSection,
        updateShowRightSection,
        runId,
        setRunId: updateRunId,
        showSkipResponse,
        setShowSkipResponse: updateShowSkipResponse,
      },
      initialLoading,
    };
  }, [
    isLoading,
    updateLoading,
    actionInputData,
    updateActionInputData,
    showRightSection,
    updateShowRightSection,
    messages,
    updateMessages,
    getMessages,
    sendMessage,
    runId,
    updateRunId,
    showSkipResponse,
    updateShowSkipResponse,
    currentLetter,
    initialLoading,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                           Check User Login Status                          */
  /* -------------------------------------------------------------------------- */

  const loggedInUser = async () => {
    await getMessages();
    return setInitialLoading(false);
  };

  const nonLoggedInUser = async () => {
    if (!preplacedAnonymousId && segmentAnonymousId) {
      setLocalStorageItem(PREPLACED_ANONYMOUS_ID_CONST, segmentAnonymousId);
    }
    await getMessages();
    return setInitialLoading(false);
  };

  useEffect(() => {
    if (firebaseLoading === false) {
      if (isProfileCompleted === true && currentUser && currentUser.phoneNumber) {
        loggedInUser();
        removeFromLocalStorage(PREPLACED_ANONYMOUS_ID_CONST);
      }

      if (isProfileCompleted === false && (!currentUser || !currentUser?.phoneNumber)) {
        nonLoggedInUser();
      }
    }
  }, [firebaseLoading, isProfileCompleted, currentUser, aiMentorRecordId]);

  return { aiProPilotContextData };
};

export default useAiProPilotContext;
