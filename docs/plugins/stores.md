# Content stores

A [content store](../concepts#content-store) is a location where Indiekit can save post content and media files. Plug-ins are available for the following platforms:

## [@indiekit/store-bitbucket](https://npmjs.org/package/@indiekit/store-bitbucket)

<Badge type="tip" text="Offical" />

[Bitbucket](https://bitbucket.org) content store adaptor.

## [@indiekit/store-file-system](https://npmjs.org/package/@indiekit/store-file-system)

<Badge type="tip" text="Offical" />

File system content store adaptor.

## [@indiekit/store-ftp](https://npmjs.org/package/@indiekit/store-ftp)

<Badge type="tip" text="Offical" />

FTP content store adaptor.

## [@indiekit/store-gitea](https://npmjs.org/package/@indiekit/store-gitea)

<Badge type="tip" text="Offical" />

[Gitea](https://gitea.com) content store adaptor.

## [@indiekit/store-github](https://npmjs.org/package/@indiekit/store-github)

<Badge type="tip" text="Offical" />

[GitHub](https://github.com) content store adaptor.

The GitHub content store uses the [GitHub Contents API](https://docs.github.com/en/rest/repos/contents) to create and update files. In order to use it, you will need a GitHub token that has access to the repository you want to use as content store, and that has the required **Repository permissions**.

You can create a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) that has **Read and Write** access to **Contents**. The token expiration is up to you.

![Required permissions for the fine-grained GitHub personal access token used by the Indiekit GitHub content store](/github-token-permissions-for-github-content-store.png)

## [@indiekit/store-gitlab](https://npmjs.org/package/@indiekit/store-gitlab)

<Badge type="tip" text="Offical" />

[GitLab](https://gitlab.com) content store adaptor.

## [@indiekit/store-s3](https://npmjs.org/package/@indiekit/store-s3)

<Badge type="tip" text="Offical" />

[S3-compatible](https://aws.amazon.com/s3/) content store adaptor.
