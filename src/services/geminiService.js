/**
 * Gemini AI Service - CelebrAIte
 * Connects directly to Google Generative AI (Gemini 3.8 Flash)
 * with robust schema enforcement, prompt defense, and graceful fallback.
 */

import { cleanForPrompt, evaluatePromptSafety, aiRateLimiter } from './securityGuard.js';
import * as fallbackEngine from './fallbackEngine.js';

// Default model configuration
const DEFAULT_MODEL = 'gemini-3.8-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Retrieves the active Gemini API key from localStorage or Vite environment variable
 */
export function getActiveApiKey() {
  const localKey = localStorage.getItem('celebraite_gemini_api_key');
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Sets the active Gemini API key in localStorage
 */
export function setActiveApiKey(key) {
  if (key) {
    localStorage.setItem('celebraite_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('celebraite_gemini_api_key');
  }
}

/**
 * Checks if a live API key is configured
 */
export function hasLiveApiKey() {
  const key = getActiveApiKey();
  return Boolean(key && key.length >= 20);
}

/**
 * Base caller to Gemini generateContent endpoint
 */
async function callGeminiApi(prompt, systemInstruction = '', temperature = 0.7) {
  // Check security safety
  const safety = evaluatePromptSafety(prompt);
  if (!safety.isSafe) {
    throw new Error(`Security Guard: ${safety.flagReason}`);
  }

  // Check rate limiter
  if (!aiRateLimiter.canMakeCall()) {
    const waitSeconds = Math.ceil(aiRateLimiter.getRemainingTimeMs() / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${waitSeconds}s before next AI generation.`);
  }

  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const model = import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL;
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  const sanitizedPrompt = cleanForPrompt(prompt);

  const requestBody = {
    contents: [
      {
        parts: [{ text: sanitizedPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: 2500,
      topP: 0.95,
    },
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return rawText;
}

/**
 * Extracts and parses JSON from markdown code blocks or text
 */
function extractJsonFromResponse(text) {
  if (!text) return null;
  // Match ```json ... ``` or ``` ... ```
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const target = jsonMatch ? jsonMatch[1] : text;
  try {
    return JSON.parse(target);
  } catch (err) {
    // Attempt relaxed parsing or substring search
    const firstBrace = target.indexOf('{');
    const lastBrace = target.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        return JSON.parse(target.substring(firstBrace, lastBrace + 1));
      } catch (nestedErr) {
        // Fall through
      }
    }
    const firstBracket = target.indexOf('[');
    const lastBracket = target.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      try {
        return JSON.parse(target.substring(firstBracket, lastBracket + 1));
      } catch (nestedErr) {
        // Fall through
      }
    }
    return null;
  }
}

/**
 * Autonomous Event Plan Generator
 * Produces structured budget items, milestones, run-sheets, and creative suites.
 */
export async function generateFullEventPlan(eventParams) {
  const { title, eventType, guestCount, budget, location, vibes, notes } = eventParams;

  const fallback = {
    budgetItems: fallbackEngine.calculateBudgetBreakdown(budget, eventType, guestCount),
    macroTimeline: fallbackEngine.generateMacroTimeline(eventType),
    dayOfRunSheet: fallbackEngine.generateDayOfRunSheet(eventType),
    vendorChecklist: fallbackEngine.generateVendorChecklist(eventType),
    creativeSuite: fallbackEngine.generateCreativeSuite(eventType, vibes),
  };

  if (!hasLiveApiKey()) {
    return { ...fallback, source: 'Deterministic Intelligent Fallback' };
  }

  const systemInstruction = `You are CelebrAIte, an elite autonomous master celebration planner specializing in weddings, birthdays, and community festivals.
Return ONLY valid JSON matching this exact structure:
{
  "themeTitle": string,
  "tagline": string,
  "decorNotes": string,
  "colorPalette": [ { "name": string, "hex": string, "role": string } ],
  "budgetBreakdown": [ { "category": string, "percentage": number, "allocatedAmount": number, "priority": string, "description": string } ],
  "macroTimeline": [ { "phase": string, "title": string, "tasks": [string] } ],
  "dayOfSchedule": [ { "time": string, "title": string, "owner": string, "note": string } ],
  "signatureMenu": [ { "course": string, "dish": string, "dietary": string } ],
  "keyActivities": [ { "title": string, "description": string } ],
  "personalizedSpeech": { "title": string, "content": string }
}`;

  const prompt = `Plan a premier ${eventType.toUpperCase()} event:
Title: "${title || 'Unforgettable Celebration'}"
Total Budget: $${budget} USD
Guest Count: ${guestCount} attendees
Location / Venue Type: "${location || 'Prime Venue'}"
Desired Aesthetic / Vibe: "${vibes || 'Elegant & Memorable'}"
Special Notes: "${notes || 'Make it personalized and seamless'}"

Calculate optimal budget allocation ensuring the sum of percentages is 100%. Create chronological milestones and day-of minute-by-minute timeline with buffers. Generate bespoke theme, menu, interactive games, and speech.`;

  try {
    const rawAiText = await callGeminiApi(prompt, systemInstruction, 0.4);
    const parsed = extractJsonFromResponse(rawAiText);

    if (!parsed || !parsed.budgetBreakdown) {
      console.warn('AI JSON parsing fallback triggered');
      return { ...fallback, source: 'Deterministic Intelligent Fallback' };
    }

    return {
      budgetItems: parsed.budgetBreakdown.map((item, idx) => ({
        id: `cat-ai-${idx + 1}`,
        category: item.category,
        percentage: Number(item.percentage) || 10,
        allocatedAmount: Number(item.allocatedAmount) || Math.round((budget * (item.percentage || 10)) / 100),
        actualSpent: 0,
        priority: item.priority || 'Medium',
        description: item.description || '',
        perGuest: Number(((item.allocatedAmount || 100) / guestCount).toFixed(2)),
        status: 'On Track',
      })),
      macroTimeline: parsed.macroTimeline.map((m, idx) => ({
        id: `m-ai-${idx + 1}`,
        phase: m.phase,
        title: m.title,
        completed: idx === 0,
        tasks: m.tasks || [],
      })),
      dayOfRunSheet: parsed.dayOfSchedule || fallback.dayOfRunSheet,
      vendorChecklist: fallback.vendorChecklist,
      creativeSuite: {
        theme: {
          title: parsed.themeTitle || title,
          tagline: parsed.tagline || vibes,
          palette: parsed.colorPalette || fallback.creativeSuite.theme.palette,
          decorNotes: parsed.decorNotes || fallback.creativeSuite.theme.decorNotes,
        },
        menu: parsed.signatureMenu || fallback.creativeSuite.menu,
        activities: parsed.keyActivities || fallback.creativeSuite.activities,
        speechTemplate: parsed.personalizedSpeech || fallback.creativeSuite.speechTemplate,
      },
      source: 'Google Gemini 3.8 Flash',
    };
  } catch (err) {
    console.warn('Gemini Live API call error, using fallback:', err.message);
    return { ...fallback, source: 'Deterministic Intelligent Fallback' };
  }
}

/**
 * Generates an inquiry / RFP email for a vendor
 */
export async function generateVendorRfp({ vendorCategory, vendorName, eventState }) {
  const fallback = `Subject: Inquiry: Availability & Quote for ${eventState.title || 'Celebration'} (${eventState.date || 'Upcoming'})\n\nDear ${vendorName || vendorCategory + ' Team'},\n\nWe are currently planning our ${eventState.eventType || 'celebration'} on ${eventState.date || 'our selected date'} with approximately ${eventState.guestCount || 100} guests. We admire your work in ${vendorCategory} and would love to review your availability, service packages, and terms.\n\nOur current budget target for this service is approximately $${Math.round((eventState.budget || 10000) * 0.15)}.\n\nCould you please share your catalog and any upcoming consultation slots?\n\nWarm regards,\nEvent Planning Team`;

  if (!hasLiveApiKey()) return fallback;

  const prompt = `Write a polished, professional Vendor Request for Proposal (RFP) / Outreach email for:
Vendor Category: ${vendorCategory}
Vendor Name: ${vendorName}
Event Title: ${eventState.title}
Event Type: ${eventState.eventType}
Event Date: ${eventState.date}
Guest Count: ${eventState.guestCount}
Budget Target: $${eventState.budget}
Vibe: ${eventState.vibes}

Include a clear subject line, appreciation for their craft, essential specs, polite request for pricing/availability, and a prompt call to action. Keep it concise and professional.`;

  try {
    return await callGeminiApi(prompt, 'You are a luxury event producer crafting vendor inquiries.', 0.5);
  } catch {
    return fallback;
  }
}

/**
 * 24/7 Context-Aware Copilot Planner Chat
 */
export async function askPlannerCopilot({ message, history = [], eventState, persona = 'eleanor' }) {
  const PERSONA_PROMPTS = {
    eleanor: 'You are Eleanor, a world-class luxury concierge and celebrity wedding planner. Your style is warm, opulent, hyper-organized, and unflappable.',
    kai: 'You are Kai, a high-energy, modern event producer who excels at tech integrations, dynamic lighting, trending music, and viral guest experiences.',
    maya: 'You are Maya, the savvy budget wizard and DIY genius. You find clever cost-saving hacks, supplier negotiations, and high-impact aesthetics on a smart budget.',
    marcus: 'You are Marcus, a seasoned community director and festival coordinator specializing in crowd management, permits, stage logistics, and sponsor relations.',
  };

  const personaInstruction = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.eleanor;

  const eventContext = `Current Event Context:
- Title: ${eventState?.title || 'Celebration'}
- Type: ${eventState?.eventType || 'Wedding'}
- Budget: $${eventState?.budget || 15000} (Spent so far: $${eventState?.spent || 0})
- Guest Count: ${eventState?.guestCount || 100}
- Date: ${eventState?.date || 'Upcoming'}
- Theme: ${eventState?.themeTitle || 'Classic Elegance'}`;

  const systemInstruction = `${personaInstruction}
${eventContext}
Always give actionable, inspiring, and concise advice. If the user asks for budget savings, timeline adjustments, vendor advice, or theme ideas, provide concrete recommendations formatted with bullet points.`;

  if (!hasLiveApiKey()) {
    // Intelligent contextual offline response
    const msg = message.toLowerCase();
    if (msg.includes('budget') || msg.includes('save') || msg.includes('cost')) {
      return `Here are 3 high-impact cost-saving strategies for your ${eventState?.eventType || 'event'}:
• **Catering Optimization**: Transition from a formal 3-course plated dinner to artisan food stations or family-style dining—this typically saves 15-22% on staffing fees.
• **Seasonal Floral Focus**: Repurpose ceremony arrangements (arbors & aisle runners) to the reception stage and dessert tables.
• **BYO Bar Agreement**: Negotiate with your venue for a corkage fee structure rather than an open bar markup.

Would you like me to adjust any specific category in your budget breakdown?`;
    }
    if (msg.includes('timeline') || msg.includes('schedule') || msg.includes('run-sheet')) {
      return `For your ${eventState?.eventType || 'celebration'} with ${eventState?.guestCount || 100} guests, the most critical buffer is between guest arrival and key formalities. 
Always build in a **20-minute buffer window** right after the cocktail hour to ensure smooth seating. Would you like me to regenerate your day-of run-sheet with extra buffer zones?`;
    }
    return `I am fully aligned with your vision for "${eventState?.title || 'your celebration'}"! With ${eventState?.guestCount || 100} guests and a $${eventState?.budget || 10000} target, we have tremendous creative freedom. How would you like to elevate the experience next? We can refine vendor outreach, polish the evening run-sheet, or customize your signature cocktails!`;
  }

  try {
    return await callGeminiApi(message, systemInstruction, 0.7);
  } catch (err) {
    return `I encountered a momentary connection hiccup (${err.message}), but here is what I recommend for "${eventState?.title || 'your event'}": prioritize locking in your venue and catering first, as they represent ~65% of your total budget and dictate the guest flow!`;
  }
}
