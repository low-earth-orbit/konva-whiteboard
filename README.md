# Konva Whiteboard

This is an work-in-progress hobby project aimed at creating a whiteboard app using Konva library.

Demo: [Try it here](https://low-earth-orbit.github.io/konva-whiteboard/)

Project management is handled through [Issues](https://github.com/low-earth-orbit/konva-whiteboard/issues), and discussions or suggestions can be made on the [Discussions](https://github.com/low-earth-orbit/konva-whiteboard/discussions) board.

## Tech Stack

- Framework: `Next.js 16` (App Router, static export)
- UI: `React 19` + `Mantine UI` + `Tailwind CSS v4`
- Canvas: `Konva.js` + `react-konva`
- State: `Redux Toolkit`
- Language: `TypeScript` (strict)
- Tests: `Vitest` + `React Testing Library` (unit/component), `Playwright` (e2e)

## Roadmap

Although there isn’t a strict timeline, the project is divided into three phases:

- Phase 1: Front-end only, focusing on basic drawing and canvas functionality.
- Phase 2: Introduce a backend and expand on front-end features.
- Phase 3: Collaboration such as sharing, live edit, and user management.

## Implemented Features

- Supported canvas objects
  - Freehand inking
  - Text fields
  - Shapes
    - Rectangle
    - Oval
    - Triangle
    - Star

- Edit objects
  - Drag & move, resize, rotate objects
  - Edit shape
    - Border width
    - Color
    - Fill
  - Edit text
    - Double click to edit content
    - Size
    - Style (bold, italic, underline)
    - Color
    - Alignment
    - Line spacing

- Canvas operations
  - Select object
  - Delete an object or clear the entire canvas
  - History (undo & redo)
  - Zoom control
  - Keyboard shortcuts for delete/undo/redo actions
  - Persistent canvas data stored in browser's local storage

## Develop

### Commands

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start dev server at http://localhost:3000 |
| `npm run build`        | Static export to `./out`                  |
| `npm run lint`         | ESLint (zero warnings)                    |
| `npm run typecheck`    | TypeScript check                          |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check                            |
| `npm test`             | Vitest unit + component tests             |
| `npm run test:e2e`     | Playwright e2e tests                      |

## Contributing & License

The project is licensed under [The MIT License](LICENSE). Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) for more information.
