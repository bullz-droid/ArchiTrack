# ArchiTrack Client

A Material UI React 18+ frontend for the Architect-Client platform.

## Setup

1. Copy environment variables:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Run the development server:
   - `npm run dev`

## Environment

- `VITE_API_URL` - backend API endpoint
- `VITE_SOCKET_URL` - socket server endpoint

## Architecture

- React + TypeScript + Vite
- Material UI v5
- React Router v6
- Axios for API calls
- socket.io-client for realtime updates
- Formik + Yup for form validation
- React Dropzone for file uploads

## Available scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Notes

This client is designed to work with the ArchiTrack backend API and socket server. Keep `client/.env` configured to point at the backend service.
