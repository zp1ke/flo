FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci && npm cache clean --force

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

# Set environment variables placeholders
ENV VITE_API_BASE_URL=ENV_API_BASE_URL

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm ci
RUN npm install @react-router/dev --save-dev
RUN npm run build

FROM node:20-alpine AS build
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

FROM nginx:stable-alpine
COPY --from=build /app/build/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
