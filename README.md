# Jargon-Buster_minorProject
# This is the minor project of our 4-th semester b.tech , MANIT Bhopal (batch - 2028) 

# 🎯 Jargon Buster

> A full-stack browser extension that translates dense corporate jargon and academic text into a plain-English, 5th-grade reading level.

## 🚀 The Concept
Ever read a corporate article or a research paper and felt completely lost in the terminology? Jargon Buster solves this. By simply highlighting complex text and right-clicking, this extension instantly communicates with a custom Node.js backend to simplify the text using Google's Gemini 2.5 Flash model, returning a clear, concise explanation directly to your screen.

## 🛠️ Tech Stack (MVP)
* **Client Interface:** Vanilla JavaScript, HTML, CSS (Manifest V3 Chrome Extension)
* **Backend API:** Node.js, Express.js, CORS
* **AI Engine:** Google Gemini 2.5 Flash (`@google/generative-ai`)

---

## 💻 Local Installation & Setup

Because this project utilizes a secure backend to protect the API keys, you will need to run the local server before using the extension.

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* A free [Gemini API Key](https://aistudio.google.com/) from Google AI Studio.
* Google Chrome browser.

### 2. Backend Setup
1. Clone this repository to your local machine.
2. Open your terminal and navigate to the backend folder:
   ```bash
   cd jargon-buster-backend
