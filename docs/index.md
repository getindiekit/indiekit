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

{{ site.github.releases[0].name }}

---

The [IndieWeb](https://indieweb.org) is a community of personal websites, connected by simple standards. These follow the principles of publishing content at your own domain name and owning your data.

Indiekit lets your website use these standards and connect with this community, while enabling you to syndicate your content to popular social networks.

## Indiekit is for everyone

- ### Accessible

  Owning your own content should be easy and open to all. Indiekit’s web interface is designed to be accessible and can be localised to support different languages.

- ### Adaptable

  Like people, no two websites are the same. Indiekit is highly customisable to support different services and situations. Thanks to its underlying plug-in architecture, it’s extensible, too.

- ### Approachable

  Indiekit is fully documented and code is extensively commented, with individual functions described using JSDoc.

## Contributors

Indiekit is an open source project maintained by [Paul Robert Lloyd](https://paulrobertlloyd.com), a designer and web developer based in Brighton, England. If you have any questions about this project, you can [contact him via his website](https://paulrobertlloyd.com/contact/).

{% for contributor in site.github.contributors -%}
[![{{ contributor.login }}]({{ contributor.avatar_url }}){: width="48" }]({{ contributor.html_url }})
{% endfor %}
