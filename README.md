# BMW 2026｜30秒旅伴明信片 v3

最新下載：`bmw-travelers-postcards-30s-v3.mp4`，開啟後按 Download raw file。

- 30秒 / 1920×1080 / 30fps / H.264 MP4 / 無音訊軌
- 前24秒：16則全部輪流放大，每次並排2張，8組、每組約3秒
- 後6秒：最後明信片歸位、鏡頭拉遠並停留完整16卡牆面
- 沿用v2紅色愛心墨印與木柄印章短促按壓，不翻面
- quotes.json 保留16則全文、來源與原文摘錄；長留言放大時標示「留言原文摘錄」，牆面恢復全文
- 原網站來源：gh-pages / d6d4237063dece47b2bb567e62b9a388baea3f7a
- main與gh-pages未修改；此分支是獨立影片專案

24秒版本保留：`bmw-travelers-postcards-24s.mp4`（初版）、`bmw-travelers-postcards-24s-v2.mp4`（16則雙卡版）。

重製：Node >=22、FFmpeg、Chromium、Noto CJK TC字型。執行 `npm run check`，再以 `HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npm run render -- --fps 30 --quality high --workers 2 --output bmw-travelers-postcards-30s-v3.mp4` 輸出。

完整check通過：lint/runtime/layout零錯誤。對比246/247通過；一處背景卡「留言來源」在21.667秒被前景卡過渡遮擋時有對比警告，正常放大閱讀畫面已檢視。craft保留使用者指定無聲、快速閱讀節奏與縮小卡牆字體等警告。30秒不預期讀完所有長篇全文。
