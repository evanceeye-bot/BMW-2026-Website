# 23秒引導片 v3｜修正手札停格

最新下載：bmw-opening-23s-journal-zoom-v3.mp4。

v2錄影在虛擬時鐘下逐格seek原生video時，影片畫面沒有等待解碼完成，結果錄入首幀。先前僅檢查video.currentTime、元素狀態及載入路徑不足，未驗證成品手札像素變化。v2已標示失效，請使用此版。

修正：從新手札影片抽取全部240個原生24fps影格；錄影工作階段以相應影格顯示在原影片區，等待圖片解碼完成再截圖。原網站程式不變。影片顯示時間對應 max(0, t-2.7) mod 10，維持原速，無凍結。

網站來源仍為gh-pages / 514426857bac3830521bda206d0f20db9878e166。本次僅修正引導片，沒有再更動網站。網站本機測試已改為桌機/手機連續擷取三次畫面，驗證畫面hash各異、decoded frame count增加及非paused。

輸出23.000秒、1920×1080、30fps、690影格、無音訊軌。保留原飛機游標、9–10.8秒平順放大到1.3倍，完整登機證與原版逐字效果。最終打字文字與來源完全一致。

成品檢查：完整FFmpeg解碼通過。檢視12個MP4影格；5秒與6.667秒固定手札區塊的平均像素差44.17，大於5的停格判斷門檻，且可見不同頁面（GROWTH & TRAINING NOTES / HAPPY MOMENTS & TEAM MEMORIES）。不是只驗證來源影片本身。

重製：使用此網站版本在8090啟動伺服器；在專案目錄用 `ffmpeg -i <網站assets/videos/journey-notes-v3.mp4> -q:v 2 -start_number 0 media-frames/%03d.jpg` 解出240張影格，並於8091提供此專案目錄。執行capture.py後執行render.py。需要Python Playwright、Chromium、FFmpeg。中間影格未提交Git。
