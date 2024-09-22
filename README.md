# Konva Whiteboard

This is an work-in-progress hobby project aimed at creating a sketch board app, similar to [Microsoft Whiteboard](https://www.microsoft.com/en-ca/microsoft-365/microsoft-whiteboard/digital-whiteboard-app), or a graphic design tool like [Polotno](https://studio.polotno.com/).

Demo: [Try it here](https://whiteboard.leohong.dev)

Project management is handled through [Issues](https://github.com/low-earth-orbit/konva-whiteboard/issues), and discussions or suggestions can be made on the [Discussions](https://github.com/low-earth-orbit/konva-whiteboard/discussions) board.

## Tech Stack

- Front-end: `React`, `Redux`, `Next.js`, `Konva.js`,`Material UI`
- Programming language: `TypeScript`

## Roadmap

Although there isn’t a strict timeline, the project is divided into three phases:

- Phase 1: Front-end only, focusing on basic drawing and canvas functionality.
- Phase 2: Introduce a backend and expand on front-end features.
- Phase 3: Advanced features such as sharing, live edit, and user management.

## Implemented Features

- Canvas objects

  - Draw
  - Text fields
  - Shapes
    - Rectangle
    - Oval
    - Triangle
    - Star
  - Adjustable shape borders (width & color)

- Canvas
  - Select object
  - History (undo & redo)
  - Delete an object or clear the entire canvas
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
