
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerationOutput, SimplePortfolioData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for local development where process.env might not be set
  // In a real production environment, this should be handled securely.
  console.warn("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY as string });

const parsePosts = (postsText: string): { date: string, text: string }[] => {
  return postsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const match = line.match(/^(\d{4}-\d{2}-\d{2}):\s*(.*)/);
      if (match) {
        return { date: match[1], text: match[2] };
      }
      return { date: "unknown", text: line };
    })
    .filter(post => post.text.length > 0);
};

// --- DEEPFOLIO TIMELINE SCHEMA AND GENERATION ---

const timelineSchema = {
  type: Type.OBJECT,
  properties: {
    timeline: {
      type: Type.ARRAY,
      description: "A chronological list of professional and learning events, ordered newest to oldest.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "The date of the event in YYYY-MM-DD format. Best effort estimation is acceptable." },
          title: { type: Type.STRING, description: "A concise title for the event (5-8 words)." },
          type: { 
            type: Type.STRING,
            description: "Categorize the event.",
            enum: ['Work', 'Project', 'Learning', 'Achievement', 'Community', 'Other']
          },
          bullets: {
            type: Type.ARRAY,
            description: "1-2 summary bullet points describing the event. Each bullet should frame an action with a measurable or qualitative outcome.",
            items: { type: Type.STRING }
          },
          tags: {
            type: Type.ARRAY,
            description: "A list of relevant tags, such as skills, technologies, or roles.",
            items: { type: Type.STRING }
          },
          confidence: {
            type: Type.STRING,
            description: "Confidence level of the extraction (high, medium, or low), especially regarding dates.",
            enum: ["high", "medium", "low"]
          },
          inference_explanation: {
            type: Type.STRING,
            description: "If an inference was made, explain the reasoning here."
          }
        },
        required: ["date", "title", "type", "bullets", "tags", "confidence"]
      }
    },
    needs_user_verification: {
        type: Type.ARRAY,
        description: "A list of items that could not be confidently extracted and require user verification.",
        items: {
            type: Type.OBJECT,
            properties: {
                item: { type: Type.STRING, description: "The text or concept that was unclear." },
                reason: { type: Type.STRING, description: "Why this item needs verification." }
            },
            required: ["item", "reason"]
        }
    }
  },
  required: ["timeline"]
};

const generateDeepFolio = async (resumeText: string, posts: { date: string, text: string }[]): Promise<GenerationOutput> => {
  const systemInstruction = `You are an expert career analyst. Your task is to convert a user's resume and social media posts into a structured, chronological timeline of their professional journey. Follow these rules strictly:
1.  Extract discrete events and categorize them as 'Work', 'Project', 'Learning', 'Achievement', 'Community', or 'Other'.
2.  For each event, create a JSON object with date, title, type, a 1-2 bullet summary, relevant tags, and a confidence score.
3.  Order the final timeline from newest to oldest event.
4.  Only use facts present in the provided input. DO NOT HALLUCINATE information.
5.  If you must make a conservative inference, set 'confidence' to 'low' and briefly explain your reasoning in 'inference_explanation'.
6.  If you are highly uncertain, add the item to 'needs_user_verification' instead.
7.  The final output must be a valid JSON object matching the provided schema.`;
    
  const prompt = `Analyze the following resume text and social media posts to generate a career timeline.

  **Resume Text:** \`\`\`\n${resumeText}\n\`\`\`
  **Social Posts:** \`\`\`json\n${JSON.stringify(posts, null, 2)}\n\`\`\`
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: timelineSchema,
      temperature: 0.2
    }
  });

  return JSON.parse(response.text.trim());
};


// --- SIMPLE PORTFOLIO SCHEMA AND GENERATION ---

const simplePortfolioSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The full name of the individual, extracted from the resume." },
        title: { type: Type.STRING, description: "The most recent job title or professional headline." },
        summary: { type: Type.STRING, description: "A 2-4 sentence professional summary highlighting key skills and experience." },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    date: { type: Type.STRING, description: "e.g., 'Jun 2022 - Present' or 'Jan 2021 - Dec 2021'" },
                    bullets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Action-oriented bullet points describing achievements." }
                },
                required: ["title", "company", "date", "bullets"]
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    date: { type: Type.STRING, description: "e.g., 'Fall 2023'" },
                    description: { type: Type.STRING },
                    tech_stack: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "date", "description", "tech_stack"]
            }
        },
        skills: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "e.g., 'Programming Languages', 'Frameworks', 'Cloud'" },
                    list: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["category", "list"]
            }
        }
    },
    required: ["name", "title", "summary", "experience", "projects", "skills"]
};

const generateSimplePortfolio = async (resumeText: string, posts: { date: string, text: string }[]): Promise<SimplePortfolioData> => {
    const systemInstruction = `You are a professional resume writer. Your task is to synthesize the provided resume and social posts into a clean, structured, and simple portfolio.
1.  Extract the user's name and current title.
2.  Write a compelling professional summary.
3.  List work experience, projects, and skills in distinct, structured sections.
4.  Focus on quantifiable achievements and key responsibilities.
5.  Do not include information that is not present in the inputs.
6.  The output must be a valid JSON object conforming to the schema.`;

    const prompt = `Synthesize the following resume and posts into a simple portfolio JSON output.

    **Resume Text:** \`\`\`\n${resumeText}\n\`\`\`
    **Social Posts:** \`\`\`json\n${JSON.stringify(posts, null, 2)}\n\`\`\`
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: simplePortfolioSchema,
            temperature: 0.3
        }
    });

    return JSON.parse(response.text.trim());
};


// --- ORCHESTRATOR ---

export const generateAllOutputs = async (resumeText: string, postsText: string): Promise<{ timeline: GenerationOutput | null, simplePortfolio: SimplePortfolioData | null }> => {
    const posts = parsePosts(postsText);

    try {
        const [timelineResult, simplePortfolioResult] = await Promise.allSettled([
            generateDeepFolio(resumeText, posts),
            generateSimplePortfolio(resumeText, posts)
        ]);

        return {
            timeline: timelineResult.status === 'fulfilled' ? timelineResult.value : null,
            simplePortfolio: simplePortfolioResult.status === 'fulfilled' ? simplePortfolioResult.value : null,
        };
    } catch (error) {
        console.error("Error generating portfolio outputs:", error);
        throw new Error("Failed to generate portfolio from AI.");
    }
};