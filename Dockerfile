FROM node:20.10 as angular

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install
# RUN npm run build

CMD ["ng", "serve"]

# FROM nginx:latest

# WORKDIR /usr/share/nginx/html
# COPY --from=angular /app/public/browser .
EXPOSE 4201