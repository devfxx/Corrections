# Grammarly API Service

A lightweight API service that provides text correction and grammar checking capabilities using a Reverse Engineered Grammarly API. Built with Hono.js for optimal performance and reliability.

## Features

- Text correction and grammar checking
- Automatic spacing and punctuation formatting
- Error handling and input validation
- RESTful API endpoints

## API Reference

### Correct Text

Analyzes and corrects the provided text using Grammarly's engine.

**Endpoint:** `POST /correct`

**Request Body:**

```json
{
  "text": "Your text here"
}
```

**Success Response:**

```json
{
  "error": false,
  "message": "Your corrected text here"
}
```

**Error Responses:**

_Invalid Request (400):_

```json
{
  "error": true,
  "message": "Invalid request body"
}
```

_Server Error (500):_

```json
{
  "error": true,
  "message": "Internal server error"
}
```

### Default Route

Returns a friendly greeting message for all other routes.

**Endpoint:** `GET *`

**Response:**

```json
{
  "error": false,
  "message": "Hi there!"
}
```

## How It Works

1. **Input Validation**

   - The service validates incoming requests using Zod schema validation
   - Ensures the text field is present and non-empty

2. **Text Analysis**

   - Sends the text to Grammarly's API for analysis
   - Implementation: [`src/index.ts`](src/index.ts)

3. **Text Transformation**
   The service applies several transformations to the text:

   a. **Correction Application**

   - Processes each alert from Grammarly
   - Applies suggested corrections sequentially
   - Updates positions of subsequent corrections to account for text length changes
   - Implementation: [`src/lib/transform.ts`](src/lib/transform.ts)

   b. **Final Formatting**

   - Ensures proper spacing after punctuation
   - Removes excessive spaces
   - Trims the final result
   - Implementation: [`src/lib/transform.ts`](src/lib/transform.ts)

## Error Handling

The service implements comprehensive error handling:

1. **Request Validation Errors**

   - Validates request body schema
   - Returns 400 status code for invalid requests

2. **Server Errors**
   - Catches and logs unexpected errors
   - Returns 500 status code with a generic error message
   - Prevents sensitive error information from reaching the client

## License

MIT
