# BMW 2026｜旅行回憶箱 · 45秒示範 v1

下載 `bmw-travel-memories-45s-v1.mp4`，在GitHub檔案頁點 Download raw file。

這是獨立影片專案，不修改網站。以旅行箱、照片展開、四站連續鏡頭、旅程全貌與團隊合照收尾呈現「走過的風景，都是我們的里程。」

來源網站：gh-pages commit `514426857bac3830521bda206d0f20db9878e166`。素材讀取自 `assets/memories.json` 的48張真實照片，選12張示範；選用原檔與活動caption記錄於 source-photos.json。沒有使用AI生成的人物、替換人物或虛構活動地點日期。影片分類為好食光、節慶同樂、我們在一起、員工座談會。旅行路線是概念編排，不是實際城市路線。ESG與訓練課程沒有來源照片，未納入。

影片為1920×1080、30fps、45秒、H.264 MP4、無音訊軌。照片用contain保留整張比例。沒有旁白、音樂、音效。

## 節奏

- 0–5秒：旅行箱掀開、照片展開。
- 5–13秒：好食光。
- 13–21秒：節慶同樂。
- 21–29秒：我們在一起。
- 29–37秒：員工座談會。
- 37–41秒：十二張照片構成旅程全貌。
- 41–45秒：團隊合照向前，出現下一段旅程的收尾文案。

所有轉場在同一世界平面上以鏡頭移動完成，沒有硬切。更多設計與逐段方向見 DESIGN.md、SCRIPT.md、STORYBOARD.md。

## 重製

需要Node >=22、FFmpeg、Chromium、Noto CJK TC字型。GSAP已保存於assets，照片亦為本機素材。

`npm run check`

`HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npm run render -- --output renders/bmw-travel-memories-45s-v1.mp4 --fps 30 --quality high --workers 2`

`npx hyperframes@0.8.214 preview --background`

檢查：lint/runtime/layout零錯誤、對比47/47通過。已檢視開箱、四站、全貌、收尾影格。保留使用者指定無聲、短暫開場文案閱讀時間及全貌縮小字體等craft提示；全貌用於看見旅程，不預期閱讀每個小字。
