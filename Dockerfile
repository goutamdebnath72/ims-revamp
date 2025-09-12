# ---- Stage 1: Build the Application ----
# Use an official Node.js runtime as the base image.
# We specify the version to ensure consistency.
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer caching.
# This step only re-runs if these files change.
COPY package*.json ./

# Install all dependencies, including devDependencies needed for the build
RUN npm install

# Copy the Prisma schema to generate the client
COPY prisma ./prisma/

# Generate the Prisma client
RUN npx prisma generate

# Copy the rest of your application's source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# ---- Stage 2: Create the Final Production Image ----
# Start from a fresh, lightweight Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Set the NODE_ENV environment variable to 'production'
ENV NODE_ENV=production

# Copy only the necessary files from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# #############################################################################
# ## ORACLE CLIENT INSTALLATION - PENDING ##
# ## We will add commands here to install the Oracle Instant Client ##
# ## once we know the production database version. ##
# ## For example: ##
# ## RUN apk add --no-cache libaio && \ ##
# ## wget https://.../instantclient-basic-linux.zip && \ ##
# ## unzip instantclient-basic-linux.zip && \ ##
# ## ... etc. ... ##
# #############################################################################

# Expose the port that Next.js runs on
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]