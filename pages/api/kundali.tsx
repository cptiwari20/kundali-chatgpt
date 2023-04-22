import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL_ENDPOINT = "https://api.openai.com/v1/chat/completions";

interface OpenAIResponse {
  choices: {
    message: string;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try{
      const { name, date, time, location } = req.body;
      const result = await generateKundali(name, date, time, location);
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while generating Kundali result." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}


const generateKundali = async (name: string, date: string, time: string, location: string): Promise<string> => {
    // Generate prompt using user input
    const prompt = `can you give Kundali result for person name: ${name} born on date: ${date} at time: ${time} in location: ${location} in Hindi`;

    try {
      // Call OpenAI API with generated prompt and API key
      const response = await fetch(MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      })

      // Extract generated Kundali result from API response
      const responseData: OpenAIResponse = await response.json();
      const { message } = responseData.choices[0];
      return message;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate Kundali result.");
    }

};