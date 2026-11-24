from pathlib import Path
import subprocess
p=Path(__file__).resolve().parent
frames=list((p/'frames').glob('*.jpg'));assert len(frames)==690,len(frames)
z="if(lte(on,270),1,if(gte(on,324),1.3,1+0.3*pow((on-270)/54,2)*(3-2*(on-270)/54)))"
f=f"scale=3840:2160,zoompan=z='{z}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=30,format=yuv420p"
subprocess.run(['ffmpeg','-v','warning','-y','-framerate','30','-i',str(p/'frames/%04d.jpg'),'-vf',f,'-frames:v','690','-c:v','libx264','-preset','slow','-crf','17','-an','-movflags','+faststart',str(p/'bmw-opening-23s-journal-zoom-v2.mp4')],check=True)
print('Rendered 23s, smooth 1.0–1.3 zoom from 9.0–10.8s, no audio',flush=True)
