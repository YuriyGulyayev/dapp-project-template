### Numbered Annotations

#### Introduction

We use specially marked comments in the code. This document lists their types and explains their purpose.

We collectively refer to **numbered comments** and **numbered todos**, whether **human** or **AI**, as **numbered annotations**. There are also **non-numbered todos**, which are **non-numbered annotations**.

Ordinary comments without numbered-comment tags or todo markers are not annotations.

#### Numbered Comments

Here is an example of a **defining occurrence** of a **numbered comment**:

```ts
// [Comment-202608222]
// My comment explaining stuff.
// [/Comment-202608222]
```

This notation resembles an XML element. It consists of paired opening and closing tags and text between them. In this example, `Comment-202608222` is the numbered comment tag, and `202608222` is its ID.

A numbered comment with no text can be formatted as a self-closing tag, for example:

```ts
// [Comment-202512307/]
```

Each numbered comment has exactly one XML-element-like defining occurrence. All other occurrences of the numbered comment's tag are references.

A numbered comment tag can link related locations in source code and other text files and can avoid duplicating the same comment text. To link related locations, use the same numbered comment tag at each location. To find all linked locations, globally search for that tag or just its ID.

#### Frequently Used Phrases

The following are examples of numbered comment references.

```ts
// Comment-202608222 applies.
```

It means a copy of the same numbered comment. In other words, the same numbered comment is inherited at the given location.

```ts
// Comment-202608222 relates.
```

It means that the given comment is in some way relevant at the given location. Use this form only when the relationship is clear. If it is not, write a more descriptive comment mentioning the numbered one.

```ts
// Comment-202608222 relates and/or applies.
```

It means that the given comment applies in part and relates in another part.

#### Numbered ToDos

The same defining-occurrence and reference rules apply to **numbered todos**. For example:

```ts
// [ToDo-202512308-1]
// Do this and that.
// [/ToDo-202512308-1]

// ToDo-202512308-1 applies.

// ToDo-202512308-1 relates.

// ToDo-202512308-1 relates and/or applies.
```

Numbered todos rarely use a self-closing form, because a typical todo must state what is to be done.

```ts
// [ToDo-202608233-1/]
```

#### ToDo Priorities and Statuses

The hyphen-separated suffix, `1` in the above example, specifies the todo's priority and/or status. This suffix is separate from the ID.

We use the following suffixes:

- `0`: to do immediately.
- `1`: to do soon, before the next release.
- `2`: to do later, possibly after the next release.
- `3`: to do someday, low priority.
- `4`: rarely used for a not-any-time-soon todo, such as doing something about a timestamp overflow in 100 years.
- `10` through `14`: these correspond to priorities `0` through `4`, but apply to commented-out code or outdated documentation that would need attention if restored.
- `0?` through `4?`; `10?` through `14?`: the proposed idea needs reconsideration.
- `0-` through `4-`; `10-` through `14-`: do not do.
- `+` (without digits): done.

Note that a typical todo is to be deleted when done. But sometimes I can decide to retain one with the `+` suffix.

#### Non-Numbered ToDos

We use the same suffixes for **non-numbered todos** as well, for example:

```ts
// ToDo-0 Do this and that ASAP.
// ToDo-2? Reconsider whether this change is necessary.
// ToDo-3- This was a bad idea. Don't propose it again.
// ToDo-+ Don't forget that this task has been completed.
```

#### AI ToDos

The `ToDo` forms above are **human todos**. For **AI todos**, replace `ToDo` with `ToDo-AI`. For example:

```ts
// [ToDo-AI-202608224-1]
// Do this and that.
// [/ToDo-AI-202608224-1]

// [ToDo-AI-202608275-1/]

// ToDo-AI-202608224-1 applies.

// ToDo-AI-202608224-1 relates.

// ToDo-AI-202608224-1 relates and/or applies.

// ToDo-AI-0 Do this and that ASAP.
```

#### Generating an ID

See `../shared/project-state/docs/generating-id-number.md`.

#### Using IDs

Generate a new ID for a new numbered annotation or another purpose requiring an identifier. Reuse an existing ID only for the same logical annotation or purpose, including its references.

#### Instructions

- Before making any change covered by these instructions, build the planned change set. Starting with the requested changes, repeatedly apply these instructions to the projected state and add each consequential change once until no new consequence appears.

- Ask all currently determinable permission and choice questions before applying the planned change set. If an answer changes the projected state, re-evaluate the planned change set. Modify files only after all required questions have been resolved, then apply the approved changes in one batch.

- Before changing any part of a numbered annotation's tag, deleting its defining occurrence, or deleting only its defining tag or tags, ask for permission if the annotation's text states that it is referenced outside the workspace.

- If the projected change modifies any part of a numbered annotation's tag, update every occurrence of that tag.

- If the projected change would delete a numbered annotation's defining occurrence or only its defining tag or tags while leaving any references, include deletion of all those references in the planned change set, but first ask for permission.

- If the projected change would delete all references to a numbered annotation while its defining occurrence would otherwise remain, ask for permission to convert the numbered annotation to its non-numbered form by deleting its defining tag or tags, retaining any text between paired tags. When converting a numbered todo to a non-numbered todo, preserve its human-or-AI designation and suffix.

- When planning to delete one or more files:
  - For each numbered annotation whose defining occurrence is in a file to be deleted, if one or more references in files to be retained use the exact `applies` form, ask for permission to swap the defining occurrence with one such reference. For purposes of the projected state, swapping means that the selected retained location becomes the defining occurrence and the old defining location becomes an `applies` reference. If multiple eligible references exist, ask me which one to use.
  - After incorporating any approved swaps into the projected state, treat every numbered-annotation defining occurrence and reference in a file to be deleted as planned for deletion, and apply all other instructions to those planned deletions.

#### Notes

- The keywords `Comment`, `ToDo`, and `ToDo-AI` in the forms described in this document are case-insensitive.

- Most annotations are located in source code files, but some can be located in files of other types, such as `.md` or `.txt`. In file formats that support comments, use the appropriate comment syntax. For example:

```md
<!--
[ToDo-AI-202608225-2]
Do this and that.
[/ToDo-AI-202608225-2]
-->

<!-- ToDo-AI-202608225-2 applies. -->

<!-- ToDo-AI-202608225-2 relates. -->

<!-- ToDo-AI-202608225-2 relates and/or applies. -->

<!-- ToDo-AI-3 Do this and that. -->
```

- In a file like an `.md` document, it's also OK to write an annotation in text, not as a comment.
