document.addEventListener('DOMContentLoaded', () => {
    //automatic highlighting the active page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navigation-bar .nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    //INTERACTIVE BACKGROUND OF BUTTONS IN THE PAGE
    const interactiveButtons = document.querySelectorAll('.nav-link, .profile-btn, .sidebar-tab');

    interactiveButtons.forEach(btn => {
        btn.style.transition = 'all 0.4s ease';

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            btn.style.background = `radial-gradient(circle at ${x}% ${y}%, #4eba85, #296a4a)`;
            btn.style.color = 'whitesmoke';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = '';
            btn.style.color = '';
        });
    });


    //UNIVERSAL CLOSING OF ANYTHING MODAL WINDOW BY BLACK FON CLICK
    const modals = document.querySelectorAll('.modal');

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    });


    //---------------------------------------------------------
    // DYNAMIC SUBDOWNLOADING AND ADDING NOTES TO THE PROFILE (AJAX)
    //---------------------------------------------------------
    const notesContainer = document.getElementById('my-notes-list');
    const addNoteForm = document.getElementById('add-note-form');

    window.toggleNoteForm = function() {
        const formBlock = document.getElementById('quick-note-form-block');
        if (formBlock.style.display === 'none') {
            formBlock.style.display = 'block';
            document.getElementById('note-text-input').focus();
        } else {
            formBlock.style.display = 'none';
            addNoteForm.reset();
        }
    };

    async function loadNotes() {
        if (!notesContainer) return;

        try {
            const response = await fetch('/api/my-notes');
            const notes = await response.json();

            if (notes && notes.length > 0) {
                notesContainer.innerHTML = notes.map(note => `
                        <div id="note-block-${note.id}" class="note-card">
                            <div class="note-card-header">
                                <span class="note-badge">Заметка #${note.id}</span>
                                <button class="btn-delete-note-cross" onclick="deleteNote(${note.id})" title="Удалить заметку">
                                    &times;
                                </button>
                            </div>
                            <p class="note-card-text">${note.description}</p>
                        </div>
                    `).join('');
            } else {
                notesContainer.innerHTML = `
                <p class="empty-text">У вас пока нет заметок. Создайте первую!</p>
                `;
            }
        } catch (error) {
            console.error(error);
            notesContainer.innerHTML = `
            <p>Не удалось загрузить заметки =(</p>
            `;
        }
    }

    window.deleteNote = async function(noteId) {
        try {
            const response = await fetch(`/profile/note/${noteId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                const noteElement = document.getElementById(`note-block-${noteId}`);
                if (noteElement) {
                    noteElement.style.opacity = '0';
                    noteElement.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        loadNotes();
                    }, 300);
                }
            }  else {
                alert('Не удалось удалить заметку');
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при отправке запроса на сервер');
        }
    }

    if (addNoteForm) {
        addNoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const textInput = document.getElementById('note-text-input');

            try {
                const response = await fetch('/profile/note', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({description: textInput.value})
                });

                const data = await response.json();
                if (data.success) {
                    toggleNoteForm();
                    loadNotes();
                } else {
                    alert('Ошибка при сохранении заметки');
                }
            } catch (error) {
                console.error(error);
                alert('Сбой связи с сервером');
            }
        });
    }

    loadNotes();
});