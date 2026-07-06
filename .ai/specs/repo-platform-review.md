Here is a short list of things I want checked. It is not comprehensive, I expect more findings to emerge that I am not considering or have not yet discovered and outlined.

Repo wide:

- repo file and folder anti-patterns
- barrel files (sometimes they can be helpful, other times, they are useless and cause churn.)
- actual code issues that could have and should have been caught with stricter linting, typechecking, validation, tests, and more
- splitting files vs not splitting files (figure out what kinds of files should actually be exempt from total line count checks (but still checked to prevent rouge code from slipping in) vs which should be stricter)
- are there any patterns that should be extracted into wrapper components to help with duplicating logic
- are there any repo wide silent bugs or issues that cannot be realized simply by looking at one particular file but instead are patterns that propagate across multiple files like boilerplate that should be utilities or functions that are rewritten multiple times that should be helpers or hooks, even higher order functions, currying, etc
- Identify multi-file structural duplication (WET patterns) and replace them with abstract, reusable mechanisms using the following specific architectural techniques:

  1. Rule of Three Violations: Scan for identical or near-identical business logic repeated across 3 or more separate files.
  2. Data-Driven Refactoring: Convert variations of similar procedural functions into a single "Execution Engine" that interprets a declarative, parameter-driven configuration schema.
  3. Structural Overlap: Isolate boilerplate setups (e.g., matching API handshakes, data formatting pipelines, or state configurations) into Higher-Order Functions (HOFs), Custom Hooks, or Curried Functions.
  4. Cross-File Cross-Cutting Concerns: Unify repeating infrastructure logic (e.g., logging, error handling boundaries, validation steps) using the Interceptor or Middleware Pattern.

- Deliverable requirements:
  - Do not create a single "God Function" with endless internal if/else flags.
  - Separate Mechanism from Policy: Define atomic, pure utility functions ("the mechanism") and separate complex configuration input objects ("the policy").
  - Provide a strict TypeScript/Zod schema definition for the new configuration object to ensure deterministic type safety.

Specific to typescript (need to add more validation to repo including but not limited to):

- make sure we are checking that typescript compiles (i think we are but it would be good to confirm)
- `as` casts
- typescript anti-patterns

Specific to React:

- React anti-patterns
- poor state management (not using context and prop drilling, or too many renders due to sneaky bugs that would cause re-renders, too many boolean states when a more complex state management tool would be more helpful?)

Design Library:

- atomic design library is robust to use in production (one day i may want to extract it to its own package to use in other repos of mine)
- default for all new users should be set to High Contrast on first page load (but all users can change the preset and or any of the parameters and on refresh, those parameters should persist in their session via localstorage)
- is Warm tones detected --btn-gradient-end still used and or needed? does it work as expected?
- why do we have four colors (Default (anchors), Hover, Active, Primary link) for the Links? seems like something is wrong in the design library for Link — all combinations (style × color) - i do not see the correct colors being used, which signals to me that something is wrong with how the tokens are wired into the components for the whole app but also also possibly just the design library page. feels like a bigger issue though.
- theme colors for presets showcase all selected colors (i see Design Tokens > Colors shows more and different colors than what shows up in the preset theme selector. not good)
- I think the accordions auto close the open section if a different section opens. that doesnt seem to be correct to me. perhaps there needs to be a prop (autoClose (or some other more valuable name): boolean, defaultOpen: SomeType[]) that allows me to use accordions with autoclose on new open enabled or not, and also pass in a list of pre opened or closed accordion sections (by default with no props, all accordion sections should be closed and the auto close on new open prop should be default set to true)
- are the sections for atoms, molecules, etc accurate? are they missing any components?
- are the config settings for the design library organized in a way that makes sense?
- are there redundancies in the design library tokens that could be optimized?
- are all tokens represented in the design library for controls and to view the changes live in the settings?
- are there custom styles anywhere in the repo (className, scss, style={{}}, custom style being set using anything other than a computed token (because from all pages, users will have the ability to play with the styles live, so we need to use the variables) etc. ) that are not represented in the design library? (this would be a red flag for me)
- are there any hard coded styles that should actually be controlled in the design system controls for the entire site? what are the hard coded styles that should not have controls? why?

General Coding principles:

- function and variable naming and anti-patterns (function that is a wrapper for no reason, variable that renames another variable, etc)
- overly verbose comments where simple naming skills would suffice (no reason to over explain code with jsdoc or long comments when its perfectly readable without any comments)
- poor testing coverage

Build and Deploy (cloud layer):

- build functions work
- deployment to firebase includes other checks that agents should always do, such as the npm check and npm build
- what is the default design for when we deploy
- can we deploy today after everything gets fixed?

Nits and personal preferences:

- no "—" (em dash or en dash) in production copy

context engineering:

- agent files and documentation are clean and follow proper pointers to progressive disclosure files to avoid drift and repetition. (we have tooling to prevent overloading context, confirm this isn't being circumvented somehow and that the docs truly are drift proof and are up to date)
- md file audit. are we being too verbose? are there more safeguards we could put in place to prevent slop, drift, and churn? what about code in .md files instead of referencing valuable real code files? are we too rigid with some rules for file count and line count? what should we consider loosening up on?
- is this file /Users/ianrios/Sites/ianrios.github.io/.claude/settings.json up to date with relevant real settings we should be using to allow agents to move quickly and iterate without waiting on human operator intervention? can agents learn to use /update-config and /fewer-permission-prompts when deemed useful?
- are any documentation files out of date or include prose details that should actually be documented as pointer references to code files like package.json, vite.config.ts, tsconfig.json, etc?
- are we following a "less is more" best practice while keeping critical true details up front in context? in my human opinion, any text that is written is not worth writing if it could be summarized. if so, then the summary is what should have been written. keeping this in mind, there are always valuable things to mention, but understanding what is valuable is the true skill, and agents should understand to write everything in such a lean and clean way that it could not be summarized without losing critical details. the bare minimum to keep context actually useful is what is important here.
- For all coding tasks use your judgement to decide an appropriate lower power model and run that in a subagent
- leverage claude repo memories
- leverage claude context files
- leverage custom skills scoped to custom agents (not all skills should auto ingest for each general agent)
