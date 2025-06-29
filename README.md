# Eternal Chat Backend

Backend API for the Eternal Chat application using Node.js, Express, and Google Gemini AI.

## Features

- RESTful API for chat messages
- Integration with Google Gemini 1.5 Flash model
- Character-specific prompts
- CORS enabled for frontend integration
- Health check endpoint
- Error handling and validation

## Project Structure

```
backend/
├── prompts/                 # Character prompt files
│   ├── saladin.txt         # Saladin character prompt
│   ├── ibn-sina.txt        # Ibn Sina character prompt
│   ├── cleopatra.txt       # Cleopatra character prompt
│   ├── alexander.txt       # Alexander the Great prompt
│   ├── einstein.txt        # Einstein character prompt
│   ├── ahmed-zewail.txt    # Ahmed Zewail character prompt
│   └── default.txt         # Default character prompt
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Gemini API key:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### POST /api/message
Send a message to a character and get an AI response.

**Request Body:**
```json
{
  "message": "مرحبا، كيف حالك؟",
  "character": "صلاح الدين الأيوبي"
}
```

**Response:**
```json
{
  "reply": "مرحباً بك، أنا بخير والحمد لله...",
  "character": "صلاح الدين الأيوبي",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "Eternal Chat Backend"
}
```

### GET /
Root endpoint with API information.

## Supported Characters

- صلاح الدين الأيوبي (Saladin)
- ابن سينا (Ibn Sina)
- كليوباترا (Cleopatra)
- الإسكندر الأكبر (Alexander the Great)
- ألبرت أينشتاين (Einstein)
- أحمد زويل (Ahmed Zewail)

## Deployment

### Render.com

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add `DEEPSEEK_API_KEY`

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variable `DEEPSEEK_API_KEY`
3. Deploy automatically

### Heroku

1. Create a new Heroku app
2. Set environment variables:
```bash
heroku config:set GEMINI_API_KEY=your_api_key
```
3. Deploy using Git or GitHub integration

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (default: 3000)

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- API connection errors
- Invalid requests
- Server errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
