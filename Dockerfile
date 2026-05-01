FROM node:20.19
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
CMD ["sh", "-c", "sleep 10 && node src/server.js"]