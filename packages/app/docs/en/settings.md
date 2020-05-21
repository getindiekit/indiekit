---
title: Getting started with {{ settings.name }}
---
Before you can use {{ settings.name }} to post to your website, there are a few things you’ll need to set up.

### Enable automatic discovery
To ensure {{ settings.name }}’s endpoint can be discovered by Micropub clients (and have permission to publish to your website), you should add the follow values to your website’s `<head>`:

```html
<link rel="micropub" href="{{ settings.url }}/micropub">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```

### Configure {{ settings.name }}
With these values in place, you can configure {{ settings.name }} by using the configuration wizard:

[Set up {{ settings.name }} →](/settings)
