---
description: The little server that connects your personal website to the independent web.
nav_order: 1
nav_exclude: true
---

# We are better, connected
{: .fs-9 }

Indiekit is the little server that connects your personal website to the independent web.
{: .fs-7 .fw-300 }

[Get started](get-started.md){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub]({{ site.github.repository_url }}){: .btn .fs-5 .mb-4 .mb-md-0 }

---

The [IndieWeb](https://indieweb.org) is a community of individual personal websites, connected by simple standards. It is based on the principles of owning your domain, publishing on your own site and owning your data. Indiekit lets your website use these standards to connect with a wider community and syndicate your content to social networks.

## The web is for everyone, and so is Indiekit

Indiekit has been designed from the very beginning to be:

- ### Accessible

  Owning your own content and contributing to the independent web should be easy and open to all. Indiekit’s web interface is designed to be accessible to all, regardless of individual needs or technology requirements. It can also be localised to support different languages.

- ### Adaptable

  Like people, no two websites are the same. Indiekit is highly customisable and provides support for different services and situations. Thanks to its underlying plugin architecture, it’s extensible, too.

- ### Approachable

  Documentation describes how Indiekit works and how it can be customised to suit differing needs. The code is open source and extensively commented, and individual functions are documented using JSDoc.

## Contributors

Indiekit is maintained by [Paul Robert Lloyd](https://paulrobertlloyd.com), a designer and web developer based in Brighton, England. If you have any questions about this project, you can [contact him via his website](https://paulrobertlloyd.com/contact/).

{% for contributor in site.github.contributors -%}
[![{{ contributor.login }}]({{ contributor.avatar_url }}){: width="48" }]({{ contributor.html_url }})
{% endfor %}
