# 🌟 Apollusia Contributing Guidelines

Thank you for your interest in contributing to Apollusia! We appreciate your effort and look forward to your contributions. Please take a moment to review these guidelines before getting started.

## 📌 Important Note

> **⚠️ IMPORTANT**
>
> **Pull Requests without an associated issue may not be accepted. While it is not a strict requirement, we strongly encourage you to create or assign an issue related to your contribution before submitting a Pull Request. This helps ensure that contributions align with the project’s goals and prevents the implementation of unwanted features.**

## 🤝 How to Contribute

1. Look at existing [Issues](https://github.com/Morphclue/apollusia/issues) or [create a new issue](https://github.com/Morphclue/apollusia/issues/new/choose).
2. Make your changes.
3. Stage your changes:

   ```sh
   git add <filename>
   ```

4. Commit your changes:

   ```sh
   git commit -m "<your-commit-message>"
   ```

5. Push your changes:

   ```sh
   git push origin "<your_branch_name>"
   ```

6. Create a [Pull Request](https://github.com/Morphclue/apollusia/compare).

## 🐛 Issues

- Select an appropriate [issue template](https://github.com/Morphclue/apollusia/issues/new/choose).
- Ensure you're not raising a duplicate issue.
- Comment on an issue if you want to work on it.
- Wait for maintainers to assign you the issue before starting work.
- Work on only ONE issue at a time.

### 🚫 Closing an Issue

- Leave a brief comment explaining why you're closing the issue.
- Close the issue after your Pull Request is merged.

## 📝 Commit Message Guidelines

We use the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) to ensure consistent and meaningful commit messages across the project:

```
<type>(<scope>): <description>
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scope** (optional): Area of the project (e.g., `auth`, `navbar`)
- **Description**: Brief explanation of the change
- **Issue number** (optional): Associated issue number

### ✅ Valid Commit Message Examples

- `feat(auth): Implement two-factor authentication`
- `fix(api): Resolve data inconsistency in user profiles`
- `docs: Update deployment instructions for AWS`
- `refactor(dashboard): Optimize data loading performance`

### ❌ Invalid Commit Message Examples

- `Added new feature`
- `Fixed bug in login`
- `Updated README`
- `chore: misc updates`

## Making Pull Requests 💥

When you submit a pull request, GitHub Actions will automatically run tests. If any tests fail, please try to resolve the issues. If you're unsure how, feel free to ask for help.

Each pull request should focus on a single logical change or set of related changes. If a pull request becomes too large or contains unrelated changes, it may be closed with a request to break it up into smaller PRs.

Remember to:

- Link the issue your pull request addresses (e.g., "Closes #99").
- Follow our [Commit Message Guidelines](#-commit-message-guidelines) for clear, consistent commits.
- Check "Allow edits from maintainers" to let us make minor adjustments directly.
- Resolve any merge conflicts with the main branch as needed (see GitHub's guide on resolving merge conflicts).

## 🧪 Testing Contributions

We value thorough testing to maintain the quality and reliability of Apollusia. For detailed information on how to test your contributions, please refer to our [Cypress Testing Guide](CYPRESS-TESTING-GUIDE.md) or [Jest Testing Guide](JEST-TESTING-GUIDE.md).

## 📢 Remarks

- If you find something missing or unclear in these guidelines, feel free to [create a PR](https://github.com/Morphclue/apollusia/compare) or [raise an issue](https://github.com/Morphclue/apollusia/issues).
- Ensure your contributions adhere to our [Code of Conduct](../CODE_OF_CONDUCT.md).
- You can tag maintainers for assistance using `@username`.

Thank you for contributing to Apollusia! 🎉
