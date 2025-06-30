# InvestWise API Server

This Express.js server provides AI-powered investment term explanations using OpenAI's GPT-3.5-turbo model.

## Setup

1. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run server
   ```

   Or run both frontend and backend together:
   ```bash
   npm run dev:full
   ```

## API Endpoints

### POST /api/explain-term

Explains investment terms with AI-generated definitions and analogies.

**Request Body:**
```json
{
  "term": "dividend"
}
```

**Response:**
```json
{
  "definition": "A dividend is a payment made by a company to its shareholders, usually from profits.",
  "analogy": "Think of dividends like getting a bonus from your employer - the company shares its success with you as a reward for being an investor."
}
```

**Error Responses:**
- `400`: Missing or invalid term
- `500`: Server error, API key issues, or OpenAI API problems

### GET /api/health

Health check endpoint to verify server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid input
- OpenAI API key configuration issues
- Rate limiting
- Quota exceeded
- Network errors
- JSON parsing errors