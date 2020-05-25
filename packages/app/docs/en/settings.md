# Getting started with {{ application.name }}

Before you can use {{ application.name }} to post to your website, there are a few things you’ll need to set up.

## Enable automatic discovery

To ensure {{ application.name }}’s endpoint can be discovered by Micropub clients (and have permission to post to your website), you should add the follow values to your website’s `<head>`:

```html
<link rel="micropub" href="{{ application.url }}/micropub">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```

## Set up {{ application.name }}

With these values in place, you can then customise how {{ application.name }} works and interacts with your website by using the set up wizard:

[Set up {{ application.name }} →](/settings)
