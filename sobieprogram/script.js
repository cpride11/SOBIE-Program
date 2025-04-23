
let programData = [];

function populateTypeDropdown(data) {
  const types = Array.from(new Set(data.map(item => item.type))).sort();
  const typeFilter = document.getElementById("typeFilter");
  typeFilter.innerHTML = '<option value="">All Types</option>';
  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

function renderSessions(data) {
  const container = document.getElementById("program");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No sessions found.</p>`;
    return;
  }

  data.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1 text-primary">${item.time} – ${item.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${item.type}</h6>
          <p class="mb-1"><strong>Chair:</strong> ${item.chair}</p>
          <ul class="mb-2">${item.speakers.map(s => `<li>${s}</li>`).join("")}</ul>
          <p class="text-end mb-0"><small class="text-secondary">${item.location}</small></p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function filterSessions() {
  const day = document.getElementById("dayFilter").value.toLowerCase();
  const type = document.getElementById("typeFilter").value.toLowerCase();
  const search = document.getElementById("searchInput").value.trim().toLowerCase();

  const filtered = programData.filter(item => {
    const matchDay = !day || item.day.toLowerCase() === day;
    const matchType = !type || item.type.toLowerCase() === type;
    const matchSearch =
      item.title.toLowerCase().includes(search) ||
      item.chair.toLowerCase().includes(search) ||
      item.speakers.join(" ").toLowerCase().includes(search);

    return matchDay && matchType && matchSearch;
  });

  renderSessions(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("sobie2025-data.json")
    .then(res => res.json())
    .then(data => {
      programData = data;
      populateTypeDropdown(programData);
      renderSessions(programData);
    });

  document.getElementById("dayFilter").addEventListener("change", filterSessions);
  document.getElementById("typeFilter").addEventListener("change", filterSessions);
  document.getElementById("searchInput").addEventListener("input", filterSessions);
});
