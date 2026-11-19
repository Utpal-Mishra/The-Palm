(() => {
  const writing = document.getElementById("writing");
  const scene = writing.querySelector(".courier-scene");
  const courier = scene.querySelector(".courier");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nodes = [...writing.querySelectorAll(".lifecycle-flow a")];
  const stages = nodes.map(node => writing.querySelector(node.hash));
  const announcement = writing.querySelector("#lifecycle-announcement");

  function showStage(stage, announce = false) {
    scene.dataset.stage = stage.id.replace("lifecycle-", "");
    for (const [index, panel] of stages.entries()) {
      panel.hidden = panel !== stage;
      if (panel === stage) nodes[index].setAttribute("aria-current", "step");
      else nodes[index].removeAttribute("aria-current");
    }
    if (announce) {
      announcement.textContent = stage.querySelector("h4").textContent;
      if (!reducedMotion.matches) {
        courier.getAnimations().forEach(animation => animation.cancel());
        courier.animate([
          { transform: "translateY(0)" },
          { transform: "translateY(-9px) rotate(-5deg)" },
          { transform: "translateY(0)" },
        ], { duration: 370, easing: "ease-in-out" });
      }
    }
  }

  function openTopic(target) {
    const topic = target?.closest(".writing-topic");
    if (topic) topic.querySelector("details").open = true;
  }

  function syncLocation() {
    const target = document.getElementById(location.hash.slice(1));
    if (stages.includes(target)) showStage(target);
    else if (!location.hash || target === writing || target?.id === "writing-lifecycle") showStage(stages[0]);
    openTopic(target);
  }

  showStage(stages[0]);
  syncLocation();
  window.addEventListener("hashchange", syncLocation);
  writing.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) openTopic(document.getElementById(link.hash.slice(1)));
  });

  for (const link of [...nodes, writing.querySelector(".lifecycle-loop")]) {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      showStage(writing.querySelector(link.hash), true);
    });
  }
})();
