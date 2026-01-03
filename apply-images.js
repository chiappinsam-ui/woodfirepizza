(async () => {
  const supabase = window.supabaseClient;

  const { data, error } = await supabase.from("site_images").select("key,path");
  if (error) return console.error(error);

  const map = Object.fromEntries((data || []).map(r => [r.key, r.path]));

  document.querySelectorAll("[data-img-key]").forEach(img => {
    const key = img.getAttribute("data-img-key");
    const path = map[key];
    if (!path) return;

    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
    const url = pub.publicUrl + (pub.publicUrl.includes("?") ? "&" : "?") + "v=" + Date.now();
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.src = url;
  });
})();
