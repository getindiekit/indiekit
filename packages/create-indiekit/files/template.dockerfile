# Adjust NODE_VERSION as desired. Indiekit requires Node.js v24.17 or later.
# Floating on the major version keeps security updates flowing, rather than
# pinning to a patch release that will eventually be too old to run Indiekit.
ARG NODE_VERSION=24
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
