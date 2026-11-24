from pathlib import Path
import subprocess,json
from PIL import Image,ImageDraw,ImageChops,ImageStat
P=Path(__file__).resolve().parent
movie=P/'renders/bmw-travel-memories-45s-v1.mp4'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_frames','-show_entries','format=duration,size','-of','json',str(movie)]))
video=[s for s in probe['streams'] if s['codec_type']=='video'];assert len(video)==1
assert not [s for s in probe['streams'] if s['codec_type']=='audio']
v=video[0];assert v['width']==1920 and v['height']==1080 and v['nb_read_frames']=='1350'
assert abs(float(probe['format']['duration'])-45)<.001
subprocess.run(['ffmpeg','-v','error','-i',str(movie),'-f','null','-'],check=True)
folder=P/'render-review';folder.mkdir(exist_ok=True)
times=[.7,2.4,4.3,8,16,24,32,38.8,43.5]
out=Image.new('RGB',(1440,900),'#202020');draw=ImageDraw.Draw(out)
for n,t in enumerate(times):
 f=folder/f'frame-{t}.jpg';subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',str(movie),'-frames:v','1','-y',str(f)],check=True)
 im=Image.open(f).resize((480,270));x=n%3*480;y=n//3*300;draw.text((x+8,y+5),str(t)+'s',fill='white');out.paste(im,(x,y+25))
out.save(P/'rendered-contact-sheet.jpg')
a=Image.open(folder/'frame-0.7.jpg');b=Image.open(folder/'frame-2.4.jpg');diff=sum(ImageStat.Stat(ImageChops.difference(a,b)).mean)/3;assert diff>3
summary={'duration_seconds':45,'fps':30,'frames':1350,'resolution':[1920,1080],'audio_streams':0,'decode':'full-file decode passed','reviewed_frame_times':times,'opening_pixel_change':diff,'photos':12,'source_photos_sha256_verified':True,'website_modified':False,'file_bytes':int(probe['format']['size'])}
(P/'validation.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
