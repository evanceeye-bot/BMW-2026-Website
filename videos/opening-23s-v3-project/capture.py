from pathlib import Path
import json,math
from datetime import datetime,timezone,timedelta
from playwright.sync_api import sync_playwright
P=Path(__file__).resolve().parent;(P/'frames').mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 # Test the website itself at desktop and mobile widths, without capture overrides.
 tests=[]
 for width,height in [(1920,1080),(390,844)]:
  page=b.new_page(viewport={'width':width,'height':height})
  page.route('https://**/*',lambda route:route.abort())
  page.goto('http://127.0.0.1:8090',wait_until='load')
  page.locator('#journeyNotesVideo').scroll_into_view_if_needed();page.wait_for_timeout(900)
  result=page.locator('#journeyNotesVideo').evaluate('v=>({src:v.currentSrc,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,autoplay:v.autoplay,paused:v.paused,time:v.currentTime,renderWidth:v.getBoundingClientRect().width,renderHeight:v.getBoundingClientRect().height,error:v.error?.message})')
  assert result['src'].endswith('journey-notes-v3.mp4') and result['width']==1280 and result['height']==720,result
  assert result['muted'] and result['loop'] and result['autoplay'] and not result['paused'] and result['time']>0,result
  assert abs(result['renderWidth']/result['renderHeight']-16/9)<.01,result
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
  page.screenshot(path=str(P/f'website-{width}.png'))
  samples=[]
  import hashlib
  for sample in range(3):
   page.wait_for_timeout(1800)
   data=page.locator('#journeyNotesVideo').screenshot()
   shot=P/f'website-motion-{width}-{sample}.png';shot.write_bytes(data)
   state=page.locator('#journeyNotesVideo').evaluate('v=>({time:v.currentTime,decoded:v.getVideoPlaybackQuality().totalVideoFrames,paused:v.paused})')
   samples.append({'sha256':hashlib.sha256(data).hexdigest(),**state})
  assert len({sample['sha256'] for sample in samples})==3,samples
  assert samples[-1]['decoded']>samples[0]['decoded'],samples
  tests.append({'viewport':[width,height],'result':result,'motion_samples':samples});page.close()
 (P/'website-validation.json').write_text(json.dumps(tests,indent=2))
 print('Website passed desktop/mobile REAL frame changes and increasing decoded frame counts',flush=True)
 context=b.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1)
 page=context.new_page();page.route('https://**/*',lambda route:route.abort())
 page.add_init_script('''(()=>{const Native=window.IntersectionObserver;window.IntersectionObserver=class extends Native{constructor(cb,o){super(cb,o);this.cb=cb}observe(el){if(el.matches('.ticket'))window.__releaseTicket=()=>this.cb([{target:el,isIntersecting:true,intersectionRatio:1}],this);else super.observe(el)}};let seed=20261124;Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}})()''')
 base=datetime(2026,11,24,tzinfo=timezone.utc)
 page.clock.install(time=base);page.clock.pause_at(base+timedelta(seconds=1))
 page.goto('http://127.0.0.1:8090',wait_until='load')
 page.add_style_tag(content='html{scroll-behavior:auto!important}body{overflow-x:hidden}audio{display:none!important}')
 page.evaluate('''()=>{document.querySelectorAll('audio').forEach(a=>{a.muted=true;a.pause()});const c=document.createElement('img');c.id='capturePlane';c.src='assets/images/airplane-cursor.svg';c.style.cssText='position:fixed;left:0;top:0;width:32px;height:32px;z-index:999999;pointer-events:none';document.body.appendChild(c);window.scrollTo(0,0);const v=document.querySelector('#journeyNotesVideo');v.pause();v.currentTime=0}''')
 page.evaluate('''async()=>{const scene=document.querySelector('.journalVideoScene');const img=document.createElement('img');img.id='decodedJournalFrame';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain;border-radius:inherit;z-index:2';img.src='http://127.0.0.1:8091/media-frames/000.jpg';scene.appendChild(img);await img.decode()}''')
 info=page.evaluate('''()=>{const r=e=>{const a=e.getBoundingClientRect();return {x:a.x,y:a.y+scrollY,width:a.width,height:a.height}};return {ticket:r(document.querySelector('.ticket')),journal:r(document.querySelector('#journey-notes')),hero:r(document.querySelector('.hero')),fields:[...document.querySelectorAll('.ticketValue')].map(e=>e.firstElementChild.textContent)}}''')
 ticket=info['ticket'];journal=info['journal'];ticket_scroll=ticket['y']+ticket['height']/2-540
 journal_scroll=max(0,journal['y']+journal['height']/2-540)
 info.update({'ticket_scroll':ticket_scroll,'journal_scroll':journal_scroll,'zoom':1.30,'typing_trigger_seconds':9.0})
 (P/'capture-layout.json').write_text(json.dumps(info,ensure_ascii=False,indent=2))
 def ease(t):return max(0,min(1,t))**2*(3-2*max(0,min(1,t)))
 for f in range(690):
  t=f/30
  if t<2.7:scroll=0
  elif t<5:scroll=journal_scroll*ease((t-2.7)/2.3)
  elif t<7.1:scroll=journal_scroll
  elif t<9:scroll=journal_scroll+(ticket_scroll-journal_scroll)*ease((t-7.1)/1.9)
  else:scroll=ticket_scroll
  if f==270:page.evaluate('window.__releaseTicket()')
  page.evaluate('''({scroll,t})=>{window.scrollTo(0,scroll);const c=document.querySelector('#capturePlane');let x,y;if(t<2.7){x=440+220*(t/2.7);y=710-30*Math.sin(t)}else if(t<7.1){x=1420+45*Math.sin(t*.6);y=780+35*Math.cos(t*.5)}else{x=1580+18*Math.sin(t*.4);y=770+10*Math.cos(t*.4)}c.style.left=x+'px';c.style.top=y+'px'}''',{'scroll':scroll,'t':t})
  # Use verified decoded native video frames: seek/pause is unreliable under virtual time.
  vtime=max(0,t-2.7)%10
  page.evaluate('''async n=>{const img=document.querySelector('#decodedJournalFrame');const src='http://127.0.0.1:8091/media-frames/'+String(n).padStart(3,'0')+'.jpg';if(img.src!==src){img.src=src;await img.decode()}}''',min(239,int(vtime*24)))
  page.clock.run_for(34 if f%3==2 else 33)
  page.screenshot(path=str(P/'frames'/f'{f:04}.jpg'),type='jpeg',quality=94)
  if f%90==0:print(f'Captured {f}/690 ({t:.1f}s)',flush=True)
 final=page.evaluate('''()=>({animation:document.querySelector('.ticket').dataset.animation,fields:[...document.querySelectorAll('.ticketValue')].map(e=>e.lastElementChild.textContent),videoSrc:document.querySelector('video').currentSrc})''')
 assert final['animation']=='complete',final
 assert final['fields']==info['fields'],final
 (P/'capture-validation.json').write_text(json.dumps(final,ensure_ascii=False,indent=2))
 print('Capture complete; original typewriter finished with exact source text',flush=True)
 b.close()
