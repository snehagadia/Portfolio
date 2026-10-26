# Sneha Gadia Portfolio

Personal portfolio and college internal assessment project for **Sneha Gadia**, a B.Tech Computer Science and Engineering student at **JECRC University**, Jaipur, Rajasthan, India.

This site presents her student introduction, skills, academic and assessment projects, a live weather lookup, and an AI portfolio chatbot.

## Main features

- Responsive portfolio with Home, About, Skills, Projects, Weather, Education, Achievements, Hobbies, and Contact
- Project search and technology filters
- Light and dark mode, saved in `localStorage`
- Live weather via Open-Meteo (no API key)
- Interactive quiz (Lecture 10) and book reading list (Lecture 11)
- Python programs collection and messy-code improvement examples
- AI chatbot through a server-side `/api/chat` endpoint

## Technologies

HTML, CSS, JavaScript, Python, Node.js, Express, Open-Meteo APIs, and the OpenAI Chat Completions API for the chatbot.

## Project structure

- `index.html`, `style.css`, `script.js` — main portfolio
- `quiz/` — interactive quiz
- `books/` — reading list app
- `projects/python-programs/` — factorial, Fibonacci, structure-to-dictionary
- `projects/messy-python/` — messy and improved Python examples
- `projects/bug-fix/` — notes on real bugs fixed in this portfolio
- `server.js` — local Express server
- `api/chat.js` — Vercel serverless function
- `lib/` — chatbot handler and portfolio knowledge
- `page-audit.md`, `audit-page.md` — earlier audit notes

## Run the website locally

The static pages can be opened as files, but the chatbot needs the Node server so the API key stays on the backend.

1. Install Node.js 18 or later.
2. In this folder, run:

```bash
npm install
npm start
```

3. Open `http://localhost:3000`.

Python programs:

```bash
python projects/python-programs/factorial.py
python projects/python-programs/fibonacci.py
python projects/python-programs/structure_to_dict.py
```

## Weather API

The weather section uses:

1. [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com/v1/search) to turn a city name into coordinates
2. [Open-Meteo Forecast](https://api.open-meteo.com/v1/forecast) for current temperature, weather code, humidity, and wind speed

No weather API key is required. Condition labels come from Open-Meteo weather codes.

## AI chatbot API setup

The chatbot is not a list of hardcoded answers. It sends the visitor question to a real AI model through `/api/chat`. The secret key must never be placed in `index.html`, `script.js`, `style.css`, or frontend environment files.

1. Copy `.env.example` to `.env`.
2. Put a real key in `.env`:

```
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

`AI_API_KEY` is also accepted if you prefer that name.

3. Restart `npm start`.
4. If the key is missing, the chat UI shows a setup message instead of pretending to work.

Opening `index.html` directly as a file cannot securely run the chatbot.

## Deploy on Vercel

This project is prepared for Vercel, but it has not been deployed from this environment.

1. Push the folder to GitHub (do not commit `.env`).
2. Import the repository in Vercel.
3. Add environment variable `OPENAI_API_KEY` in the Vercel project settings.
4. Deploy. The frontend calls the relative endpoint `/api/chat`.

A live URL should be added here only after a successful deployment.

## Known limitations

- GitHub profile URL, LinkedIn URL, and project repository URLs are not listed yet.
- The AI chatbot needs a configured API key.
- The weather widget needs a network connection to Open-Meteo.
- No public deployment URL is claimed in this README.

## Contact

Email: [snehagadia062@gmail.com](mailto:snehagadia062@gmail.com)
