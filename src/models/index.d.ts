import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerChatMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChatMessage, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyChatMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChatMessage, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ChatMessage = LazyLoading extends LazyLoadingDisabled ? EagerChatMessage : LazyChatMessage

export declare const ChatMessage: (new (init: ModelInit<ChatMessage>) => ChatMessage) & {
  copyOf(source: ChatMessage, mutator: (draft: MutableModel<ChatMessage>) => MutableModel<ChatMessage> | void): ChatMessage;
}