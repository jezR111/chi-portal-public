## Contributing Guidelines

**Never commit `node_modules` or any dependencies.**

- `node_modules` is ignored via `.gitignore` and a pre-commit hook will block such commits.
- If you see `node_modules` in your staged files, run:
  ```sh
  git rm -r --cached node_modules
  ```
- Only commit source code and configuration files.

---

For more details, see `.gitignore` and `.git/hooks/pre-commit`.
