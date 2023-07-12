import { Configuration, OpenAIApi } from "openai";

// This is just an endpoint that calls the OpenAI API on post. (see file name).
export default defineEventHandler(async (event) => {
  // Getting body from the request.
  const body = await readBody(event);

  // This is just getting the env variable.
  const { OPENAI_API_KEY } = useRuntimeConfig();

  const configuration = new Configuration({
    organization: "org-BKLjnhDjR1cIM7n9xhmodEWs",
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  // This is a completion, see openAI docs for details. Essentially we are just sending a message array to the AI getting a response and returning it. Notice that we always send the whole message history to the AI: "the conversation" witht he AI.
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente útil para un gimnasio, tu función es ayudar a los miembros con membresía 'black' del gimnasio. Puede crear planes de comidas, planes de entrenamiento y responder preguntas sobre el gimnasio. SI te preguntan algo no relacionado con el gimnasio, puedes responder 'No entiendo la pregunta'",
      },
      ...body.messages,
    ],
    temperature: body.temperature || 1,
  });
  return completion.data;
});

export interface Message {
  id: string;
  userId: string;
  createdAt: Date;
  text: string;
}
const messages = [
  {
    id: "user",
    userId: "123",
    createdAt: new Date(),
    text: "Hola, quiero un plan",
  },
  {
    id: "assistant",
    userId: "1233",
    createdAt: new Date(),
    text: "Hola, como va?",
  },
];

const messagesForAPI = [
  // {
  //   role: "system",
  //   content:
  //     "Eres un asistente útil para un gimnasio, tu función es ayudar a los miembros con membresía 'black' del gimnasio. Puede crear planes de comidas, planes de entrenamiento y responder preguntas sobre el gimnasio.",
  // },
  {
    role: "user",
    content: "Hola, quiero un plan",
  },
  {
    role: "assistant",
    content: "Hola, como va?",
  },
];

const usersTyping = false;
