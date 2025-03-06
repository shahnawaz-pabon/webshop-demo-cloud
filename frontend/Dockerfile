# Build Stage
FROM node:18 as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build the project
COPY . .
RUN npm run build

# Debug: Show the output directory (to confirm files exist)
RUN ls -la dist/
RUN ls -la dist/*/

# Production Stage
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built frontend app to Nginx public directory
COPY --from=build /app/dist/cloud-frontend/browser /usr/share/nginx/html

# Copy the custom Nginx config for HTTPS support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose both HTTP and HTTPS ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
