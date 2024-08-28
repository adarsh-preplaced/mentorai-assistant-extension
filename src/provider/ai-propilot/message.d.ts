export type ActionInputDataType = {
  fieldType: string;
};

export interface MessageContent {
  text: {
    annotations: string[];
    value: string;
  };
  type: string;
}

export interface ProcessedContent {
  type: string;
  value: string;
}
export interface Message {
  id: string;
  assistant_id: string | null;
  content: MessageContent[];
  created_at: Number;
  file_ids: string[];
  metadata: any;
  object: string;
  role: string;
  run_id: string | null;
  thread_id: string;
  message: ProcessedContent;
  isLatestUserMessage?: boolean;
  isLoading?: boolean;
}
