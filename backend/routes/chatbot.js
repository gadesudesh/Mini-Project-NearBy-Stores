const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are a helpful AI assistant for the "Near By Store" app. This app helps users find nearby stores, browse products, read reviews, and get directions. You can help users with:
- Finding stores by location or category
- Searching for products
- Getting information about the app features
- Answering general questions about shopping or local businesses
- Providing directions or navigation help
Be friendly, concise, and helpful. If asked about specific data, suggest using the app's search features.

User: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text().trim();

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    let errorMessage = 'Sorry, I\'m having trouble responding right now. Please try again later.';
    
    if (error.message && error.message.includes('API key not valid')) {
      errorMessage = 'The Google API key is invalid. Please get a new API key from https://aistudio.google.com/app/apikey (not from Google Cloud Console). Make sure to create it in Google AI Studio.';
    } else if (error.message && error.message.includes('is not found for API version')) {
      errorMessage = 'The API key you have is not enabled for Google Gemini API. Please get a key from https://aistudio.google.com/app/apikey.';
    } else if (error.message && error.message.includes('quota')) {
      errorMessage = 'Sorry, the AI service is currently unavailable due to quota limits. Please check back later.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;