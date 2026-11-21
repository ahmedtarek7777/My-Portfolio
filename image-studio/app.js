let image = null,
  angle = 0,
  flip = false;
function draw() {
  if (!image) return;
  let w = Math.max(50, Math.min(4096, +$("#width").value || 800)),
    h = Math.round((w * image.naturalHeight) / image.naturalWidth);
  if (h > 4096) {
    w = Math.max(1, Math.round((w * 4096) / h));
    h = 4096;
  }
  let rotated = angle % 180 !== 0,
    c = $("#canvas");
  c.width = rotated ? h : w;
  c.height = rotated ? w : h;
  let g = c.getContext("2d");
  g.translate(c.width / 2, c.height / 2);
  g.rotate((angle * Math.PI) / 180);
  g.scale(flip ? -1 : 1, 1);
  g.filter = `brightness(${$("#brightness").value}%) contrast(${$("#contrast").value}%) saturate(${$("#saturation").value}%) grayscale(${$("#gray").value}%) blur(${$("#blur").value}px)`;
  g.drawImage(image, -w / 2, -h / 2, w, h);
  $("#brightOut").textContent = $("#brightness").value + "%";
  $("#info").textContent = `${c.width} × ${c.height} pixels · PNG output`;
}
function open(src) {
  let im = new Image();
  im.onload = () => {
    image = im;
    $("#width").value = Math.min(1600, im.naturalWidth);
    angle = 0;
    flip = false;
    draw();
    if (src.startsWith("blob:")) URL.revokeObjectURL(src);
  };
  im.onerror = () => toast("Could not open this image. Try PNG, JPEG or WebP.");
  im.src = src;
}
$("#file").onchange = (e) => {
  let f = e.target.files[0];
  if (!f) return;
  if (f.size > 20 * 1024 * 1024)
    return toast("Please use an image under 20 MB");
  open(URL.createObjectURL(f));
};
$("#sample").onclick = () => open("../assets/products/0.webp");
$$("input[type=range],#width").forEach((i) => (i.oninput = draw));
$("#rotate").onclick = () => {
  angle = (angle + 90) % 360;
  draw();
};
$("#flip").onclick = () => {
  flip = !flip;
  draw();
};
$("#reset").onclick = () => {
  for (let k of ["brightness", "contrast", "saturation"])
    $("#" + k).value = 100;
  $("#gray").value = $("#blur").value = 0;
  angle = 0;
  flip = false;
  draw();
};
$("#download").onclick = () => {
  if (!image) return toast("Open an image first");
  $("#canvas").toBlob((blob) => {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pixel-studio.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, "image/png");
};
open("../assets/products/0.webp");
