# Konva Whiteboard

This is an work-in-progress hobby project aimed at creating a whiteboard app using Konva library.

Demo: [Try it here](https://whiteboard.leohong.dev)

Project management is handled through [Issues](https://github.com/low-earth-orbit/konva-whiteboard/issues), and discussions or suggestions can be made on the [Discussions](https://github.com/low-earth-orbit/konva-whiteboard/discussions) board.

## Tech Stack

- Front-end: `React`, `Redux`, `Next.js`, `Konva.js`,`Material UI`
- Programming language: `TypeScript`

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

### Run

To run the development server locally:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to access the app.

## Contributing & License

The project is licensed under [The MIT License](LICENSE). Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) for more information.
