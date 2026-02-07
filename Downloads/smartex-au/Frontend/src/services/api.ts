import OpenAI from "openai";

// 1. Initialize the client
// We use 'dangerouslyAllowBrowser: true' because you are running this in a frontend React app.
// Note: In a real production app, you should move this to a backend server to protect your key.
const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: import.meta.env.VITE_GITHUB_TOKEN, 
  dangerouslyAllowBrowser: true, 
});

// 2. Export a function to call the API
export async function getAIResponse(prompt: string) {
  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      // You can swap "gpt-4o" for "Llama-3.2-90B-Vision-Instruct" or others
      model: "gpt-4o-mini", 
      temperature: 1.0,
      max_tokens: 1000,
      top_p: 1.0
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Error calling GitHub Models:", error);
    return "Sorry, something went wrong with the AI connection.";
  }

}
// Add this to src/services/api.ts
export const fetchSubjects = async () => {
  const response = await fetch('http://localhost:5000/api/subjects');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};
const BASE_URL = 'http://localhost:5000/api';

export const sendOtp = (identifier: string) => 
    fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ identifier })
    }).then(res => res.json());

export const verifyOtp = (identifier: string, code: string, name?: string) => 
    fetch(`${BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ identifier, code, name })
    }).then(res => res.json());

export const searchSubjects = (query: string) => 
    fetch(`${BASE_URL}/subjects/search?q=${query}`).then(res => res.json());