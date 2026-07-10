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