# BMW 開場引導｜23秒

下載：bmw-opening-to-boarding-23s.mp4（GitHub檔案頁右上角 Download raw file）。

由既有42秒原片 videos/bmw-latest-silent-walkthrough.mp4 重新分段調速，非重設網站。來源影片分支 commit：d624ea20425a12fde0d5d2fea4734d64afb2567d；來源網站 gh-pages commit：d6d4237063dece47b2bb567e62b9a388baea3f7a。

範圍：置頂主視覺 → 經過原版手札區 → 登機證資訊完整顯示。保留原片的飛機游標、捲動軌跡、手札影片與逐字動畫；僅調整時間。沒有操作六站故事。原片視窗下緣可看見下一區標題與卡片上緣，沒有新增、裁切或改寫網站畫面。

時間表見 timing-23s.json；原片0–4秒→3秒，4–9→2.5秒，9–18→3秒，18–23→2.5秒，23–34→10秒，34–42→2秒。相鄰來源連續拼接、無跳轉或重新設計。

輸出：23.000秒，1920×1080，30fps，690影格，H.264，無音訊軌。已完整解碼與檢視12個關鍵影格，確認23秒前登機資訊完成顯示。

原42秒影片保留。main與gh-pages未修改。

重製：在 render-23s.py 同目錄放置原片並命名 original-42s.mp4，使用 Python3 與 FFmpeg 執行 `python3 render-23s.py`。
