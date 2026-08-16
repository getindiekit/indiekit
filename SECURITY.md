# Security policy

The maintainer of this project ([@paulrobertlloyd](https://github.com/paulrobertlloyd)) takes the security of Indiekit seriously. The efforts of security researchers and users who responsibly disclose vulnerabilities are appreciated, and every effort is made to acknowledge contributions.

## Supported versions

Indiekit is in beta (`1.0.0-beta.x`) and developed as a [monorepo](https://github.com/getindiekit/indiekit/tree/main/packages), publishing the core `@indiekit/indiekit` package alongside official plug-ins under the `@indiekit` npm scope.

Only the **latest published beta release** of these packages receive security fixes. Older beta releases are not patched, so you should always run the most recent version.

You can check for updates with `npm outdated`.

| Version                | Supported |
| ---------------------- | --------- |
| Latest `1.0.0-beta.x`  | ✅        |
| Older beta releases    | ❌        |
| Pre-release/alpha tags | ❌        |

Once Indiekit reaches a stable `1.0.0` release, this policy will be revisited and this file updated accordingly.

## Reporting a vulnerability

> [!IMPORTANT]
> **Do not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

You can report a vulnerability using GitHub’s [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability):

1. Go to the [Security tab](https://github.com/getindiekit/indiekit/security) of this repository.
2. Click **Report a vulnerability** (under ‘Advisories’).
3. Fill in as much detail as you can, including:
   - The affected package(s) and version(s)
   - Steps to reproduce, or a proof of concept
   - The potential impact of the vulnerability
   - Any suggested mitigation or fix, if known

This opens a private conversation with the maintainer, visible only to you and the repository owners, so the issue can be discussed and fixed before any public disclosure.

Alternatively, you can go directly to: <https://github.com/getindiekit/indiekit/security/advisories/new>

### What to expect

- I will acknowledge new reports within 7 days, or earlier given the severity.
- I will keep you updated while investigating and working on a fix.
- Once a fix is released, I will publish a [GitHub Security Advisory](https://github.com/getindiekit/indiekit/security/advisories) and credit you for the discovery, unless you’d prefer to remain anonymous.
- I ask that you allow a reasonable time to release a fix before any public disclosure.

## Scope

This policy covers the Indiekit core server and the official plug-ins maintained in this repository (published under the `@indiekit` npm scope).

Vulnerabilities in third-party plug-ins, themes, or dependencies should be reported to their respective maintainers, though you’re welcome to let me know too if it affects how Indiekit uses them.
