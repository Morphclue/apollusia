# 🌟 Apolusia Contributing Guidelines

Thank you for your interest in contributing to Apollusia! We appreciate your effort and look forward to your contributions. Please take a moment to review these guidelines before getting started.

## 📌 Important Note

> **⚠️ IMPORTANT**
>
> **Pull Requests _without an associated issue_ will not be accepted. Please ensure you have an assigned issue before creating a Pull Request.**

## 🚀 Prerequisites

- 📚 **Open Source Etiquette**: New to open source? Read about [Basic etiquette](https://developer.mozilla.org/en-US/docs/MDN/Community/Open_source_etiquette) for open source projects.

- 🐙 **Git and GitHub Basics**: Unfamiliar with these tools? Check out [GitHub for complete beginners](https://developer.mozilla.org/en-US/docs/MDN/Contribute/GitHub_beginners) for a comprehensive introduction.

- 📦 **PNPM**: Make sure you have [PNPM](https://pnpm.io/installation) installed on your system.

## ⚡️ Quick Setup

### 🐳 Docker Compose

Run Apollusia on your system using Docker Compose:

```shell
git clone --depth 1 --branch master https://github.com/Morphclue/apollusia 
cd apollusia
docker compose up -d
```

This will start the following services:

- 🗄️ **Database** (MongoDB) on port `27017`
- 🖥️ **Frontend** on port `4000`
- 🔧 **Backend** on port `3000`
- 🔐 **Keycloak** on port `8080`

**Verify Services**

Once Docker Compose completes setup, verify each service is running as expected by checking the logs or using `docker ps`.


## 🤝 How to Contribute

1.  Look at existing [**Issues**](https://github.com/Morphclue/apollusia/issues) or [**create a new issue**](https://github.com/Morphclue/apollusia/issues/new/choose).

2.  Make your changes.

3.  Stage your changes:
   ```sh
   git add <filename>
   ```

4.  Commit your changes:
   ```sh
   git commit -m "<your-commit-message>"
   ```

5.  Push your changes:
   ```sh
   git push origin "<your_branch_name>"
   ```

6.  Create a [PULL REQUEST](https://github.com/Morphclue/apollusia/compare).

## 🐛 Issues

-  Select an appropriate [issue template](https://github.com/Morphclue/apollusia/issues/new/choose).
-  Ensure you're not raising a duplicate issue.
-  Comment on an issue if you want to work on it.
-  Wait for maintainers to assign you the issue before starting work.
-  Work on only ONE issue at a time.

### 🚫 Closing an Issue

-  Leave a brief comment explaining why you're closing the issue.
-  Close the issue after your Pull Request is merged.

## 📝 Commit Message Guidelines

We use Commitlint with the Conventional Commits specification to ensure consistent and meaningful commit messages across the project: 

```
<type>(<scope>): <description> (#<issue-number>)
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scope** (optional): Area of the project (e.g., `auth`, `navbar`)
- **Description**: Brief explanation of the change
- **Issue number** (optional): Associated issue number

### ✅ Valid Commit Message Examples

- `feat(auth): Implement two-factor authentication (#123)`
- `fix(api): Resolve data inconsistency in user profiles (#456)`
- `docs: Update deployment instructions for AWS`
- `refactor(dashboard): Optimize data loading performance (#789)`

### ❌ Invalid Commit Message Examples

- `Added new feature`
- `Fixed bug in login`
- `Updated README`
- `chore: misc updates`

For aditonal information please refer to [conventional commit specification](https://www.conventionalcommits.org/en/v1.0.0/)

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

-  If you find something missing or unclear in these guidelines, feel free to [create a PR](https://github.com/Morphclue/apollusia/compare), [raise an issue](https://github.com/Morphclue/apollusia/issues), or [review someone's PR](https://www.freecodecamp.org/news/code-review-tips/).
-  Ensure your contributions adhere to our [Code of Conduct](../CODE_OF_CONDUCT.md).
-  You can tag maintainers for assistance using `@username`.

Thank you for contributing to Apollusia! 🎉
