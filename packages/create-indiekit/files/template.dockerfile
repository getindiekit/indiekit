# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.5.0
FROM node:${NODE_VERSION}-alpine

# Create app directory
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Install node modules
COPY package*.json ./

# Can’t use `npm ci` due to https://github.com/npm/cli/issues/4828
RUN npm i --omit=dev --package-lock=false

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the server by default, this can be overwritten at runtime
CMD [ "npx", "indiekit", "serve" ]
