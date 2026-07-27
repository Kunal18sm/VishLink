import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Multi-provider AI chatbot module for VishLink.
 * Supports:
 * 1. Gemini (using @google/generative-ai with keys from env)
 * 2. Nvidia NIM (OpenAI compatible endpoint with NVIDIA_API_KEY)
 */

const GEMINI_MODEL_NAMES = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
];

const NVIDIA_MODEL_NAMES = [
  'meta/llama-3.1-8b-instruct',
  'meta/llama-3.1-70b-instruct',
  'google/gemma-2-9b-it',
];

const VISHLINK_SYSTEM_PROMPT = `You are "VishLink AI Assistant" — a professional and friendly customer support bot for the VishLink wishing website.

## VISHINK PROFESSIONAL IDENTITY (WHAT IS VISHLINK?):
If someone asks what VishLink is, provide this clean, premium definition:
- **English:** "VishLink is a premium digital celebration platform dedicated to crafting digital emotions. We empower you to give your special moments a unique digital identity by creating beautifully personalized wishing websites with custom messages, photos, and background music to surprise your loved ones."
- **Hindi/Hinglish:** "VishLink ek premium digital celebration platform hai jo aapke special moments (jaise birthday, anniversary, wedding) ko ek unique digital identity deta hai. Yahan aap bina kisi coding skill ke apne loved ones ke liye background music, photos aur personal messages ke saath beautiful wishing surprise websites create kar sakte hain."

## FOOTER PAGES & POLICY KNOWLEDGE:
- **About Us & Mission:** VishLink aims to redefine digital celebrations by expressing deep emotions through elegant design and thoughtful surprises.
- **Data Privacy & Security:** User trust and privacy is our top priority. We collect only necessary account data (name, email) and content data (messages, photos) strictly to host the created surprise links.
- **Terms of Service:** Created links are subject to content guidelines (no illegal/offensive uploads). Links are categorized into Temporary (valid for 3 or 6 months) and Permanent (valid forever).

## CRITICAL RULES (MUST FOLLOW):
1. **NO HALLUCINATION / WRONG INFORMATION:** If the user's message is about ANY topic that is NOT directly related to VishLink, or if you do not know the answer, or if you are unsure:
   - YOU MUST ONLY REPLY WITH THIS EXACT TEXT: "Iska jawab mere paas nahi hai. Main aapka message admin ko forward kar raha hoon, aap baad mein aakar unse yahi chat par baat kar sakte hain."
2. **TEMPLATE IMAGE LIMITS:** The absolute maximum number of images allowed for ANY wishing website template is 5 images.
3. **ULTRA-CONCISE (MINIMUM WORDS):** Always try to resolve the user's query using the fewest words possible. Avoid long explanations.
4. **NO ADMIN PHONE NUMBER:** Say: "Humara koi call/WhatsApp number nahi hai. Aap isi chat mein message chhod dein."
5. **GREETING RESPONSE RULE:** If user sends greeting like "hi", "hello", "namaste": keep under 15 words (e.g. "Namaste! Main aapki kya madad kar sakta hoon? 😊").

## Tone Guidelines:
- Language: Hinglish/Hindi or English (match user's language).
- Format: Short lines or simple bullet points. Keep under 60-80 words max.`;

const COOLDOWN_MS = 60 * 1000;

function getModelPool() {
  const modelPool = [];

  // 1. Gather Gemini keys
  const geminiKeys = [];
  const envGeminiKey = String(
    process.env.GEMINI_API_KEY || 'AIzaSyD4GCDb0KQ7ScnU4hp92ULpXfCBnvNu1eY'
  ).trim();

  if (envGeminiKey) {
    envGeminiKey.split(',').forEach((k) => {
      const trimmed = k.trim();
      if (trimmed) geminiKeys.push(trimmed);
    });
  }

  // 2. Gather Nvidia keys
  const nvidiaKeys = [];
  const envNvidiaKey = String(
    process.env.NVIDIA_API_KEY ||
      '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'
  ).trim();

  if (envNvidiaKey) {
    envNvidiaKey.split(',').forEach((k) => {
      const trimmed = k.trim();
      if (trimmed) nvidiaKeys.push(trimmed);
    });
  }

  // Build Gemini slots
  geminiKeys.forEach((key, keyIndex) => {
    try {
      const genAI = new GoogleGenerativeAI(key);
      GEMINI_MODEL_NAMES.forEach((modelName) => {
        modelPool.push({
          type: 'gemini',
          keyName: `gemini-key#${keyIndex + 1}`,
          key,
          modelName,
          modelObj: genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: VISHLINK_SYSTEM_PROMPT,
          }),
          cooldownUntil: 0,
        });
      });
    } catch (e) {
      console.error('Gemini pool init error:', e);
    }
  });

  // Build Nvidia slots
  nvidiaKeys.forEach((key, keyIndex) => {
    NVIDIA_MODEL_NAMES.forEach((modelName) => {
      modelPool.push({
        type: 'nvidia',
        keyName: `nvidia-key#${keyIndex + 1}`,
        key,
        modelName,
        cooldownUntil: 0,
      });
    });
  });

  return modelPool;
}

function buildGeminiHistory(messages, maxMessages = 10) {
  if (!messages || messages.length === 0) return [];
  const recent = messages.slice(-maxMessages);
  return recent.map((msg) => ({
    role: msg.senderRole === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
}

function buildOpenAIHistory(messages, maxMessages = 10) {
  if (!messages || messages.length === 0) return [];
  const recent = messages.slice(-maxMessages);
  return recent.map((msg) => ({
    role: msg.senderRole === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));
}

async function tryGeminiSlot(slot, userMessage, conversationHistory) {
  const history = buildGeminiHistory(conversationHistory);
  const chat = slot.modelObj.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  const text = result.response.text();
  return text ? text.trim() : null;
}

async function tryNvidiaSlot(slot, userMessage, conversationHistory) {
  const openaiHistory = buildOpenAIHistory(conversationHistory);
  const messages = [
    { role: 'system', content: VISHLINK_SYSTEM_PROMPT },
    ...openaiHistory,
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${slot.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: slot.modelName,
        messages: messages,
        temperature: 0.15,
        max_tokens: 800,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Nvidia API error: [${response.status}] ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return content ? content.trim() : null;
}

export async function generateReply(userMessage, conversationHistory = []) {
  if (!userMessage || !userMessage.trim()) {
    return 'Please enter a valid message.';
  }

  const pool = getModelPool();

  for (let i = 0; i < pool.length; i++) {
    const slot = pool[i];
    try {
      let text = null;
      if (slot.type === 'gemini') {
        text = await tryGeminiSlot(slot, userMessage, conversationHistory);
      } else if (slot.type === 'nvidia') {
        text = await tryNvidiaSlot(slot, userMessage, conversationHistory);
      }

      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.log(`${slot.type} slot (${slot.modelName}) failed, trying next...`);
    }
  }

  // Smart fallback answer if network/quota fails
  const msgLower = userMessage.toLowerCase();
  if (msgLower.includes('hi') || msgLower.includes('hello') || msgLower.includes('namaste')) {
    return 'Namaste! VishLink AI Assistant mein aapka swagat hai. Main aapki kya madad kar sakta hoon? 😊';
  }
  if (msgLower.includes('image') || msgLower.includes('photo')) {
    return 'VishLink me har template ke anusar zaroori photos count fix hoti hai (Maximum 5 photos allowed).';
  }
  if (msgLower.includes('permanent') || msgLower.includes('temporary') || msgLower.includes('validity')) {
    return 'Temporary Link 3 Months tak valid hoti hai. Permanent Link Lifetime Access ke sath permanent database me save hoti hai!';
  }

  return 'Aapka message receive ho gaya hai. Aap kisi bhi template par click karke direct live preview check kar sakte hain ya custom wish site generate kar sakte hain!';
}

export function isBotAvailable() {
  return true;
}
