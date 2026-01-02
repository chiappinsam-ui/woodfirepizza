(async () => {
  const supabase = window.supabaseClient;

  async function isLoggedIn() {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  async function enableEditMode() {
    document.querySelectorAll("[data-img-key]").forEach(img => {
      img.style.cursor = "pointer";
      img.style.outline = "2px dashed rgba(0,0,0,.35)";
      img.title = "Click to replace (owner)";
      img.addEventListener("click", () => replaceImage(img));
    });
    console.log("Owner edit mode ON");
  }

  function openLogin() {
    if (document.getElementById("ownerLogin")) return;

    const wrap = document.createElement("div");
    wrap.id = "ownerLogin";
    wrap.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99999;";
    wrap.innerHTML = `
      <div style="background:#fff;padding:16px;border-radius:12px;width:min(420px,92vw);font-family:system-ui">
        <h3 style="margin:0 0 10px">Owner Login</h3>
        <input id="olEmail" type="email" placeholder="Email" style="width:100%;padding:10px;margin:6px 0">
        <input id="olPass" type="password" placeholder="Password" style="width:100%;padding:10px;margin:6px 0">
        <button id="olBtn" style="width:100%;padding:10px;margin-top:8px">Login</button>
        <p id="olMsg" style="margin:8px 0 0;opacity:.7"></p>
        <button id="olClose" style="margin-top:10px;width:100%;padding:8px">Close</button>
      </div>
    `;
    document.body.appendChild(wrap);

    wrap.querySelector("#olClose").onclick = () => wrap.remove();

    wrap.querySelector("#olBtn").onclick = async () => {
      const email = wrap.querySelector("#olEmail").value.trim();
      const password = wrap.querySelector("#olPass").value;
      wrap.querySelector("#olMsg").textContent = "Logging in...";

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return (wrap.querySelector("#olMsg").textContent = error.message);

      wrap.remove();
      enableEditMode();
    };
  }

  async function replaceImage(imgEl) {
    const key = imgEl.getAttribute("data-img-key");
    if (!key) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `site/${key}/${Date.now()}_${safe}`;

      const up = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
      if (up.error) return alert(up.error.message);

      const { error } = await supabase
        .from("site_images")
        .upsert({ key, path, updated_at: new Date().toISOString() });

      if (error) return alert(error.message);

      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      imgEl.src = pub.publicUrl;
    };

    input.click();
  }

  // Press Ctrl+Alt+E to login / enable edit mode
  document.addEventListener("keydown", async (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "e") {
      openLogin();
    }
  });

  // If already logged in, turn edit mode on automatically
  if (await isLoggedIn()) enableEditMode();
})();
