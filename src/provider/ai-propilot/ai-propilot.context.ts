import { createContext } from 'react';

export type AiProPilotContextType = {
  centeralSection: {
    messages: any;
    setMessages: Function;
    getMessages: Function;
    sendMessage: Function;
    currentLetter: string;
  };
  rightSection: {};
  shared: {
    isLoading: boolean;
    updateLoading: Function;
    actionInputData: any;
    setActionInputData: Function;
    showRightSection: boolean;
    updateShowRightSection: Function;
    runId: string | null;
    setRunId: Function;
    showSkipResponse: boolean;
    setShowSkipResponse: Function;
  };
  initialLoading: boolean;
};

const defaultData: AiProPilotContextType = {
  centeralSection: {
    messages: null,
    setMessages: () => {},
    getMessages: () => {},
    sendMessage: () => {},
    currentLetter: '',
  },
  rightSection: {},
  shared: {
    isLoading: false,
    updateLoading: () => {},
    actionInputData: null,
    setActionInputData: () => {},
    showRightSection: false,
    updateShowRightSection: () => {},
    runId: '',
    setRunId: () => {},
    showSkipResponse: false,
    setShowSkipResponse: () => {},
  },
  initialLoading: true,
};

export const AiProPilotContext = createContext(defaultData);
