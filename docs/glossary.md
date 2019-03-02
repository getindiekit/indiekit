## Glossary

The following terms (and associated shorthands) are used throughout the application and documentation:

* **Application** (`app`): The IndieKit server application, that listens and responds to requests.

* **[IndieAuth](https://www.w3.org/TR/indieauth/)**: An identity layer on top of OAuth 2.0, and used to obtain an OAuth 2.0 Bearer Token for use by Micropub clients.

* **Memo**: Record of an action and associated changes, stored for later retrieval, i.e. for updating or undelete a post.

* **[Microformats](http://microformats.org/)** (`mf2`): A simple, open format for marking up data in HTML.

* **[Micropub](https://www.w3.org/TR/micropub/)**: A protocol used to create, update and delete posts on one’s own domain using third-party clients.

* **Post**: A discreet piece of content. The following *post-types* are supported by the provision of a default template and file locations:
  * 📄 Article: A long post, typically featuring more structure and content than a note.
  * 📔 Note: A short post, written & posted quickly, without a title.
  * 📷 Photo: A post whose primary content is a photograph or other image, with an optional caption.

* **Publication** (`pub`): The website where published files are ultimately consumed.

* **Store**: A remote location where published posts and configuration files are stored. The following stores are supported:
  * [GitHub](https://github.com): A web-based hosting service where files are version controlled using Git.
