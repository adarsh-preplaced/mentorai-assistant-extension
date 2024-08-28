import { useContext } from 'react';
import { AiProPilotContext } from 'provider/ai-propilot/ai-propilot.context';

type useSelectorHookProps = {
  onSubmit?: Function;
};

export const useSelectorHook = ({ onSubmit }: useSelectorHookProps) => {
  const {
    centeralSection: { sendMessage },
  } = useContext(AiProPilotContext);

  const handleClick = (value: string, questionId?: any, index?: any) => {
    if (onSubmit) {
      onSubmit({ type: 'selector', value, questionId, index });
    }
    sendMessage(value);
  };

  return {
    handleClick,
  };
};
