# Multi-stage build for optimal image size
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for efficient caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy source files
COPY . .

# Build Vite frontend and compile Express server
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy runtime files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
