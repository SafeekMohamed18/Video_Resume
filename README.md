# Mohamed Safeek | Motion Graphics Video Resume

This project is a web-based animated video resume built with HTML, CSS, and vanilla JavaScript.

## Structure

- `index.html` — main cinematic resume shell
- `css/style.css` — layout, color system, and motion graphics styling
- `css/animations.css` — scene-specific animation keyframes
- `js/scenes.js` — timeline and scene metadata
- `js/timeline.js` — playback engine
- `js/app.js` — UI binding and scene orchestration
- `assets/audio/background.mp3` — placeholder for royalty-free background music

## Play locally

Open the project in a browser using a local static server, for example:

```bash
py -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Audio

A placeholder audio file is included as a path expectation. Add a royalty-free background track at:

```text
assets/audio/background.mp3
```

## Presentation mode

The final experience includes a presentation mode that hides the UI controls and plays the video on full stage.

## Notes

- This project was designed for a 16:9, 1920x1080-friendly composition.
- If project assets are later added, they can be dropped into the relevant `assets/` folders and referenced with relative paths.
- The timeline engine is intentionally simple, readable, and easy for a student to customize.
