import React, { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import { ChatMessage as ChatMessageInstance } from "./models";
import { listChatMessages } from "./graphql/queries";
import { createChatMessage } from "./graphql/mutations";
import { onCreateChatMessage } from "./graphql/subscriptions";
import { ListChatMessagesQuery, OnCreateChatMessageSubscription, ChatMessage } from "./API";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { GraphQLResult } from "@aws-amplify/api";

Amplify.configure(awsconfig);

type SubscriptionEvent = {
  value: {
    data: OnCreateChatMessageSubscription;
  };
};

const styles = {
  main: {
    margin: 16,
    height: 504,
    overflow: "auto",
  },
  footer: {
    margin: 16,
    marginLeft: 24,
    height: 64,
  },
  message: {
    margin: 8,
    padding: 8,
    display: "flex",
    width: 300,
  },
  messageInput: {
    width: 300,
    marginRight: 8,
  },
};

function App() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  async function fetchData() {
    const chatMessageData = (await API.graphql(graphqlOperation(listChatMessages))) as GraphQLResult<ListChatMessagesQuery>;

    if (chatMessageData.data?.listChatMessages?.items) {
      const messages = chatMessageData.data.listChatMessages.items as ChatMessage[];
      setChatMessages(sortMessage(messages));
    }
  }

  function sortMessage(messages: ChatMessage[]) {
    return [...messages].sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async function saveData() {
    const model = new ChatMessageInstance({
      message: inputMessage,
    });
    await API.graphql(
      graphqlOperation(createChatMessage, {
        input: model,
      })
    );
    setInputMessage("");
  }

  function onChange(messge: string) {
    setInputMessage(messge);
  }

  useEffect(() => {
    fetchData();
    const onCreate = API.graphql(graphqlOperation(onCreateChatMessage));

    if ("subscribe" in onCreate) {
      const subscription = onCreate.subscribe({
        next: ({ value: { data } }: SubscriptionEvent) => {
          const newMessage: ChatMessage = data.onCreateChatMessage!;
          setChatMessages((prevMessages) => sortMessage([...prevMessages, newMessage]));
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h2>Hello {user?.username}</h2>
          <button onClick={signOut}>Sign out</button>
          <Box style={styles.main}>
            {chatMessages &&
              chatMessages.map((message, index) => {
                return <Chip key={index} label={message.message} color="primary" style={styles.message} />;
              })}
          </Box>
          <Box style={styles.footer}>
            <TextField variant="outlined" type="text" color="primary" size="small" value={inputMessage} style={styles.messageInput} onChange={(e) => onChange(e.target.value)} placeholder="メッセージを入力" />
            <Button variant="contained" color="primary" onClick={() => saveData()}>
              投稿
            </Button>
          </Box>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
