# Build stage
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Debug: show us the build directory structure
RUN ls -la dist/
RUN ls -la dist/*/

# Production stage
FROM nginx:alpine
# Update this path to match your actual build output
COPY --from=build /app/dist/cloud-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 