# --- STAGE 1: Build the Frontend ---
FROM node:20-alpine AS frontend-builder

WORKDIR /app/Frontend

# Install dependencies
COPY Frontend/package*.json ./

RUN npm install

# Copy source and build
COPY Frontend/ ./

RUN npm run build 
# (This creates the /app/Frontend/dist folder)


# --- STAGE 2: Build the Backend ---
# Replace 'node:20-alpine' with your backend runtime (e.g., golang, python, etc.)
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY Backend/package*.json ./

RUN npm install --production

# Copy backend source code
COPY Backend/ ./
 
# --- STAGE 3: The "Glue" ---
# Copy the 'dist' folder from the frontend-builder stage 
# into the backend's public/static directory
COPY --from=frontend-builder /app/Frontend/dist ./dist

# Expose the port your backend runs on (3000 in this case)
EXPOSE 3000


# Start the server
CMD ["node", "server.js"]