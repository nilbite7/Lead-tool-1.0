import { GoogleGenAI } from "@google/genai";
// FIX: Import `LeadStatus` to be used for type casting.
import type { FilterOptions, Lead, LeadStatus } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (filters: FilterOptions, existingLeads: Lead[] = []): string => {
  let existingLeadsPromptPart = '';
  if (existingLeads.length > 0) {
    const existingLeadInfo = existingLeads.map(l => `- ${l.name} at ${l.address}`).join('\n');
    existingLeadsPromptPart = `
You have already found the following leads. Do not include them in your response again. Find new, different businesses.
Existing leads:
${existingLeadInfo}
`;
  }

  return `
    Act as an expert lead generation assistant. Your task is to find business leads for a freelance web developer based on the following criteria:
    - Location: ${filters.location}
    - Industry: ${filters.industry}
    - Website Status: ${filters.websiteStatus}
    ${existingLeadsPromptPart}
    To find these leads, you must perform a comprehensive web scan using the available tools. Prioritize information from the following sources:
    - Public business directories like Google Maps, Yelp, and Yellow Pages.
    - Professional social media platforms like LinkedIn company pages.
    - Domain and website analysis to check for the existence and quality of a company website.

    For each potential lead you identify, collect the following information:
    - Business Name
    - Website URL (if it exists, otherwise use "N/A")
    - A contact email address (search on their website, in directories, or public WHOIS data)
    - A contact phone number
    - Their full physical address
    - Their industry

    Based on your findings, provide a brief "reason" why they are a good lead. This should directly relate to their website status. For example:
    - For "No Website" status: "This business has no discoverable website, representing a major opportunity for a new web presence."
    - For "Outdated Website" status: "The website appears outdated, lacks a modern design, and is not mobile-responsive, making it a prime candidate for a redesign."

    Return a list of up to 10 leads as a JSON array string inside a single markdown code block. Each object in the array should represent one lead and MUST have these exact keys: "name", "industry", "address", "website", "email", "phone", "reason".
    
    Do not include any introductory text, explanations, or any other text outside of the markdown JSON block.
    
    Example response format:
    \`\`\`json
    [
      {
        "name": "Example Business Name",
        "industry": "Restaurants",
        "address": "123 Main St, Anytown, USA",
        "website": "http://example.com",
        "email": "contact@example.com",
        "phone": "555-123-4567",
        "reason": "The website design is from the early 2000s and is not mobile-friendly."
      }
    ]
    \`\`\`
  `;
};

const parseJsonResponse = (responseText: string): Omit<Lead, 'id' | 'status' | 'notes'>[] => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = responseText.match(jsonRegex);

  let jsonString = '';
  if (match && match[1]) {
    jsonString = match[1];
  } else {
    // If no markdown block is found, assume the whole response might be JSON
    jsonString = responseText;
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      // Basic validation to ensure objects have a 'name' property
      if (parsed.length > 0 && typeof parsed[0].name === 'undefined') {
          throw new Error("Parsed JSON objects are missing required 'name' key.");
      }
      return parsed;
    }
    throw new Error("Parsed JSON is not an array.");
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    if(match && match[1]) {
        throw new Error("The AI's response contained a JSON block that was malformed.");
    } else {
        throw new Error("The AI's response was not valid JSON and did not contain a JSON block.");
    }
  }
};


export const findLeads = async (filters: FilterOptions, existingLeads: Lead[] = []): Promise<Lead[]> => {
  const prompt = generatePrompt(filters, existingLeads);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}, {googleMaps: {}}],
        temperature: 0.2,
      },
    });

    const rawLeads = parseJsonResponse(response.text);
    const existingLeadIds = new Set(existingLeads.map(l => l.id));

    // FIX: Explicitly cast 'status' to LeadStatus to match the Lead type.
    return rawLeads.map(lead => ({
      ...lead,
      id: `${lead.name}-${lead.address}`.replace(/\s+/g, '-').toLowerCase(),
      status: 'Not Contacted' as LeadStatus,
      notes: ''
    })).filter(lead => !existingLeadIds.has(lead.id));

  } catch (error) {
    console.error("Error fetching leads from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch leads: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching leads.");
  }
};