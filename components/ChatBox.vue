<script setup lang="ts">
// Importing necessary dependencies and types
import { nanoid } from "nanoid";
import { Message, User } from "~~/types";

// Defining the component props
interface Props {
  me: User;
  users: User[];
  messages: Message[];
  usersTyping: User[];
}

// Defining the component props using defineProps helper
const props = defineProps<Props>();

// Defining the component emits using defineEmits helper
interface Emits {
  (event: "newMessage", message: Message): void;
}

const emit = defineEmits<Emits>();

// Declaring reactive variables
const isOpen = ref(false); // Represents the state of the chat window (open or closed)
const message = ref(""); // Represents the input message

// Function to submit a new message
const submit = () => {
  // Emitting a newMessage event with the composed message object
  emit("newMessage", {
    id: nanoid(),
    createdAt: new Date(),
    text: message.value,
    userId: props.me.id,
  });
  message.value = ""; // Clearing the input message
};

// Function to get a User object based on the provided ID
const getUser = (id: string): User =>
  props.users.find((user) => user.id === id) || props.me;

// Reference to the messageBox element
const messageBox = ref<HTMLDivElement | null>(null);

// Watching for changes in the number of messages
watch(
  () => props.messages.length,
  async () => {
    await nextTick(); // Wait for Vue to render
    if (messageBox.value) {
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
    }
  }
);
</script>

<template>
  <!-- Chat Button -->
  <div class="fixed bottom-8 right-8">
    <button
      class="rounded-full p-2 bg-blue-800"
      @click="isOpen = !isOpen"
      v-if="isOpen"
    >
      <IconChat class="w-8 h-8" />
    </button>

    <!-- Chat -->
    <div v-else class="box w-[60vw] bg-gray-300 dark:bg-gray-800">
      <!-- Header -->
      <div class="bg-gray-200 dark:bg-gray-900 flex justify-between px-4 py-2">
        <h2>Tu personal trainer!!</h2>
        <button @click="isOpen = !isOpen">
          <p>X</p>
        </button>
      </div>

      <!-- Messages container -->
      <div class="p-4 overflow-y-scroll max-h-[50vh]" ref="messageBox">
        <ul class="flex flex-col gap-2">
          <ChatBubble
            v-for="message in messages"
            :key="message.id"
            :me="me"
            :user="getUser(message.userId)"
            :message="message"
            :usersTyping="usersTyping"
          />
          <ChatBubble
            v-for="user in usersTyping.slice(0, 2)"
            :key="nanoid()"
            :me="me"
            :user="user"
          />
        </ul>
      </div>

      <!-- Input -->
      <div class="p-4">
        <form @submit.prevent="submit" class="">
          <input
            type="text"
            v-model="message"
            class="w-full py-2 px-4 placeholder:opacity-40"
            :placeholder="
              messages.length > 0
                ? ''
                : 'Hola! Me podrías armar un plan de comidas?'
            "
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
