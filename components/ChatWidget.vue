<script setup lang="ts">
// Importing necessary dependencies and types
import { Message, User } from "~~/types";

// Creating reactive variables for the user and bot objects, useState
const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});

// const asd = ref(0)
// const [asd, setAsd] = useState(0)

const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

// Creating a computed property for the users array, combining the user and bot objects
const users = computed(() => [me.value, bot.value]);

// Creating a reactive variable for the messages array
const messages = ref<Message[]>([]);

// Creating a computed property for the messagesForAPI array, transforming the messages array into a format suitable for API consumption
const messagesForAPI = computed(() =>
  messages.value.map((m) => ({
    role: m.userId,
    content: m.text,
  }))
);

// Creating a reactive variable for the usersTyping array. This array will contain the bot user when the bot is typing and will be used to display the typing indicator.
const usersTyping = ref<User[]>([]);

// const [isBotTyping, setIsBotTyping] = useState(false);

// Function to handle a new message
const handleNewMessage = async (message: Message) => {
  // Pushing the new message to the messages array
  messages.value.push(message);

  // Pushing the bot user to the usersTyping array
  usersTyping.value.push(bot.value);
  //setIsBotTyping(true);

  // Sending a POST request to the AI API endpoint with the messagesForAPI array as the request body
  const res = await $fetch("/api/ai", {
    method: "POST",
    body: {
      messages: messagesForAPI.value,
    },
  });

  // Checking if a response message exists
  if (!res.choices[0].message) {
    usersTyping.value = [];
    return;
  }

  // Creating a new message object based on the response from the API
  const msg: Message = {
    id: res.id,
    userId: bot.value.id,
    createdAt: new Date(),
    text: res.choices[0].message?.content || "",
  };

  // Pushing the new message object to the messages array
  messages.value.push(msg);
  usersTyping.value = [];
  // setIsBotTyping(false);
};
</script>

<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
