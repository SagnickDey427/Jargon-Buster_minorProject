require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/simplify', async (req, res) => {
    console.log("👋🏻 Received the request from chrome extension!");
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided." });

    try {
        const prompt = `You are a Jargon Buster. Rewrite the following dense text into plain English at a 5th-grade reading level. Keep it concise.\n\nText: "${text}"`;

        // 1. Tell Express we are sending a stream, not a standard JSON object
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma2:2b',
                prompt: prompt,
                stream: true // 2. Turn streaming ON
            })
        });

        if (!response.ok) throw new Error("Ollama rejected the request.");

        // 3. Read the stream from Ollama and forward the words to the frontend
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Keep the last incomplete line in the buffer
            buffer = lines.pop(); 

            for (const line of lines) {
                if (line.trim() === '') continue;
                const data = JSON.parse(line);
                if (data.response) {
                    res.write(data.response); // Write the word to the open connection
                }
            }
        }
        res.end(); // Close the connection when the AI is done
    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).write("Failed to simplify text.");
        res.end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Jargon Buster Backend running on http://localhost:${PORT}`);
    console.log(`Streaming AI requests to local Gemma 2 via Ollama`);
});