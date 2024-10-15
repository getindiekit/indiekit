{
  config,
  inputs,
  lib,
  pkgs,
  ...
}: {
  enterShell = ''
    versions
  '';

  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  env = {
    DEBUG = "indiekit:*";
  };

  languages = {
    nix.enable = true;
  };

  packages = with pkgs; [
    git
    nodejs
  ];

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks = {
    alejandra.enable = true;
    prettier.enable = true;
    shellcheck.enable = true;
    statix.enable = true;
  };

  scripts = {
    frontend-build.exec = ''
      echo "Cleaning public directory..."
      find public/* -not -name 'README.md' -delete
      frontend-bundles
      frontend-html
    '';

    frontend-bundles.exec = ''
      echo "Bundling frontend..."
      npx lerna run bundles --scope @indiekit/frontend
    '';

    frontend-html.exec = ''
      echo "Compiling nunjucks templates..."
      npx lerna run compile:njk --scope @indiekit/frontend
    '';

    frontend-serve.exec = ''
      echo "Serving packages/frontend/public directory..."
      python3 -m http.server --directory packages/frontend/public 8080
    '';

    versions.exec = ''
      echo "=== Versions ==="
      git --version
      echo "Node.js $(node --version)"
      echo "=== === ==="
    '';
  };
}
