export interface MessageData {
  event_type?: number;
  event_person?: number;
  event_react?: number;
  session_id?: string;
  data?: string;
}

export interface SessionMessageData {
  sessions: SessionData[]

}

export interface SessionData {
  query: string;
  answer: string;
}