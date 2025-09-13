# ---- Stage 1: Build the Application ----
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies using Debian's 'apt-get' package manager
RUN apt-get update && apt-get install -y python3 make g++ && npm install && apt-get purge -y --auto-remove python3 make g++

# Copy the rest of your application's source code
COPY . .

# Build the Next.js application for production
RUN npm run build


# ---- Stage 2: Create the Final Production Image ----
FROM node:18-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# --- Oracle Client Installation ---
ARG ORACLE_CLIENT_ZIP="instantclient-basic-linux.x64-19.28.0.0.0dbru.zip"
ARG ORACLE_CLIENT_DIR="instantclient_19_28"

# --- FIX: Added 'openssl' to this line ---
RUN apt-get update && apt-get install -y unzip libaio1 openssl && rm -rf /var/lib/apt/lists/*
COPY ${ORACLE_CLIENT_ZIP} .
RUN unzip ${ORACLE_CLIENT_ZIP} && rm ${ORACLE_CLIENT_ZIP}
ENV LD_LIBRARY_PATH=/app/${ORACLE_CLIENT_DIR}

EXPOSE 3000

CMD ["npm", "start"]