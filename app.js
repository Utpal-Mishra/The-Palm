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