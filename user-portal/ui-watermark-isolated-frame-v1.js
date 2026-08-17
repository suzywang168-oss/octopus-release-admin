(()=>{
'use strict';
const ROOT='pageRoot',ROUTE='release.watermark',FRAME_CLASS='wm8-isolated-frame';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const active=()=>route()===ROUTE;
function style(){let s=document.getElementById('wm8-isolated-frame-style');if(s)return;s=document.createElement('style');s.id='wm8-isolated-frame-style';s.textContent=`#${ROOT}>.${FRAME_CLASS}{display:block;width:100%;height:calc(100vh - 118px);min-height:720px;border:0;background:transparent}`;document.head.appendChild(s)}
function title(){const t=document.querySelector('[data-page-title-slot]'),d=document.querySelector('[data-page-subtitle-slot]');if(t)t.textContent='3.1 频道水印处理';if(d)d.textContent='先选择译配完成的视频，再为同一视频添加一套或多套频道水印。'}
function render(){if(!active())return;style();title();const root=document.getElementById(ROOT);if(!root)return;let frame=root.querySelector(':scope > .'+FRAME_CLASS);if(!frame){root.replaceChildren();frame=document.createElement('iframe');frame.className='wm4-page '+FRAME_CLASS;frame.title='频道水印处理';frame.src='./watermark-standalone.html?v=202608171850#/release/watermark';frame.setAttribute('loading','eager');frame.setAttribute('allow','autoplay; clipboard-read; clipboard-write');root.appendChild(frame)}root.dataset.routeOwner=ROUTE}
function ensure(){if(!active())return;const root=document.getElementById(ROOT),frame=root?.querySelector(':scope > .'+FRAME_CLASS);if(!frame)render()}
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='octopus-watermark-route')return;const h=String(e.data.hash||'');if(!/^#\//.test(h)||h==='#/release/watermark')return;if(location.hash!==h)history.pushState(null,'',h)},true);
window.addEventListener('hashchange',()=>{if(active())queueMicrotask(ensure)},true);
window.addEventListener('pageshow',()=>{if(active())setTimeout(ensure,40)},true);
window.OctopusWatermarkSingleWorkspace={render,ensure,version:'8.5-isolated-frame'};
if(active())setTimeout(render,0);
})();
