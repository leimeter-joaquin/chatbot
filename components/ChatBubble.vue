<script setup lang="ts">
import { Message, User } from "~~/types";
import { useTimeAgo } from "@vueuse/core";
//@ts-expect-error: markdown-it is not typed
import MarkDown from "vue3-markdown-it";
import { nanoid } from "nanoid";

interface Props {
  me: User;
  user: User;
  message?: Message; // If there is no message, the user is typing.
}

const props = defineProps<Props>();

const timeAgo = useTimeAgo(props.message?.createdAt || new Date());
</script>

<template>
  <li
    :key="message?.id ?? nanoid()"
    :class="message?.userId === me.id ? 'chat-end' : 'chat-start'"
    class="chat gap-2"
  >
    <img
      :src="user.avatar"
      :alt="user.name ?? '#'"
      class="w-8 h-8 rounded-full chat-image avatar"
    />
    <p class="chat-header">
      <strong>{{ user.name ?? "#" }}</strong>
      &nbsp;
      <time class="text-xs opacity-50">{{ timeAgo }}</time>
    </p>

    <p class="chat-bubble prose prose-sm py-0">
      <MarkDown v-if="message" :source="message?.text" />
      <AppLoading v-else />
    </p>
  </li>
</template>
