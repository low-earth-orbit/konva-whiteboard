# Konva Whiteboard

This is a hobby project I’m working on while employed full-time as a developer. I code when I have some free time and feel like building something. The goal is to create a sketch board app, similar to [Microsoft Whiteboard](https://www.microsoft.com/en-ca/microsoft-365/microsoft-whiteboard/digital-whiteboard-app), or a graphic design tool like [Polotno](https://studio.polotno.com/). Currently, this project is a solo effort.

Demo: [Try it here](https://whiteboard.leohong.dev)

Contributions and collaborations are welcomed, though there isn’t a strict timeline for the project. The project is divided into three phases:

- Phase 1: Front-end only, focusing on basic drawing and canvas functionality.
- Phase 2: Introduce a backend and expand on front-end features.
- Phase 3: Advanced features such as sharing, live edit, and user management.

Project management will be done through [Issues](https://github.com/low-earth-orbit/konva-whiteboard/issues), and discussions or suggestions can be made on the [Discussions](https://github.com/low-earth-orbit/konva-whiteboard/discussions) board.

## Tech Stack

- Front-end: `React`, `Redux`, `Next.js`, `Konva.js`,`Material UI`
- Programming language: `TypeScript`

## Implemented Features

- Canvas objects

  - Pen & eraser
  - Text fields
  - Shapes
    - Rectangle
    - Oval
  - Adjustable shape borders (width & color)

- Canvas
  - History (undo & redo)
  - Delete item or clear the entire canvas
  - Keyboard shortcuts for delete/undo/redo actions
  - Persistent canvas data stored in browser's local storage

## Develop

### Run

To run the development server locally:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to access the app.
