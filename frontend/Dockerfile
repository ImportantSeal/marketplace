# --- Stage 1: Build React app ---
FROM node:20-alpine AS builder

WORKDIR /app

# VITE-muuttujan asetus build-vaiheessa
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Asenna riippuvuudet
COPY package*.json ./
RUN npm install

# Kopioi koko lähdekoodi ja rakenna
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Kopioi Reactin tuotostiedostot
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopioi oma nginx‐konfiguraatio niin että /api-proxyt toimivat
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
