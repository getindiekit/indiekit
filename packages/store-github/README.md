# @indiekit/store-github

Store IndieWeb content on GitHub.

## Installation

`npm i @indiekit/store-github`

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

| Option    | Type     | Description                                                                                |
| :-------- | :------- | :----------------------------------------------------------------------------------------- |
| `baseUrl` | `string` | Enterprise GitHub API URL. _Optional_, defaults to `https://api.github.com`.               |
| `user`    | `string` | Your GitHub username. _Required_.                                                          |
| `repo`    | `string` | The name of your GitHub repository. _Required_.                                            |
| `branch`  | `string` | The branch files will be saved to. _Optional_, defaults to `main`.                         |
| `token`   | `string` | [A GitHub personal access token][pat]. _Required_, defaults to `process.env.GITHUB_TOKEN`. |

[pat]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
