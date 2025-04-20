# 🤝 Guide to Contributing to HydroForest

Welcome to **HydroForest**! We’re excited that you’re interested in contributing. Please read through this guide carefully before you get started. If you have any questions, reach out to one of the project founders.

---

## 🧩 Team Norms

- **Collaboration First**: We value open communication and teamwork.
- **Code Quality**: Write clean, readable, and well-documented code.
- **Respectful Environment**: Keep all communication respectful and constructive.
- **Transparency**: Be honest about progress and blockers—open communication ensures we can support each other effectively.
- **Feedback**: Be open to giving and receiving constructive feedback.
- **Seeking Help**: Use Discord or DMs to ask for help—tag relevant team members when needed.
- **Support for Struggling Members**: If someone falls behind, the Scrum Master will check in and offer support.
- **Conflict Resolution**: Resolve issues via chat first. If unresolved, escalate to a team meeting.
- **Timely Responses**: Respond to team messages within a couple of hours. Use direct tags for urgent matters.

---

## 🔁 Sprint Cadence

- Sprints are generally two weeks long, but may vary depending on feature size.
- Extensions are agreed upon by the team based on scope and progress.

---

## 🧍‍♂️ Daily Standups

- **Standups are 45 minutes** on weekdays, conducted over Zoom.
- Members will share their screens to show progress or blockers.
- Non-participating members will be reported to the Product Owner.
- If someone makes no progress for two consecutive meetings and doesn’t ask for help, they will be escalated to management.

---

## 🧑‍💻 Coding Standards

- Use **Visual Studio Code**.
- All work must be peer-reviewed and pass tests before merging to `main`.
- Only push working code. If you break the build, you are responsible for fixing it.
- Make **granular commits** per feature or bug fix.
- Use **clear commit messages** and **descriptive variable/function names**.
- Remove dead/commented-out code.
- Write **automated tests** for key functionality and integrations.

---

## 🌱 Git Workflow

We follow a structured Git workflow to keep things organized and maintain code quality:

1. **Fork the repository**

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/your-username/4-final-hydroforest
   cd 4-final-hydroforest

3. **Create a new Branch**
   ```sh
   git checkout -b BRANCH_NAME
4. **Commit your changes.**
    ```sh
    git commit -m "Add feature-name with description"
5. **Push your changes**
    ```sh
    git push origin feature-name
6. **Create a Pull Request.**
    - open a PR from your forked branch to the main branch of the original repository
    - Include a clear description of what the PR does and any context.

## 📌 Rules for Contributing

We want HydroForest to be a fun and collaborative environment to work in—following these contribution rules will help ensure a smooth development experience for everyone.

### ✅ 1. Follow Code Standards

- Adhere to the coding style and best practices defined in the project.
- Write clean, modular, and well-documented code.
- Use meaningful and descriptive names for variables, functions, and components.
- Keep your functions short and focused—each function should do one thing well.

### 🧪 2. Test Before You Push

- Always test your changes locally before creating a pull request (PR).
- Make sure you’re not breaking existing functionality.
- Write automated tests where applicable to ensure future stability.
- Double-check edge cases and potential bugs before pushing.

### 🚫 3. Don’t Push Directly to `main`

- All changes must go through a feature branch and be merged via a pull request.
- Never commit or push directly to the `main` branch.
- Use descriptive branch names, like `feature/tree-animation` or `bugfix/login-crash`.

### 🗣 4. Respond to Feedback

- Be open to constructive feedback on your PRs—code reviews help us all grow.
- Make revisions promptly when requested by reviewers.
- Keep discussions respectful and focused on improving the codebase.

### ❓ 5. Ask Questions Early

- If you’re stuck or unsure, **ask for help!**
- Use Discord or tag teammates in GitHub for questions.
- It’s always better to clarify early than to waste time or risk introducing bugs later.

### 🧼 6. Keep It Clean

- Don’t leave behind commented-out or unused code.
- Make sure to remove debugging statements (e.g., `console.log`) before committing.
- Keep your commits atomic—one logical change per commit.

### 📖 7. Write Helpful Commit Messages

- Your commit messages should describe *what* changed and *why*.
- Use the format: `Add login validation to prevent empty passwords`
- Avoid vague messages like `fixed stuff` or `update`.

---

By following these rules, you help keep the project stable, readable, and enjoyable for everyone. Thanks for being a great contributor! 


## Setting Up The Local Development Environment
- Download Visual Studio Code
- Clone the git repo

```bash 
git clone https://github.com/agiledev-students-spring2025/4-final-hydroforest
cd 4-final-hydroforest
```


We’re thrilled to have you here. Happy coding, and thank you for contributing to HydroForest! 🌳💧

