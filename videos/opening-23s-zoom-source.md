# 23秒開場引導 v2：新手札影片與登機證放大

下載：bmw-opening-23s-journal-zoom-v2.mp4，GitHub檔案頁右上角 Download raw file。

網站來源：gh-pages / 514426857bac3830521bda206d0f20db9878e166。
原影片輸入：使用者上傳 gemini_generated_video_3431525d.mp4，10秒1280×720、24fps。網站使用抽離音訊的版本 assets/videos/journey-notes-v3.mp4，保留完整16:9、更新封面、autoplay/muted/loop/playsinline。舊影片保留。

錄影由替換後網站重新產生，沒有在舊錄影上蓋素材。0–2.7秒首頁；2.7–5秒自然捲動至手札；5–7.1秒閱讀並播放新手札；7.1–9秒捲動至登機證；9–10.8秒平順放大1.0→1.3倍，登機證置中且整張保留；9秒釋放原版逐字動畫，至23秒前完整顯示。原版飛機游標以SVG錄入畫面。

錄影工作階段只延後ticket的IntersectionObserver、驅動捲動/游標、靜音網站音樂並同步媒體時間。登機證文字與逐字動畫程式未改寫；Math.random以固定seed重現原有延遲範圍。網站本身不含錄影覆寫。最新版網站其他內容保持不變。

驗證：網站桌機1920×1080／手機390×844影片自動播放、靜音、循環、16:9與無橫向溢出；電影23.000秒、1920×1080、30fps、690影格、無音訊軌。完整解碼通過，12個成品關鍵影格已檢視，打字完成且與來源文字一致。

重製：以指定網站commit啟動本機8090伺服器，安裝Python Playwright與Chromium、FFmpeg。執行 opening-23s-zoom-project/capture.py 再執行 render.py。會產生690張JPG後編碼；未將中間影格提交到Git。

gh-pages程式已更新；外部網站託管平台的部署完成狀態未在本次確認。此影片分支保存下載成品，舊版42秒及23秒保留。
