import { Configuration, OpenAIApi } from "openai";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { OPENAI_API_KEY } = useRuntimeConfig();

  const configuration = new Configuration({
    organization: "org-BKLjnhDjR1cIM7n9xhmodEWs",
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente útil para un gimnasio, tu función es ayudar a los miembros negros del gimnasio. Puede crear planes de comidas, planes de entrenamiento y responder preguntas sobre el gimnasio.",
      },
      ...body.messages,
    ],
    temperature: body.temperature || 1,
  });
  return completion.data;
});
