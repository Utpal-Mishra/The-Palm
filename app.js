const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals=document.querySelectorAll(".reveal");
if(reduced){reveals.forEach(el=>el.classList.add("visible"))}else{
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
 reveals.forEach(el=>revealObserver.observe(el));
}
const sections=document.querySelectorAll("main section[id]");
const dockLinks=document.querySelectorAll(".dock a");
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){dockLinks.forEach(link=>link.classList.toggle("active",link.dataset.section===entry.target.id))}}),{rootMargin:"-40% 0px -50% 0px"});
sections.forEach(section=>navObserver.observe(section));
document.getElementById("year").textContent=new Date().getFullYear();
const music=document.getElementById("background-music");
const musicToggle=document.getElementById("music-toggle");
const musicLabel=musicToggle.querySelector(".music-label");
music.volume=.28;
function setMusicState(isPlaying){
 musicToggle.setAttribute("aria-pressed",String(isPlaying));
 musicToggle.setAttribute("aria-label",isPlaying?"Pause background music":"Play background music");
 musicLabel.textContent=isPlaying?"Music on":"Music off";
}
musicToggle.addEventListener("click",async()=>{
 if(music.paused){
  try{await music.play();setMusicState(true);localStorage.setItem("the-palm-music","on")}
  catch(error){setMusicState(false)}
 }else{
  music.pause();setMusicState(false);localStorage.setItem("the-palm-music","off");
 }
});
music.addEventListener("ended",()=>setMusicState(false));
const recommendationTrack=document.querySelector(".recommendations-track");
if(recommendationTrack){
 const recommendationCards=[...recommendationTrack.querySelectorAll(".recommendation-card")];
 const previousRecommendation=document.querySelector(".recommendation-arrow.previous");
 const nextRecommendation=document.querySelector(".recommendation-arrow.next");
 const recommendationDots=document.querySelector(".recommendation-dots");
 let activeRecommendation=0;
 const dots=recommendationCards.map((card,index)=>{
  const dot=document.createElement("button");
  dot.type="button";
  dot.className="recommendation-dot";
  dot.setAttribute("aria-label",`Show recommendation ${index+1}`);
  dot.addEventListener("click",()=>card.scrollIntoView({behavior:reduced?"auto":"smooth",block:"nearest",inline:"start"}));
  recommendationDots.appendChild(dot);
  return dot;
 });
 function updateRecommendationControls(index){
  activeRecommendation=Math.max(0,Math.min(index,recommendationCards.length-1));
  dots.forEach((dot,dotIndex)=>dot.classList.toggle("active",dotIndex===activeRecommendation));
  previousRecommendation.disabled=activeRecommendation===0;
  nextRecommendation.disabled=activeRecommendation===recommendationCards.length-1;
 }
 function scrollRecommendation(direction){
  const target=Math.max(0,Math.min(activeRecommendation+direction,recommendationCards.length-1));
  recommendationCards[target].scrollIntoView({behavior:reduced?"auto":"smooth",block:"nearest",inline:"start"});
 }
 previousRecommendation.addEventListener("click",()=>scrollRecommendation(-1));
 nextRecommendation.addEventListener("click",()=>scrollRecommendation(1));
 recommendationTrack.addEventListener("keydown",event=>{
  if(event.key==="ArrowRight"){event.preventDefault();scrollRecommendation(1)}
  if(event.key==="ArrowLeft"){event.preventDefault();scrollRecommendation(-1)}
 });
 const recommendationObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(visible) updateRecommendationControls(recommendationCards.indexOf(visible.target));
 },{root:recommendationTrack,threshold:[.55,.75]});
 recommendationCards.forEach(card=>recommendationObserver.observe(card));
 updateRecommendationControls(0);
}

// Consent-gated GA4 foundation. Add the GA4 ID to the ga-measurement-id meta tag to activate.
const gaMeasurementId=document.querySelector('meta[name="ga-measurement-id"]')?.content.trim();
const consentBanner=document.getElementById("analytics-consent");
const consentAccept=document.getElementById("analytics-accept");
const consentReject=document.getElementById("analytics-reject");
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments)}
function trackEvent(name,parameters={}){
 if(localStorage.getItem("the-palm-analytics")==="granted"&&gaMeasurementId){
  gtag("event",name,parameters);
 }
}
function loadAnalytics(){
 if(!gaMeasurementId||document.querySelector('script[data-ga4]')) return;
 const script=document.createElement("script");
 script.async=true;script.dataset.ga4="true";
 script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
 document.head.appendChild(script);
 gtag("js",new Date());
 gtag("config",gaMeasurementId,{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});
}
if(gaMeasurementId){
 const analyticsChoice=localStorage.getItem("the-palm-analytics");
 if(analyticsChoice==="granted") loadAnalytics();
 else if(!analyticsChoice) consentBanner.hidden=false;
}
consentAccept?.addEventListener("click",()=>{
 localStorage.setItem("the-palm-analytics","granted");consentBanner.hidden=true;loadAnalytics();trackEvent("analytics_consent",{choice:"accepted"});
});
consentReject?.addEventListener("click",()=>{
 localStorage.setItem("the-palm-analytics","denied");consentBanner.hidden=true;
});
document.addEventListener("click",event=>{
 const link=event.target.closest("a,button");
 if(!link) return;
 if(link.dataset.event) trackEvent(link.dataset.event,{project:link.dataset.project||undefined,label:link.textContent.trim().slice(0,80)});
 else if(link.matches('a[href*="linkedin.com"]')) trackEvent("click_linkedin");
 else if(link.matches('a[href*="github.com"]')) trackEvent("click_github");
});
musicToggle.addEventListener("click",()=>trackEvent("toggle_music",{state:music.paused?"off":"on"}));
const contactForm=document.querySelector(".contact-form");
let contactStarted=false;
contactForm?.addEventListener("focusin",()=>{if(!contactStarted){contactStarted=true;trackEvent("contact_form_start")}});
contactForm?.addEventListener("submit",()=>trackEvent("contact_form_submit"));
const sectionAnalyticsObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting) trackEvent("view_section",{section:entry.target.id});
}),{threshold:.55});
sections.forEach(section=>sectionAnalyticsObserver.observe(section));


// Profile-led data-to-decision system map.
const decisionFlow=document.getElementById("decision-flow");
if(decisionFlow){
 const flowNodes=[...decisionFlow.querySelectorAll(".flow-node")];
 const flowStatus=document.getElementById("flow-status");
 const flowReadout=document.getElementById("flow-readout");
 const flowStates=[
  ["Connecting trusted sources","Source connections verified"],
  ["Standardising the workflow","Transformations and controls active"],
  ["Generating decision evidence","Forecasts and signals evaluated"],
  ["Delivering an actionable output","Decision-ready insight published"]
 ];
 let flowIndex=0;
 let flowTimer;
 const setFlowStep=index=>{
  flowIndex=index%flowNodes.length;
  flowNodes.forEach((node,nodeIndex)=>{
   const active=nodeIndex===flowIndex;
   node.classList.toggle("active",active);
   if(active) node.setAttribute("aria-current","step"); else node.removeAttribute("aria-current");
  });
  flowStatus.textContent=flowStates[flowIndex][0];
  flowReadout.textContent=flowStates[flowIndex][1];
 };
 const startFlow=()=>{
  if(reduced||flowTimer) return;
  flowTimer=window.setInterval(()=>setFlowStep(flowIndex+1),1800);
 };
 const stopFlow=()=>{if(flowTimer){window.clearInterval(flowTimer);flowTimer=undefined}};
 flowNodes.forEach((node,index)=>node.addEventListener("pointerenter",()=>{stopFlow();setFlowStep(index)}));
 decisionFlow.addEventListener("pointerleave",()=>{decisionFlow.style.setProperty("--flow-rx","0deg");decisionFlow.style.setProperty("--flow-ry","0deg");startFlow()});
 if(!reduced){
  let tiltFrame;
  decisionFlow.addEventListener("pointermove",event=>{
   if(tiltFrame) return;
   tiltFrame=window.requestAnimationFrame(()=>{
    const bounds=decisionFlow.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width-.5;
    const y=(event.clientY-bounds.top)/bounds.height-.5;
    decisionFlow.style.setProperty("--flow-rx",(-y*1.4).toFixed(2)+"deg");
    decisionFlow.style.setProperty("--flow-ry",(x*1.8).toFixed(2)+"deg");
    tiltFrame=undefined;
   });
  });
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stopFlow();else startFlow()});
 }
 setFlowStep(0);
 startFlow();
}
