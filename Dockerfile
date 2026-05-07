FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ENV VITE_API_URL=http://localhost:50051

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine

COPY nginx.default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
