# Publishing a preview build to the public repository

The one-file editor (`app/dist/vss-editor.html`) is published on demand to https://github.com/ml-circuits-research/vss-public-demo
(GitHub Pages: the latest build is the site's page; every build is kept under `builds/` with its source commit). The workflow is
`.github/workflows/publish-preview.yml` in this repository; nothing of the source leaves it, only the built file. Previews are no
longer committed under `builds/` here.

## One-time setup (owner, about five minutes)

1. **Deploy key on the public repository.** In vss-public-demo: Settings > Deploy keys > Add deploy key; title
   `vss-demo publish-preview (write)`; tick **Allow write access**; key:

   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILGDfMVZvd6CZli/8mmn4gERjww5ALrg6fJ3CdW0iP1v vss-demo publish-preview deploy key
   ```

2. **The private half as a secret here.** In vss-demo: Settings > Secrets and variables > Actions > New repository secret; name
   `PUBLIC_DEMO_DEPLOY_KEY`; value: the whole content of the private key file that the coordinator session sent you
   (`deploykey`, the `-----BEGIN OPENSSH PRIVATE KEY-----` block). Do not commit it anywhere.
   (If you prefer your own key pair: `ssh-keygen -t ed25519 -N "" -f deploykey`, then use `deploykey.pub` in step 1 and `deploykey` here.)

3. **GitHub Pages on the public repository**: Settings > Pages > Source "Deploy from a branch", branch `main`, folder `/ (root)`.
   The workflow writes `index.html` (the latest build) and `.nojekyll` at the root.

## Publishing a build

Actions > "Publish preview build" > Run workflow. Inputs: `label` (optional, e.g. `probe-c`), `ref` (a commit, branch or tag of this
repository; default the current branch), `latest` (make it the site's page; default on). The run builds with `npm ci` and
`node app/build/build.mjs`, names the file `vss-editor-<date>-<sha>[-<label>].html`, and pushes it to the public repository
with the list updated in `builds/index.json` and the README table. The run's summary shows the file name.

Everything else about builds (how to build locally, what is in the file) is in `app/README.md`.
