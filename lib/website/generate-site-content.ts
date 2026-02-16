// lib/website/generate-site-content.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type OnboardingData = {
  location: string;
  businessName: string;
  tradeType: string;
  services: string[];
};

export async function generateSiteContent(onboardingData: OnboardingData) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" } // Force JSON
  });

  const prompt = `
    You are an expert UK-based direct-response copywriter for tradespeople. 
    Target Audience: Homeowners in ${onboardingData.location}.
    Tone: Professional, trustworthy, and local.
    
    Business Details:
    - Name: ${onboardingData.businessName}
    - Trade: ${onboardingData.tradeType}
    - Services: ${onboardingData.services.join(", ")}
    
    Return a JSON object exactly in this format:
    {
      "hero": { "title": "string", "subtitle": "string" },
      "about": { "heading": "string", "content": "string" },
      "services": [
        { "title": "string", "description": "string" },
        { "title": "string", "description": "string" },
        { "title": "string", "description": "string" }
      ],
      "cta": { "text": "string" }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Generation Failed:", error);
    // Return fallback content so the app doesn't crash
    return {
      hero: { title: onboardingData.businessName, subtitle: `Expert ${onboardingData.tradeType} in ${onboardingData.location}` },
      about: { heading: "About Us", content: "Reliable and professional trade services." },
      services: onboardingData.services.map((s: string) => ({ title: s, description: "Professional service you can trust." })),
      cta: { text: "Contact Us Today" }
    };
} }
