# BMW 2026｜有些精彩，值得留到最後。· 8秒短版 v2

最新下載 `bmw-last-letter-8s-v2.mp4`，在GitHub檔案頁右上角點 Download raw file。

8秒、1920×1080、30fps、H.264 MP4、完全無音訊軌。紙飛機從封蠟刻紋浮起、沿曲線飛出，信封封口隨勢翻開，信紙從前片背後抽出、置中放大，最後留出原文閱讀時間；紙機停在信紙右上角。

信封前片、蓋片與封蠟飛機刻紋取自網站原SVG。配色沿用原區塊。信紙主標與正文沿用網站原文，沒有另外編造信件內容。來源 commit：514426857bac3830521bda206d0f20db9878e166 / index.html #next / assets/last-page.css。本影片是獨立專案，沒有修改網站。

詳細設計與時間表見 DESIGN.md、SCRIPT.md、STORYBOARD.md。封蠟紙飛機以原刻紋造型立體化為紙飛機插畫；不是整塊封蠟飛走。

## 重製

Node >=22、FFmpeg、Chromium、Noto CJK TC字型。GSAP與MotionPathPlugin在assets本機保存，無即時網路依賴。

`npm run check`

`HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npm run render -- --output renders/bmw-last-letter-8s-v2.mp4 --fps 30 --quality high --workers 2`

`npx hyperframes@0.8.214 preview --background`

檢查：lint/runtime/layout零錯誤，對比20/20通過。刻意保留無聲及開場短暫淡入的craft提示。已檢視封蠟、紙機飛行、開蓋、抽紙與信紙閱讀的關鍵影格。

成品驗證：15.000秒、450影格、無音訊軌，完整FFmpeg解碼通過。已從輸出的MP4檢視9個時間點，確認紙機飛行、封蓋翻開、信紙抽出與原文呈現；見 rendered-contact-sheet.jpg、validation.json。

## 8秒短版
原15秒版依8/15時間比例壓縮至8秒（FFmpeg setpts + fps30），保留全段動作；信紙完整呈現後約2.1秒收尾。可編輯時間軸以子時間軸timeScale 15/8重現。原15秒MP4與其validation.json、rendered-contact-sheet.jpg保留，8秒版驗證另見 validation-8s.json。
