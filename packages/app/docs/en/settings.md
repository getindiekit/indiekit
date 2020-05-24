# Getting started with {{ application.name }}

Before you can use {{ application.name }} to post to your website, there are a few things you’ll need to set up.

## Enable automatic discovery

To ensure {{ application.name }}’s endpoint can be discovered by Micropub clients (and have permission to publish to your website), you should add the follow values to your website’s `<head>`:

```html
<link rel="micropub" href="{{ application.url }}/micropub">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```

## Configure {{ application.name }}

With these values in place, you can configure {{ application.name }} by using the configuration wizard:

[Set up {{ application.name }} →](/settings)
