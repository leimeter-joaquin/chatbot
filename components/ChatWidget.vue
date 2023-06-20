<script setup lang="ts">
// Importing necessary dependencies and types
import { Message, User } from "~~/types";

// Creating reactive variables for the user and bot objects
const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
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
    content: `Answer this like you are a nutritionist: ${m.text}. Don't say you are a model, act as if you are a human. If the question is not related to nutrition, just say "I don't know".`,
  }))
);

// Creating a reactive variable for the usersTyping array
const usersTyping = ref<User[]>([]);

// Function to handle a new message
async function handleNewMessage(message: Message) {
  // Pushing the new message to the messages array
  messages.value.push(message);

  // Pushing the bot user to the usersTyping array
  usersTyping.value.push(bot.value);

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
}
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
