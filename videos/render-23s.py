from pathlib import Path
import subprocess,json
p=Path(__file__).resolve().parent
segments=[(0,4,3),(4,9,2.5),(9,18,3),(18,23,2.5),(23,34,10),(34,42,2)]
filters=[]
for i,(a,b,d)in enumerate(segments):
 filters.append(f'[0:v]trim=start={a}:end={b},setpts=(PTS-STARTPTS)*{d/(b-a):.12f},fps=30,trim=duration={d},setpts=PTS-STARTPTS[v{i}]')
filters.append(''.join(f'[v{i}]'for i in range(len(segments)))+'concat=n=6:v=1:a=0,format=yuv420p[out]')
cmd=['ffmpeg','-y','-v','warning','-i',str(p/'original-42s.mp4'),'-filter_complex',';'.join(filters),'-map','[out]','-an','-c:v','libx264','-preset','slow','-crf','17','-r','30','-t','23','-movflags','+faststart',str(p/'bmw-opening-to-boarding-23s.mp4')]
(p/'timing-23s.json').write_text(json.dumps({'source_commit':'d6d4237063dece47b2bb567e62b9a388baea3f7a','source_video_branch_commit':'d624ea20425a12fde0d5d2fea4734d64afb2567d','source_video_path':'videos/bmw-latest-silent-walkthrough.mp4','source_duration':42,'output_duration':23,'segments':[{'source_start':a,'source_end':b,'output_duration':d}for a,b,d in segments],'audio':False,'website_modified':False},indent=2))
subprocess.run(cmd,check=True)
