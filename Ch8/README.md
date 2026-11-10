# FRAIDY CATS — Cinematic Intro (Remotion)

1920×1080 · 30 fps · 1800 frames (60 s) · original generated audio.

## Render the MP4
```bash
npm install
npm run audio        # optional: regenerates public/audio/*.wav (needs python3 + numpy)
npm run dev          # preview in Remotion Studio (full intro + each scene as its own composition)
npm run render       # -> out/fraidy-cats-intro.mp4  (H.264, CRF 16)
npm run render:draft # half-res quick check
```
First run downloads Remotion's headless Chrome and the Cinzel/Caveat Google Fonts, so internet is needed once.
Single scene: `npx remotion render Scene6-Felix out/felix.mp4`.

## Layout
- `src/theme.ts` — colours, fonts, **scene timeline** (edit durations here)
- `src/scenes/Scene1…Scene8` — one component per scene
- `src/components/` — Atmos (fog, dust, grain, letterbox, captions), Scenery (pines, house), Cats, Radio
- `public/art/` — crops from your model sheet (Brock, Jamie Flowers)
- `public/audio/` — music, wind, bell, static, whispers, footsteps, door, creaks
- `scripts/generate_audio.py` — synthesises all audio

## Character art status
- **Brock, Jamie (Flowers)**: real art cropped from the supplied sheet.
- **Midnight, Felix, Whiskers**: not on the sheet, so `src/components/Cats.tsx` holds temporary original vector art. Replace `MidnightSitting`, `FelixStanding` and `PhotoCat` with final art; scenes won't need changes.
- Voices are on-screen captions (no TTS); whispers are synthesised breath textures.
