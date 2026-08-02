# Personal Site

A personal portfolio and writing archive. The portfolio introduces the author, their career, and their work; the writing archive publishes prose about technical topics. The two are deliberately styled differently — see [ADR-0003](./docs/adr/0003-two-visual-registers.md).

## Language

### Zones

**Portfolio**:
The part of the site about the author — Home and Projects. Playful in register.
_Avoid_: Landing page, CV, Résumé

**Writing**:
The part of the site containing published Posts, served under `/blog`. Austere in register.
_Avoid_: Blog (as a section name in code), Articles

### Writing

**Post**:
A single published piece of writing, authored as plain markdown. The only content type in the Writing zone.
_Avoid_: Article, Essay, Entry, Blog

**Featured**:
A Post the author has marked as headline work, so it can be surfaced above ordinary Posts. A property of a Post, not a separate kind.
_Avoid_: Pinned, Highlighted

**Tag**:
A free-form label on a Post used to group related writing. A Post may carry several.
_Avoid_: Category, Topic, Label

**Draft**:
A Post marked `draft: true`. It lives on `main` alongside published work and is visible when running the site locally, but is excluded from the production build. Publishing is a one-word change.
_Avoid_: Unpublished, WIP, Private, Unlisted

**Publish**:
The moment a commit touching content lands on `main`. There is no separate publishing action, dashboard, or button.
_Avoid_: Deploy, Release, Ship

### Portfolio

**Project**:
A piece of work the author built and wants to show, presented in its own showcase separate from Posts. A Project may link to a Post that explains it, but is not one.
_Avoid_: Work, Portfolio item, Case study

**Experience**:
A single position the author has held, placed on a chronological timeline. The timeline as a whole is the career; one entry is an Experience.
_Avoid_: Job, Role, Position, Employment

**Tech Card**:
One technology the author knows, presented as a stylised trading card with a portrait, a type, stats, and a flavour line. The card format is an original stylisation, not a reproduction of any existing card game's trade dress.
_Avoid_: Skill, Pokémon card, Badge, Chip
