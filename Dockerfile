# Official Indiekit runtime image.
#
# The whole workspace is installed, so every official package (endpoints, post
# types, presets, stores, syndicators) resolves by name from a mounted
# indiekit.config.js. Third-party plugins are not included.
#
# Run it with your configuration and content store mounted at /app, as your
# own user so files written to ./content belong to you:
#   docker run -p 3000:3000 \
#     -v ./indiekit.config.js:/app/indiekit.config.js:ro \
#     -v ./content:/app/content \
#     --user "$(id -u):$(id -g)" \
#     -e PUBLICATION_URL -e MONGO_URL -e SECRET -e PASSWORD_SECRET \
#     ghcr.io/getindiekit/indiekit
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-alpine

WORKDIR /app
ENV NODE_ENV=production

# Run as the unprivileged user the base image provides, so files written to a
# mounted content store are not owned by root.
RUN chown node:node /app
USER node

# The workspace manifests live inside packages/ and helpers/, so the whole
# tree is copied before install; a source change therefore reinstalls
# dependencies. Acceptable for a release image.
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node helpers ./helpers
COPY --chown=node:node packages ./packages
# --ignore-scripts: the root postinstall is husky, a development hook. Native
# modules (sharp) ship prebuilt binaries and need no install script.
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

EXPOSE 3000
CMD ["node", "packages/indiekit/bin/cli.js", "serve"]
