# BMW 2026｜24秒旅伴明信片

直接開啟 `bmw-travelers-postcards-24s.mp4`，按 Download raw file 即可下載。

- 24秒 / 1920×1080 / 30fps / H.264 MP4 / 無音訊軌
- 6則重點留言：滑入、愛心形郵戳、移向牆面；沒有翻面
- 最後拉遠呈現全部16則原文與來源
- 原網站 gh-pages 指定來源：d6d4237063dece47b2bb567e62b9a388baea3f7a
- 不修改 main 或 gh-pages；此分支是獨立影片專案
- quotes.json 保留16則全文、來源與重點摘錄紀錄
- 最後明信片牆是全貌，長留言無法在24秒內全部讀完

重製：安裝 Node >=22、FFmpeg、Chromium 與 Noto CJK TC 字型後，執行 `npm run check`，再執行 `HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npm run render -- --fps 30 --quality high --workers 2 --output bmw-travelers-postcards-24s.mp4`。

已完成完整解碼檢查；lint/runtime/layout零錯誤，對比159/159通過。保留使用者指定無聲、閱讀時間與縮小字體的craft警告。
