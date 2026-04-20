require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/simplify', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "No text provided." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are a Jargon Buster. Rewrite the following dense text into plain English at a 5th-grade reading level. Keep it concise.\n\nText: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const simplifiedText = response.text();

        res.json({ simplifiedText });
    } catch (error) {
        console.error("Error calling AI:", error);
        res.status(500).json({ error: "Failed to simplify text." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Jargon Buster Backend running on http://localhost:${PORT}`);
});