// Detect which page we are on
const path = window.location.pathname;

document.addEventListener("DOMContentLoaded", () => {
  if (path.endsWith("index.html") || path.endsWith("/")) {
    setupAuthPage();
  } else if (path.endsWith("notes.html")) {
    setupNotesPage();
  }
});

// ========== AUTH PAGE (index.html) ==========
function setupAuthPage() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const msg = document.getElementById("msg");

  if (!loginBtn || !signupBtn) return;

  loginBtn.addEventListener("click", async () => {
    msg.textContent = "";
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = "notes.html";
    } catch (error) {
      msg.textContent = error.message;
    }
  });

  signupBtn.addEventListener("click", async () => {
    msg.textContent = "";
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      msg.style.color = "green";
      msg.textContent = "Account created! You can login now.";
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = error.message;
    }
  });
}

// ========== NOTES PAGE (notes.html) ==========
function setupNotesPage() {
  const noteIdInput   = document.getElementById("noteId");
  const titleInput    = document.getElementById("noteTitle");
  const contentInput  = document.getElementById("noteContent");
  const tagsInput     = document.getElementById("noteTags"); // if you added tags
  const saveBtn       = document.getElementById("saveNoteBtn");
  const clearBtn      = document.getElementById("clearFormBtn");
  const notesList     = document.getElementById("notesList");
  const noteMsg       = document.getElementById("noteMsg");
  const logoutBtn     = document.getElementById("logoutBtn");
  const searchInput   = document.getElementById("searchInput");
  const themeToggle   = document.getElementById("themeToggle");  // <--- NEW

  let selectedColor = "#ffffff";  // default color
  let allNotes = [];              // will hold ALL notes for search
  let currentUserId = null;

  // ----- Dark mode helpers -----
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  // On page load, apply saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  if (themeToggle && savedTheme === "dark") {
    themeToggle.checked = true;
  }

  // When user toggles the switch
  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? "dark" : "light";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // ----- Color picker -----
  const colorCircles = document.querySelectorAll(".color-circle");

  colorCircles.forEach(circle => {
    circle.addEventListener("click", () => {
      selectedColor = circle.dataset.color;

      colorCircles.forEach(c => c.classList.remove("selected"));
      circle.classList.add("selected");
    });
  });

  // ----- Auth guard + initial load -----
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      currentUserId = user.uid;
      loadNotes(currentUserId);
    }
  });

  // ----- Save / update note -----
  saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const title   = titleInput.value.trim();
    const content = contentInput.value.trim();
    const tagsStr = tagsInput ? tagsInput.value.trim() : "";
    const tagsArr = tagsStr
      ? tagsStr.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [];

    if (!title && !content) {
      noteMsg.style.color = "red";
      noteMsg.textContent = "Note cannot be empty!";
      return;
    }

    const noteId = noteIdInput.value;

    try {
      if (noteId) {
        // Update existing
        await db.collection("notes").doc(noteId).update({
          title,
          content,
          tags: tagsArr,
          color: selectedColor,
          updatedAt: new Date()
        });
        noteMsg.style.color = "green";
        noteMsg.textContent = "Note updated!";
      } else {
        // Create new
        await db.collection("notes").add({
          userId: user.uid,
          title,
          content,
          tags: tagsArr,
          color: selectedColor,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        noteMsg.style.color = "green";
        noteMsg.textContent = "Note added!";
      }

      clearForm();
      loadNotes(user.uid);
    } catch (error) {
      noteMsg.style.color = "red";
      noteMsg.textContent = error.message;
    }
  });

  // ----- Clear form -----
  clearBtn.addEventListener("click", () => {
    clearForm();
    noteMsg.textContent = "";
  });

  function clearForm() {
    noteIdInput.value  = "";
    titleInput.value   = "";
    contentInput.value = "";
    if (tagsInput) tagsInput.value = "";
    selectedColor = "#ffffff";

    colorCircles.forEach(c => c.classList.remove("selected"));
    const defaultCircle = document.querySelector('.color-circle[data-color="#ffffff"]');
    if (defaultCircle) defaultCircle.classList.add("selected");
  }

  // ----- Logout -----
  logoutBtn.addEventListener("click", async () => {
    await auth.signOut();
    window.location.href = "index.html";
  });

  // ----- Load from Firestore -----
  async function loadNotes(userId) {
    notesList.innerHTML = "<p>Loading...</p>";

    try {
      const snapshot = await db.collection("notes")
        .where("userId", "==", userId)
        .orderBy("updatedAt", "desc")
        .get();

      allNotes = [];
      snapshot.forEach((doc) => {
        allNotes.push({
          id: doc.id,
          ...doc.data()
        });
      });

      renderNotes(allNotes);
    } catch (error) {
      notesList.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
  }

  // ----- Render notes (used by load + search) -----
  function renderNotes(list) {
    if (!list.length) {
      notesList.innerHTML = "<p>No notes found.</p>";
      return;
    }

    notesList.innerHTML = "";

    list.forEach((note) => {
      const card = document.createElement("div");
      card.className = "col-md-6";

      const tagsHtml = note.tags && note.tags.length
        ? `<p class="mb-1 small">
             ${note.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join("")}
           </p>`
        : "";

      // We'll still use the saved color as background
      card.innerHTML = `
        <div class="card note-card shadow-sm h-100" style="background:${note.color || "#ffffff"};">
          <div class="card-body">
            <h6 class="card-title">${note.title || "(No title)"}</h6>
            ${tagsHtml}
            <p class="card-text small mb-0">${note.content || ""}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary editBtn">Edit</button>
            <button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button>
          </div>
        </div>
      `;

      const editBtn   = card.querySelector(".editBtn");
      const deleteBtn = card.querySelector(".deleteBtn");

      // Edit
      editBtn.addEventListener("click", () => {
        noteIdInput.value  = note.id;
        titleInput.value   = note.title || "";
        contentInput.value = note.content || "";
        if (tagsInput) tagsInput.value = (note.tags || []).join(", ");

        noteMsg.textContent = "Editing existing note...";
        noteMsg.style.color = "blue";

        // Restore color
        selectedColor = note.color || "#ffffff";
        colorCircles.forEach(circle => {
          circle.classList.remove("selected");
          if (circle.dataset.color === selectedColor) {
            circle.classList.add("selected");
          }
        });
      });

      // Delete
      deleteBtn.addEventListener("click", async () => {
        if (confirm("Delete this note?")) {
          await db.collection("notes").doc(note.id).delete();
          loadNotes(currentUserId);
        }
      });

      notesList.appendChild(card);
    });
  }

  // ----- Search -----
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();

      if (!q) {
        renderNotes(allNotes);
        return;
      }

      const filtered = allNotes.filter(note => {
        const title   = (note.title || "").toLowerCase();
        const content = (note.content || "").toLowerCase();
        const tagsStr = (note.tags || []).join(" ").toLowerCase();
        return (
          title.includes(q) ||
          content.includes(q) ||
          tagsStr.includes(q)
        );
      });

      renderNotes(filtered);
    });
  }
}
