const STORAGE_KEY = "barberAppointments";
const ADMIN_PIN = "1234";

const appointmentForm = document.getElementById("appointment-form");
const adminLoginForm = document.getElementById("admin-login");
const adminDashboard = document.getElementById("admin-dashboard");
const appointmentList = document.getElementById("appointment-list");
const appointmentCount = document.getElementById("appointment-count");
const clearAllBtn = document.getElementById("clear-all");

function loadAppointments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function renderAppointments() {
  const appointments = loadAppointments();
  appointmentCount.textContent = String(appointments.length);
  appointmentList.innerHTML = "";

  if (!appointments.length) {
    appointmentList.innerHTML = "<li>No appointments registered yet.</li>";
    return;
  }

  appointments.forEach((appointment) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div>
        <strong>${appointment.name}</strong>
        <div class="item-meta">${appointment.phone} · ${appointment.service} with ${appointment.barber}</div>
        <div class="item-meta">${appointment.date} at ${appointment.time} · Status: <strong>${appointment.status}</strong></div>
      </div>
      <div class="item-actions">
        <button class="small success" data-action="complete" data-id="${appointment.id}">Complete</button>
        <button class="small danger" data-action="delete" data-id="${appointment.id}">Delete</button>
      </div>
    `;
    appointmentList.appendChild(item);
  });
}

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newAppointment = {
    id: crypto.randomUUID(),
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    barber: document.getElementById("barber").value,
    service: document.getElementById("service").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    status: "Booked",
  };

  const appointments = loadAppointments();
  appointments.push(newAppointment);
  saveAppointments(appointments);
  appointmentForm.reset();
  renderAppointments();
  alert("Appointment registered successfully.");
});

adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const pin = document.getElementById("admin-pin").value;

  if (pin !== ADMIN_PIN) {
    alert("Invalid admin PIN.");
    return;
  }

  adminDashboard.classList.remove("hidden");
  adminLoginForm.classList.add("hidden");
  renderAppointments();
});

appointmentList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const id = target.dataset.id;
  const action = target.dataset.action;
  const appointments = loadAppointments();

  if (action === "delete") {
    const next = appointments.filter((item) => item.id !== id);
    saveAppointments(next);
    renderAppointments();
    return;
  }

  if (action === "complete") {
    const next = appointments.map((item) =>
      item.id === id ? { ...item, status: "Completed" } : item,
    );
    saveAppointments(next);
    renderAppointments();
  }
});

clearAllBtn.addEventListener("click", () => {
  if (!confirm("Delete all appointments?")) return;
  saveAppointments([]);
  renderAppointments();
});
