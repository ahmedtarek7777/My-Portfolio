// Scroll reveal animations
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Booking form
const form = document.getElementById("bookForm");
const err = document.getElementById("err");
const dateInput = document.getElementById("date");
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  err.hidden = true;
  const name = document.getElementById("name").value.trim();
  const date = dateInput.value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;
  if (!name || !date || !time || !guests) {
    err.textContent = "Please fill in every field.";
    err.hidden = false;
    return;
  }
  if (new Date(date + "T23:59:59") < new Date()) {
    err.textContent = "Please pick a date in the future.";
    err.hidden = false;
    return;
  }
  const pretty = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  document.getElementById("doneText").textContent =
    `${name}, this demo captured a request for ${guests} on ${pretty} at ${time}. No reservation has been made or sent.`;
  form.hidden = true;
  document.getElementById("done").hidden = false;
});

document.getElementById("again").onclick = () => {
  form.reset();
  form.hidden = false;
  document.getElementById("done").hidden = true;
};
