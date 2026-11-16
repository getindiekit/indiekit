# Try Indiekit

The quickest way to see Indiekit working is the [Indiekit quickstart](https://github.com/getindiekit/indiekit-quickstart). It runs a complete IndieWeb site, built with the [Indiekit Eleventy theme](https://github.com/getindiekit/indiekit-theme-eleventy), with Indiekit, MongoDB and HTTPS in front of it, on your own computer or any server with Docker.

## Requirements

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose
- [Git](https://git-scm.com)

## Two steps

1. Clone the quickstart, including the theme:

   ```sh
   git clone --recurse-submodules https://github.com/getindiekit/indiekit-quickstart
   cd indiekit-quickstart
   ```

2. Answer a few questions, then start:

   ```sh
   ./bootstrap
   docker compose up -d
   ```

`bootstrap` asks for your site’s URL, a password for Indiekit and who you are, then writes them to `.env` and `site.json`. To try it on your own computer, press Enter at the first question to accept `http://quickstart.localhost`.

## Until the first image is public

The quickstart runs the official image, `ghcr.io/getindiekit/indiekit:beta`, which is published with each release. Until the first one is public, build the image from a copy of Indiekit, then run both steps with the quickstart’s local override:

```sh
git clone https://github.com/getindiekit/indiekit
docker build -f indiekit/docker/Dockerfile -t indiekit:local indiekit
COMPOSE_FILE=compose.yml:compose.local.yml ./bootstrap
COMPOSE_FILE=compose.yml:compose.local.yml docker compose up -d
```

## First steps

- Open your site’s URL to see your new website.
- Sign in to Indiekit at `/posts` on that URL, with the password you chose, and publish your first post. It appears on your site a few moments later.
- Use any [Micropub client](/clients): sign in with your site’s URL and the client finds Indiekit by itself.

## Bring your own generator

Already have a website, or prefer another static site generator? These template repositories each pair Indiekit with a generator, so that a post appears at the URL Indiekit reports:

- [Eleventy starter](https://github.com/getindiekit/eleventy-starter)
- [Hugo starter](https://github.com/getindiekit/hugo-starter)
- [Jekyll starter](https://github.com/getindiekit/jekyll-starter)

To configure Indiekit yourself, start from the [example configuration](https://github.com/getindiekit/example-config), or follow [Get started](/get-started).

## Find out more

The [quickstart’s README](https://github.com/getindiekit/indiekit-quickstart#readme) explains how to update it, where your content lives, and how to try it with sample content.
