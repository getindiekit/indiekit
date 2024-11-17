# @indiekit/store-github

[GitHub](https://github.com) content store adaptor for Indiekit.

## Installation

`npm install @indiekit/store-github`

## Requirements

A [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with read and write permissions to a repository.

If creating a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens), ensure that permissions for your repository include **Read** access to **Metadata** and **Read and write** access to **Contents**. The token expiration is up to you.

> [!IMPORTANT]
> Store your personal access token in an environment variable called `GITHUB_TOKEN` so that only you and the application can see it.

## Usage

Add `@indiekit/store-github` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-github"],
  "@indiekit/store-github": {
    "user": "username",
    "repo": "reponame"
  }
}
```

## Options

| Option    | Type     | Description                                                                         |
| :-------- | :------- | :---------------------------------------------------------------------------------- |
| `baseUrl` | `string` | Enterprise GitHub API URL. _Optional_, defaults to `https://api.github.com`.        |
| `user`    | `string` | Your GitHub username. _Required_.                                                   |
| `repo`    | `string` | The name of your GitHub repository. _Required_.                                     |
| `branch`  | `string` | The branch files will be saved to. _Optional_, defaults to `main`.                  |
| `token`   | `string` | A GitHub personal access token. _Required_, defaults to `process.env.GITHUB_TOKEN`. |
