window.STUDIO_BOOT = (function () {

  async function start() {
    try {
      console.log("[BOOT] Starting STUDIO...");

      function validateModules() {
        const issues = [];

        if (!window.STUDIO) issues.push("STUDIO missing");
        if (!window.MEDIA) issues.push("MEDIA missing");

        if (window.STUDIO && typeof window.STUDIO.generate !== "function") {
          issues.push("STUDIO.generate invalid");
        }

        if (window.MEDIA && typeof window.MEDIA.start !== "function") {
          issues.push("MEDIA.start invalid");
        }

        return issues;
      }

      const issues = validateModules();

      if (issues.length) {
        throw new Error(issues.join(", "));
      }

      let queue = [];

      try {
        queue = await STUDIO.generate();
      } catch (e) {
        console.warn("[BOOT] generate() failed:", e);
      }

      if (!queue || queue.length === 0) {
        queue = [{
          id: "fallback",
          title: "SYSTEM RECOVERY MODE",
          type: "commercial",
          duration: 30
        }];
      }

      try {
        MEDIA.start(queue);
      } catch (e) {
        console.error("[BOOT] MEDIA failed:", e);

        const el = document.getElementById("title");
        if (el) el.innerText = "Playback Engine Error";

        return;
      }

      console.log("[BOOT] SUCCESS");

    } catch (err) {
      console.error("[BOOT FAILURE]", err);

      const el = document.getElementById("title");
      if (el) el.innerText = "SYSTEM OFFLINE";

      document.body.style.background = "#0b0d14";
    }
  }

  return { start };

})();
