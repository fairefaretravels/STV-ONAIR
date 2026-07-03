window.STUDIO_BOOT = (function () {

  async function start() {
    try {
      console.log("[BOOT] Starting STUDIO...");

      if (!window.STUDIO || !window.MEDIA) {
        throw new Error("Missing STUDIO or MEDIA module");
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
          title: "System Idle",
          type: "track",
          url: ""
        }];
      }

      MEDIA.start(queue);

      console.log("[BOOT] SUCCESS");

    } catch (err) {
      console.error("[BOOT FAILURE]", err);

      document.getElementById("title").innerText = "System Offline";
    }
  }

  return { start };

})();
