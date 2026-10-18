(() => {
  "use strict";
  const profile=window.THE_PALM_PROFILE;
  if(!profile) return;
  const $=selector=>document.querySelector(selector);
  const launcher=$("#profile-assistant-launcher"),modal=$("#profile-assistant"),close=$("#assistant-close");
  const tabs=[...document.querySelectorAll(".assistant-tab")],views=[...document.querySelectorAll(".assistant-view")];
  const messages=$("#assistant-messages"),form=$("#assistant-form"),input=$("#assistant-input"),suggestions=$("#assistant-suggestions");
  const jdInput=$("#jd-input"),jdCount=$("#jd-count"),analyze=$("#jd-analyze"),clear=$("#jd-clear"),results=$("#match-results");
  let lastFocus=null;
  const makeText=(tag,value,className)=>{const node=document.createElement(tag);if(className)node.className=className;node.textContent=value;return node};
  const addMessage=(value,type="bot")=>{const node=makeText("div",value,"assistant-message "+type);node.setAttribute("role","listitem");messages.appendChild(node);messages.scrollTop=messages.scrollHeight};
  const sendEvent=(name,parameters)=>{if(typeof window.trackEvent==="function")window.trackEvent(name,parameters||{})};
  const open=()=>{lastFocus=document.activeElement;modal.hidden=false;document.body.style.overflow="hidden";close.focus();sendEvent("open_profile_assistant")};
  const shut=()=>{modal.hidden=true;document.body.style.overflow="";if(lastFocus)lastFocus.focus()};
  launcher?.addEventListener("click",open);close?.addEventListener("click",shut);
  modal?.addEventListener("click",event=>{if(event.target===modal)shut()});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!modal.hidden)shut()});
  const switchTab=name=>{tabs.forEach(tab=>tab.setAttribute("aria-selected",String(tab.dataset.tab===name)));views.forEach(view=>view.hidden=view.dataset.view!==name);if(name==="match")jdInput.focus();else input.focus();sendEvent("assistant_tab",{tab:name})};
  tabs.forEach(tab=>tab.addEventListener("click",()=>switchTab(tab.dataset.tab)));
  const bullets=items=>items.map(item=>"• "+item).join("\n");
  const answers=[
    {terms:["current","logitech","sustainability"],reply:()=> "Utpal currently works as a Data Scientist in sustainability at Logitech.\n\n"+bullets(profile.experience[0].evidence)},
    {terms:["forecast","time series","inventory","kellogg"],reply:()=> "His forecasting and supply-chain evidence includes:\n\n"+bullets(profile.experience[1].evidence)},
    {terms:["sql","accenture","meta","client"],reply:()=> "At Accenture / Meta, Utpal supported 60+ EMEA clients using SQL-led investigation, marketing analytics and structured troubleshooting."},
    {terms:["machine learning"," ml "," ai ","computer vision","nlp"],reply:()=> "Utpal has applied machine learning across forecasting, segmentation, NLP and computer vision. At Deciphex, image-classification work reached 98% accuracy on the project evaluation set."},
    {terms:["stakeholder","leadership","collaboration","team"],reply:()=> "His public evidence includes coordination across PLM, Snowflake and cross-functional teams at Logitech, plus support for 60+ EMEA clients at Accenture / Meta. These examples demonstrate structured communication, prioritisation and delivery across technical and business stakeholders."},
    {terms:["education","msc","university","degree"],reply:()=> "Utpal holds an MSc in Data & Computational Science from University College Dublin, covering mathematical modelling, scientific computing and optimal-control research."},
    {terms:["project","portfolio","nexus","swasthya","automation ecosystem"],reply:()=> "Selected public projects:\n\n"+profile.projects.map(p=>"• "+p.name+" — "+p.status+": "+p.detail).join("\n")},
    {terms:["skill","technology","stack","tools"],reply:()=> "Curated capabilities include:\n\n"+profile.capabilities.join(" · ")},
    {terms:["location","ireland","cork","remote","availability"],reply:()=> "Utpal is based in Cork, Ireland and is open to relevant Ireland-based and remote conversations in data science, applied AI, decision intelligence and sustainability analytics."},
    {terms:["contact","email","cv","resume","résumé"],reply:()=> "You can contact Utpal through the portfolio contact form or LinkedIn. To assess a role first, open “Match a job” and paste the job description."},
    {terms:["who","about","summary","tell me"],reply:()=> profile.identity.headline+"\n\nHis work connects "+profile.identity.positioning.join(", ")+"."}
  ];
  const respond=query=>{
    const normal=" "+query.toLowerCase().replace(/[^a-z0-9+#.\s-]/g," ")+" ";
    const ranked=answers.map(answer=>({answer,score:answer.terms.reduce((n,term)=>n+(normal.includes(term)?1:0),0)})).sort((a,b)=>b.score-a.score);
    return ranked[0].score?ranked[0].answer.reply():"I can answer from Utpal’s approved public profile. Try asking about his current role, forecasting, SQL, machine learning, sustainability, projects, education or stakeholder experience. You can also paste a job description in “Match a job”.";
  };
  form?.addEventListener("submit",event=>{event.preventDefault();const query=input.value.trim().slice(0,500);if(!query)return;addMessage(query,"user");input.value="";window.setTimeout(()=>addMessage(respond(query)),160);sendEvent("profile_question",{topic:query.toLowerCase().split(/\s+/).slice(0,4).join("_")})});
  suggestions?.addEventListener("click",event=>{const button=event.target.closest("button[data-question]");if(!button)return;input.value=button.dataset.question;form.requestSubmit()});
  jdInput?.addEventListener("input",()=>{jdCount.textContent=jdInput.value.length.toLocaleString()+" / 12,000"});
  clear?.addEventListener("click",()=>{jdInput.value="";jdCount.textContent="0 / 12,000";results.replaceChildren();jdInput.focus()});
  const matchedEvidence=value=>{const normal=value.toLowerCase().replace(/[–—/]/g," ");return profile.evidence.filter(item=>item.keywords.some(keyword=>normal.includes(keyword)))};
  const createGroup=(title,className,items)=>{
    const section=makeText("section","","match-group "+className);section.appendChild(makeText("h4",title));const list=document.createElement("ul");
    items.forEach(item=>{const li=document.createElement("li");li.appendChild(makeText("strong",item.theme));li.appendChild(makeText("span",item.detail+" Evidence: "+item.source+"."));list.appendChild(li)});
    section.appendChild(list);return section;
  };
  const renderMatch=()=>{
    const jd=jdInput.value.trim().slice(0,12000);
    if(jd.length<80){results.replaceChildren(makeText("div","Please paste a fuller job description so the evidence comparison is meaningful.","assistant-message bot"));return}
    const unique=[...new Map(matchedEvidence(jd).map(item=>[item.theme,item])).values()];
    const strong=unique.filter(item=>item.level==="strong"),supporting=unique.filter(item=>item.level==="supporting"),gaps=unique.filter(item=>item.level==="not-evidenced");
    results.replaceChildren();const summary=makeText("section","","match-summary glass");
    summary.appendChild(makeText("strong",strong.length>=5?"Strong evidence across several requirements":strong.length>=2?"Relevant evidence with areas to validate":"Limited direct evidence in the curated profile"));
    summary.appendChild(makeText("p",strong.length+" strong evidence theme"+(strong.length===1?"":"s")+", "+supporting.length+" supporting theme"+(supporting.length===1?"":"s")+" and "+gaps.length+" explicitly identified gap"+(gaps.length===1?"":"s")+". This is an evidence comparison, not an automated hiring score."));
    results.appendChild(summary);
    if(strong.length)results.appendChild(createGroup("Strong evidence","strong",strong));
    if(supporting.length)results.appendChild(createGroup("Relevant — validate depth","supporting",supporting));
    if(gaps.length)results.appendChild(createGroup("Not evidenced publicly","gap",gaps));
    if(!unique.length)results.appendChild(makeText("div","No recognised requirement themes were found. The description may use specialist terminology that is not included in the current public evidence map.","assistant-message bot"));
    const cta=makeText("a","Discuss this role with Utpal →","button primary");cta.href="#contact";cta.addEventListener("click",shut);results.appendChild(cta);
    sendEvent("jd_match_complete",{strong:strong.length,supporting:supporting.length,gaps:gaps.length});
  };
  analyze?.addEventListener("click",renderMatch);
})();
