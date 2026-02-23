FROM node:20-alpine

WORKDIR /app

# story-system comes from git, so git client is required during install
RUN apk add --no-cache git
RUN npm install -g db-migrate db-migrate-pg

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

ENV NODE_ENV=production
EXPOSE 3002

USER node
CMD ["node", "app.js"]
