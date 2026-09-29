// 10 Sample Tickets Initial Data
const sampleTickets = [
  { id: 101, title: "Login Page Bug", description: "Users are unable to log in using Google OAuth.", status: "Open", priority: "High" },
  { id: 102, title: "Payment Gateway Error", description: "Transactions failing intermittently on UPI.", status: "In Progress", priority: "High" },
  { id: 103, title: "UI Alignment Issue", description: "Sidebar overlaps with content on mobile screens.", status: "Resolved", priority: "Low" },
  { id: 104, title: "Profile Picture Upload", description: "Upload fails when image size exceeds 2MB.", status: "Open", priority: "Medium" },
  { id: 105, title: "Email Notification Delay", description: "Password reset emails taking over 10 minutes.", status: "In Progress", priority: "Medium" },
  { id: 106, title: "Export to CSV Feature", description: "Add export button for user report logs.", status: "Open", priority: "Low" },
  { id: 107, title: "API Timeout on Dashboard", description: "Dashboard analytics loading slow during peak hours.", status: "In Progress", priority: "High" },
  { id: 108, title: "Dark Theme Color Contrast", description: "Text contrast ratio is low on settings page.", status: "Resolved", priority: "Low" },
  { id: 109, title: "Session Expire Notice", description: "Show popup before auto-logout happens.", status: "Open", priority: "Medium" },
  { id: 110, title: "Broken Link in Footer", description: "Privacy policy link gives 404 error.", status: "Resolved", priority: "Low" }
];

let tickets = JSON.parse(localStorage.getItem('desk_tickets')) || sampleTickets;
let ticketToDeleteId = null;

// DOM Elements
const ticketsContainer = document.getElementById('ticketsContainer');
const ticketForm = document.getElementById('ticketForm');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Save to LocalStorage
function saveData() {
  localStorage.setItem('desk_tickets', JSON.stringify(tickets));
}

// Render Dashboard Statistics
function updateDashboard() {
  document.getElementById('statTotal').innerText = tickets.length;
  document.getElementById('statOpen').innerText = tickets.filter(t => t.status === 'Open').length;
  document.getElementById('statProgress').innerText = tickets.filter(t => t.status === 'In Progress').length;
  document.getElementById('statResolved').innerText = tickets.filter(t => t.status === 'Resolved').length;
}

// Render Tickets Grid
function renderTickets() {
  const query = searchInput.value.toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;

  ticketsContainer.innerHTML = '';

  const filtered = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (filtered.length === 0) {
    ticketsContainer.innerHTML = '<p>No tickets found matching your criteria.</p>';
    updateDashboard();
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'card ticket-card';
    card.innerHTML = `
      <div class="ticket-header">
        <h4>#${t.id} - ${escapeHTML(t.title)}</h4>
        <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
      </div>
      <p>${escapeHTML(t.description)}</p>
      <div class="ticket-footer">
        <select onchange="updateTicketStatus(${t.id}, this.value)">
          <option value="Open" ${t.status === 'Open' ? 'selected' : ''}>Open</option>
          <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Resolved" ${t.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
        <button class="btn btn-danger" onclick="openDeleteModal(${t.id})">Delete</button>
      </div>
    `;
    ticketsContainer.appendChild(card);
  });

  updateDashboard();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// Add New Ticket
ticketForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTicket = {
    id: Date.now().toString().slice(-4),
    title: document.getElementById('titleInput').value.trim(),
    description: document.getElementById('descInput').value.trim(),
    status: 'Open',
    priority: document.getElementById('priorityInput').value
  };

  tickets.unshift(newTicket);
  saveData();
  renderTickets();
  ticketForm.reset();
});

// Update Status
window.updateTicketStatus = function(id, newStatus) {
  tickets = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
  saveData();
  renderTickets();
};

// Delete Confirmation Modal Logic
window.openDeleteModal = function(id) {
  ticketToDeleteId = id;
  deleteModal.classList.remove('hidden');
};

cancelDeleteBtn.addEventListener('click', () => {
  ticketToDeleteId = null;
  deleteModal.classList.add('hidden');
});

confirmDeleteBtn.addEventListener('click', () => {
  if (ticketToDeleteId !== null) {
    tickets = tickets.filter(t => t.id !== ticketToDeleteId);
    saveData();
    renderTickets();
    ticketToDeleteId = null;
    deleteModal.classList.add('hidden');
  }
});

// Dark / Light Mode Toggle
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggleBtn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Real-time Search & Filter Handlers
searchInput.addEventListener('input', renderTickets);
statusFilter.addEventListener('change', renderTickets);
priorityFilter.addEventListener('change', renderTickets);

// Initial Load
renderTickets();