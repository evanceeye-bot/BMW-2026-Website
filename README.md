# 旅伴來信｜18 秒無聲明信片動畫示範

- Source website commit: `d6d4237063dece47b2bb567e62b9a388baea3f7a`
- Output: 1920×1080, 30 fps, 18 seconds, H.264 MP4; no audio stream.
- This is a separate video project. Original website files and its publishing branches are not modified.
- Features three complete source quotations (one course review, 客服一處, 客服二處), not all 16 reviews. `source-quotes.json` preserves all 16 and identifies the three selected quotations.

## 動畫節奏

- 0–2.65 秒：標題、旅行照片明信片進場並翻到留言面。
- 2.65–6.5 秒：完整課程留言、郵戳落下，保留閱讀停頓。
- 6.5–10.9 秒：第二張翻面，呈現客服一處原文，蓋章後疊放。
- 10.9–15 秒：第三張翻面，呈現客服二處原文，蓋章後收疊。
- 15–18 秒：鏡頭拉遠，三張明信片展開成旅行紀念收藏。

## Render

Use Node >=22, Chromium and FFmpeg. Run `npm run check` then `npm run render -- --fps 30 --workers 2 --quality standard --output postcard-demo.mp4`.

The GSAP library, selected source photos, and subset fonts are local. No remote assets or audio are needed during rendering. Font licenses are in `assets/`.

## Validation notes

Layout overlap and occlusion are explicitly marked on the physical cards and on quotation elements: after its full-size reading hold, a card intentionally slips beneath the next card. The final pullback intentionally reduces the card text to a collection overview; all three quotes were readable at full size earlier. A silent-film craft warning is expected because the user explicitly requested no sound. These are reviewed design choices, not disabled checks on the readable hero frames.
