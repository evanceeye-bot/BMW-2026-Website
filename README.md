# BMW 2026｜24秒旅伴明信片 v2

下載新版：`bmw-travelers-postcards-24s-v2.mp4`，開啟後按 Download raw file。

- 24秒 / 1920×1080 / 30fps / H.264 MP4 / 無音訊軌
- 16則全部輪流放大，每次並排2張，約2.4秒換組；比v1停頓短
- 小型紅色愛心墨印；木柄印章短促按壓、離開；拿掉心形框內的BMW/2026文字與放大彈跳
- 最後拉遠呈現全部16則完整原文與來源
- 長留言在放大時使用連續原文摘錄，畫面標示「留言原文摘錄」；最後牆面恢復全文
- quotes.json 記錄16則全文、摘錄及來源，沒有改寫引言
- 原網站來源：gh-pages / d6d4237063dece47b2bb567e62b9a388baea3f7a
- main與gh-pages未修改；此分支是獨立影片專案

舊版保留為 `bmw-travelers-postcards-24s.mp4`，便於比較。

重製：Node >=22、FFmpeg、Chromium、Noto CJK TC字型。執行 `npm run check`，再以 `HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npm run render -- --fps 30 --quality high --workers 2 --output bmw-travelers-postcards-24s-v2.mp4` 輸出。

v2完整check通過：lint/runtime/layout零錯誤、對比241/241通過。檢查保留使用者指定無聲、快速節奏閱讀時間、縮小卡牆字體等craft警告。24秒內不預期能讀完所有全文。
