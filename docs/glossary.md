## Glossary

The following terms (and associated shorthands) are used throughout the application and documentation:

* **Application** (`app`): The IndieKit server application, that listens and responds to requests.

* **[IndieAuth](https://www.w3.org/TR/indieauth/)**: An identity layer on top of OAuth 2.0, and used to obtain an OAuth 2.0 Bearer Token for use by Micropub clients.

* **Record**: Record of an action and associated changes, stored for later retrieval, i.e. for updating or undelete a post.

* **Media**: A discreet media item (photo, audio, video), often referenced by a post.

* **[Microformats](http://microformats.org/)** (`mf2`): A simple, open format for marking up data in HTML.

* **[Micropub](https://www.w3.org/TR/micropub/)**: A protocol used to create, update and delete posts on one’s own domain using third-party clients.

* **Post**: A discreet piece of content. The following [*post-types*](https://indieweb.org/posts) are supported by the provision of a default template and file locations:
  * 📄 [`article`](https://indieweb.org/article): A long post, typically featuring more structure and content than a note.
  * 📔 [`note`](https://indieweb.org/note): A short post, written & posted quickly, without a title.
  * 📷 [`photo`](https://indieweb.org/photo): A post whose primary content is a photograph or other image, with an optional caption.
  * 🎥 [`video`](https://indieweb.org/video): A post whose primary content is a video file (recorded movie, animation etc.) typically with audio.
  * 🎤 [`audio`](https://indieweb.org/audio): A post whose primary content is a sound recording.
  * 🔖 [`bookmark`](https://indieweb.org/bookmark): A post that is primarily comprised of a URL, often title text from that URL, sometimes optional text describing, tagging, or quoting from its contents.
  * 🚩 [`checkin`](https://indieweb.org/checkin): A post that shares the action of checking into a location.
  * 📅 [`event`](https://indieweb.org/event): A post that in addition to an event title has a start datetime (likely end datetime), and location.
  * 💬 [`reply`](https://indieweb.org/reply): A post that is a response to some other post, that makes little or no sense without reading or at least knowing the context of the source post.
  * 💌 [`rsvp`](https://indieweb.org/rsvp): A reply to an event post that says whether the sender is or is not attending, might attend, or is just interested in the event.
  * 👍 [`like`](https://indieweb.org/like): A post that shares an appreciation of another post.
  * ♻️ [`repost`](https://indieweb.org/repost): A post that is a re-publication of another post.

* **Publication** (`pub`): The website where published files are ultimately consumed.

* **Store**: A remote location where published posts and configuration files are stored. The following stores are supported:
  * [GitHub](https://github.com): A web-based hosting service where files are version controlled using Git.
