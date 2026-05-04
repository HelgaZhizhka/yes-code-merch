"""Automated Claude PR review — posts a code review comment on a GitHub PR."""

import os
import subprocess

import anthropic

MAX_DIFF_CHARS = 60_000

SYSTEM_PROMPT = """You are a senior software engineer reviewing a pull request for the yes-code-merch project.

Project context:
- Stack: React + TypeScript (strict mode) + Vite + TanStack Router + Zustand + Supabase + Tailwind CSS
- Architecture: Feature-Sliced Design (FSD) — layers: app, pages, features, entities, shared
  - Import direction: app → pages → features → entities → shared (never upward)
  - Each layer has an index.ts public API; internals are not imported directly
- Package manager: pnpm

Review focus (in priority order):
1. TypeScript correctness — no `any`, no unsafe casts (`as`), proper explicit types
2. FSD layer boundaries — no upward imports, no circular dependencies
3. React correctness — immutable state, proper list keys, no index as key for dynamic lists
4. Accessibility — semantic HTML (section not div[role=region], input not button[role=checkbox]), ARIA attributes
5. Security — no command injection, no XSS, safe use of external data
6. Logic correctness — edge cases, null/undefined handling, error handling at system boundaries
7. Code quality — no dead code, no premature abstractions, no unnecessary wrappers

Format your review as GitHub-flavoured markdown:
- Start with a one-sentence summary of what the PR does
- **Issues** section: list only real problems (bugs, violations, security). For each: `file.tsx:line — description`
- **Suggestions** section (optional): improvements worth considering but not blocking
- **Looks Good** section: 1-3 things done well

Rules:
- Be concise and direct. No filler phrases.
- Skip issues already caught by ESLint/Prettier (formatting, import order, etc.)
- Do not comment on missing tests unless tests were explicitly required
- If there are no issues, say "No issues found." and skip that section
- Maximum 600 words total
"""


def get_diff() -> str:
    base_sha = os.environ["BASE_SHA"]
    head_sha = os.environ["HEAD_SHA"]
    result = subprocess.run(
        ["git", "diff", f"{base_sha}...{head_sha}"],
        capture_output=True,
        text=True,
        check=True,
    )
    diff = result.stdout
    if len(diff) > MAX_DIFF_CHARS:
        diff = diff[:MAX_DIFF_CHARS] + "\n\n[... diff truncated — too large to show in full ...]"
    return diff


def post_comment(body: str) -> None:
    pr_number = os.environ["PR_NUMBER"]
    repo = os.environ["REPO"]

    with open("/tmp/review_body.md", "w") as f:
        f.write(body)

    subprocess.run(
        ["gh", "pr", "comment", pr_number, "--repo", repo, "--body-file", "/tmp/review_body.md"],
        check=True,
    )


def main() -> None:
    diff = get_diff()

    if not diff.strip():
        print("No diff found, skipping review.")
        return

    pr_title = os.environ.get("PR_TITLE", "")

    client = anthropic.Anthropic()

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"PR title: {pr_title}\n\n"
                    f"Diff:\n\n```diff\n{diff}\n```"
                ),
            }
        ],
    )

    review = message.content[0].text
    body = f"## 🤖 Claude Code Review\n\n{review}\n\n---\n*Automated review by [Claude Sonnet](https://anthropic.com)*"

    post_comment(body)
    print("Review posted successfully.")


if __name__ == "__main__":
    main()
