# Run Indiekit in a container

An image with every official plugin is published at `ghcr.io/getindiekit/indiekit`. You supply a configuration file, a content store and a MongoDB database; the image supplies everything else.

## Quick start with Docker Compose

Create `indiekit.config.js` (see [Configuration](/configuration/)) and a `compose.yml`:

```yaml
services:
  indiekit:
    image: ghcr.io/getindiekit/indiekit:beta
    restart: unless-stopped
    user: "1000:1000"
    ports:
      - "3000:3000"
    volumes:
      - ./indiekit.config.js:/app/indiekit.config.js:ro
      - ./content:/app/content
    environment:
      PUBLICATION_URL: http://localhost:3000
      MONGO_URL: mongodb://mongo:27017/indiekit
      SECRET: ${SECRET}
      PASSWORD_SECRET: ${PASSWORD_SECRET}
    depends_on:
      mongo:
        condition: service_healthy
  mongo:
    image: mongo:8
    restart: unless-stopped
    volumes:
      - mongo:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  mongo:
```

Replace `1000:1000` with your own user and group ids (`id -u` and `id -g`), so files written to `./content` belong to you.

Create the store directory yourself, so it is owned by you:

```sh
mkdir content
```

Write a `.env` file beside `compose.yml` with your secrets:

```sh
printf "SECRET='…'\nPASSWORD_SECRET='…'\n" > .env
```

`SECRET` is any long random string; `PASSWORD_SECRET` comes from the "Set your password" section below.

Then:

```sh
docker compose up -d
```

Indiekit listens on port 3000. Put a reverse proxy with HTTPS in front of it for a public site.

## What the image expects

Run the container as your own uid:gid so the mounted store is writable; the default `node` user (1000) only works when your uid is 1000.

| Path or variable | Purpose |
|---|---|
| `/app/indiekit.config.js` | Your configuration. Mounted read-only. |
| `/app/content` | The directory for `@indiekit/store-file-system`, if you use it. |
| `PUBLICATION_URL` | Your site’s URL. |
| `MONGO_URL` | MongoDB connection string. |
| `SECRET`, `PASSWORD_SECRET` | See [Get started](/get-started). |
| `PORT` | Optional, defaults to 3000. |

Any plug-ins you configure may need their own secrets; pass them the same way.

Any official plugin named in your configuration is already installed. Third-party plugins are not included in the image; build your own image on top of this one to add them.

> [!WARNING]
> `PUBLICATION_URL` must resolve from inside the container: signing in makes the server fetch its own URL to complete IndieAuth. On a laptop that means the published host port must equal the container port (`3000:3000` with `PUBLICATION_URL=http://localhost:3000`); behind a reverse proxy, the public URL must be reachable from the container.

## Set your password

1. Start the stack without `PASSWORD_SECRET` set.
2. Visit `/auth/new-password` at your `PUBLICATION_URL`.
3. Enter the password you want to use and copy the generated value.
4. Set `PASSWORD_SECRET` to that value and restart the stack.

See [Get started](/get-started) for the `$` quoting rules that apply to this value in `compose.yml`.

## Tags

The first image appears with the first release after this lands; until then no tag exists.

| Tag | Built from | When |
|---|---|---|
| `1.0.0-beta.29` | The release tag | Each GitHub release |
| `beta` | The newest prerelease | Each GitHub release while Indiekit is in beta |
| `latest`, `1`, `1.0` | The newest stable release | From the first stable release onward |
| `nightly`, `main-<sha>` | `main` | Every night `main` has changed |
| `<channel>`, `<channel>-<sha>` | Any ref, on request | When a maintainer publishes a preview |

Images are built for `linux/amd64` and `linux/arm64`.
