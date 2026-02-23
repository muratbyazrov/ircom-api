# syntax=docker/dockerfile:1.4
FROM node:20-alpine

WORKDIR /app

# story-system comes from git, so git/ssh client are required during install
RUN apk add --no-cache git openssh-client

COPY package*.json ./
RUN mkdir -p -m 0700 /root/.ssh \
    && ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN --mount=type=ssh npm ci --omit=dev && npm cache clean --force

COPY . .

ENV NODE_ENV=production
EXPOSE 3002

USER node
CMD ["node", "app.js"]
