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