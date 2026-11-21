# Twin Peeks — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures sit side by side. They look the same — but a few small things changed on the right. Click every difference before time runs out.

A complete, original spot-the-difference game in three hand-drawn scenes:

- **Sunny Garden** — 7 differences, 2:30 on the clock
- **Harbor at Dusk** — 8 differences, 3:00 on the clock
- **Cozy Kitchen** — 9 differences, 3:30 on the clock

Found differences get a green ring and a check on both pictures. A wrong click costs 5 seconds. Hints (3 per level) pulse a ring around one difference you have not found yet, for 25 points. The counter in the header always shows how many remain.

## Play it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — the game is plain static files under `game/`, all art drawn in code.

Mouse or keyboard: arrow keys (or WASD) move the crosshair, Enter clicks, H hints, M toggles sound, R restarts, Esc goes back to the title screen.

## How it is built

- `game/src/scenes.js` — the three scenes, each painted in code with its differences
- `game/src/world.js` — levels, timer, scoring, hints
- `game/src/render.js` — header, panels, markers, title / complete / win screens
- `game/src/input.js` — mouse and keyboard
- `game/src/sound.js` — synthesized WebAudio bleeps, no audio files
- `game/src/shots.js` — deterministic `?shot=` scenes for the screenshots
- `main.ts` — the make.fun hand-in program (Node 22, standard library only)

## Screenshots

The four screenshots in `screenshots/` are real renders of the game in a browser, taken with `?shot=start|play|play2|end`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=cx95kx62&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
