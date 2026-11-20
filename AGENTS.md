#

## Workspace

- `package.json` lists a few NPM workspace folders.
- When working in an NPM workspace folder, read its applicable `AGENTS.md` files and any relevant skills under `.agents/skills/`. Also, you normally must run relevant commands from the given folder.

## Git Repo

- An explicit request to create or retain a repository file/folder or add an ignore rule for one counts as approval. Otherwise, ask before deciding that a newly created untracked entry should become tracked repository content, or before adding an ignore rule.
- When adding a file or a folder to `.gitignore`, use such a syntax that would match only the file system entry of that particular type (file or folder).

## Coding Guidelines

- Keep the code simple and avoid unnecessary overengineering. The software shall work correctly and securely for all stated requirements and all realistically possible inputs and reachable states. Do not add complexity solely to handle impossible states or use cases that do not need to be supported.
- Do not autonomously introduce a material tradeoff involving correctness, security, compatibility, or trust assumptions. Identify the available options and their implications, and let me choose among them.
- Do not assume that an input is valid or non-malicious unless that assumption follows from an enforced invariant or I approve it.
- With my approval, a simpler solution that can be improved later may be preferred over a more complex ideal solution, provided it satisfies the approved correctness and security requirements.

## Code Style

- When hardcoding a number, if possible, use a clarifying constant expression. For example, for the number of milliseconds in an hour, use `60 * 60 * 1000` instead of `3600000`.
- In a ternary operator `a ? b : c`, enclose each operand in parentheses, unless it's a single thing, such as a variable or function call.
- In TypeScript, when calling a method such as `console.info`, typically pass a format string, such as `"%s"`, as the first argument.

## Naming Conventions

- In the code, name things descriptively and verbosely. This also applies to file names. Do not force names to be short. Prefer not to shorten words, except for the following: `Prev`, `Param`, `Arg`, `Char`, `Min`, `Max`, `Temp`, `Id`, `hre`. Also use commonly used abbreviations, such as `Json`, `Rpc`, `Url`, `Evm`, `Abi`, `Nft`.
- Begin non-public contract member names and non-public class member names with `_`.
- End function parameter names and local symbol names with `_`.

## Scripts

- Each TypeScript or Bash script that is intended to be executed (not a library) shall define and invoke a `main` function.

## Comments and ToDos

- Review `docs/numbered-annotations.md`. It contains some instructions for you. Prefer writing numbered annotations when they offer an advantage over their non-numbered counterparts. Consider using numbered annotations to link dependent or similar parts of the codebase. Similar code is not necessarily dependent, but when one occurrence requires refactoring, others may require the same change. A numbered comment identifying repeated logic or data structures can help locate all affected places.
- Perform AI or human todos only if requested to do so in the prompt. Delete every todo that you have completed.
- If you are not to perform a todo, use it as context. For example, if the prompt says to develop tests and a todo says to confirm a certain relevant behavior, consider proposing a test for that case.
- Comments and docs should be brief, but clear to someone with limited familiarity with the project. When referring to project-specific concepts, use their full or clearly descriptive names.
- Explain non-obvious intricacies in comments. For example, explain dependencies of logic in different parts of the codebase.
- That said, when performing a refactoring or editing, it can be helpful for me if you explain non-obvious intricacies related to the refactoring in detail in verbose temporary to-be-deleted comments. Format them as follows:

  ```solidity
  // DEL: (Provide details about what you did
  // DEL: and why you did it.)
  ```

  For example, when you move code or text to a different location while also refactoring or deleting parts of it, write a `DEL:`-comment at the old location about what you've done. You can link the locations with a numbered comment. (It's OK to waste an ID in a `DEL:`-comment.)
- Maintain commented-out code when practical. When refactoring active code, update analogous commented-out code too. If commented-out code is already stale or cannot be updated without broader work, add a `ToDo-10` describing what must be done after it is uncommented.
- When an explanatory comment or todo occupies one or more separate lines and is associated with code, place it before the relevant lines of code. Separate surrounding text at the same indentation level by inserting an empty line before the comment and after the last relevant line of code, as applicable and when the surrounding structure permits it. For purposes of this rule, treat a code block enclosed in curly braces in TypeScript, or an analogous block construct in another programming language, as a single code unit at its indentation level, regardless of empty lines within the block. If a comment is not associated with subsequent code, treat it as followed by zero lines of code. When deleting a comment, delete any empty lines that are no longer needed, but preserve empty lines still required by the surrounding structure or other comments.

## Issue-Comments

- An **issue** is a concrete, understood, and currently accepted concern or undesirable aspect of an implementation or design. Examples include non-ideal behavior, inconsistencies, inefficiencies, code smells, maintainability problems, fragility, coupling, omissions, assumptions, workarounds, latent risks, reliance on behavior that future changes could invalidate, and other imperfections.
- Unlike a todo, an issue records something we do not currently plan to change. It is accepted because the current solution is adequate, improving it is not presently worth the added complexity, cost, or risk, or a change elsewhere -- including in an external dependency -- must happen first.
- A non-obvious issue shall be documented with an issue-comment like this:

  ```solidity
  // Issue. (Briefly explain what is undesirable and its implications.
  // As relevant, mention assumptions, dependencies, workarounds, omissions, or why the issue
  // is currently accepted rather than made a todo.)
  ```

- If an issue has concrete, foreseeable trigger conditions that would require revisiting it, detail those conditions in a `ToDo-3` after the issue-comment.
- Obvious or frequent issues do not require an issue-comment. Add an ordinary comment only when it provides useful non-obvious context. For example, it is unnecessary to state near every unchecked arithmetic operation that it is assumed not to overflow. Such a comment or issue-comment can be appropriate when the absence of overflow is non-obvious because the operands may be large.

## Uncategorized

- Prefer using only ASCII chars. For example, instead of `—`, use `--`. But if the surrounding text intentionally uses non-ASCII chars, keep using them consistently.
- To reduce model usage, prefer not to poll running commands, such as tests, for progress when you can wait for them to complete. If a command runs substantially longer than expected, for example more than twice its usual duration, check whether it is still making progress.
