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

    //---------------------------------------------------------
    // DYNAMIC SUBDOWNLOADING OF PERSONAL DOCUMENTS TO THE PROFILE (AJAX)
    //---------------------------------------------------------
    const profileDocsContainer = document.getElementById('my-profile-documents-list');
    async function loadProfileDocuments() {
        if (!profileDocsContainer) return;

        try {
            const response = await fetch('/api/my-documents');
            const docs = await response.json();

            if (docs && docs.length > 0) {
                profileDocsContainer.innerHTML = docs.map(doc => {
                    let displayName = 'Документ #' + doc.id;
                    let privacyLabel = 'public';

                    if (doc.type_of_document && doc.type_of_document.includes(':')) {
                        const parts = doc.type_of_document.split(':');
                        if (parts[0] === 'private') privacyLabel = 'private';
                        if (parts[1]) displayName = parts[1];
                    } else if (doc.type_of_document === 'private') {
                        privacyLabel = 'private';
                    }

                    return `
                    <div class="profile-doc-row" id="doc-block-${doc.id}">
                        <div class="profile-doc-info">
                            <img src="media/file-icon.png" alt="Doc" class="profile-doc-icon">
                            <div class="profile-doc-meta">
                                <span class="profile-doc-name">${displayName}</span>
                                <span class="profile-doc-badge ${privacyLabel}">${privacyLabel}</span>
                            </div>
                        </div>
                        <div class="profile-doc-actions">
                            <a href="/document/download/${doc.id}" class="btn-profile-download" title="Скачать файл">
                                Скачать
                            </a>
                            <button class="btn-delete-doc-cross" onclick="deleteProfileDocument(${doc.id})" title="Удалить документ">&times;</button>
                        </div>
                    </div>
                    `;
                }).join('');
            } else {
                profileDocsContainer.innerHTML = '<p class="empty-text">Вы еще не загружали учебные материалы</p>';
            }
        } catch (error) {
            console.error(error);
            profileDocsContainer.innerHTML = '<p class="error-text">Не удалось загрузить документы</p>';
        }
    }

    window.deleteProfileDocument = async function(docId) {
        try {
            const response = await fetch(`/document/delete/${docId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                const docElement = document.getElementById(`doc-block-${docId}`);
                if (docElement) {
                    docElement.style.opacity = '0';
                    docElement.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        loadProfileDocuments();
                    }, 300);
                }
            } else {
                alert('Не удалось удалить документ');
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при отправке запроса на сервер');
        }
    };

    loadProfileDocuments();

    //---------------------------------------------------------
    // ASYNC POST COMMENT WITHOUT RELOAD PAGE (AJAX)
    //---------------------------------------------------------
    const addCommentForm = document.getElementById('add-comment-form');

    if (addCommentForm) {
        addCommentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const topicId = document.getElementById('modal-topic-id').value;
            const commentInput = document.getElementById('comment-text-input');

            try {
                const response = await fetch('/api/comment', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        topicId: topicId,
                        description: commentInput.value
                    })
                });

                const data = await response.json();

                if (data.success) {
                    commentInput.value = '';

                    if (typeof openTopic === 'function') {
                        const topicName = document.getElementById('modal-topic-title').textContent;
                        openTopic(topicId, topicName);
                    }
                } else {
                    alert('Не удалось отправить комментарий');
                }
            } catch (error) {
                console.error(error);
                alert('Ошибка связи с сервером');
            }
        });
    }

    //---------------------------------------------------------
    // AUTOMATIC MASK FOR TEL INPUT FIELD
    //---------------------------------------------------------
    const phoneInput = document.getElementById('phone-input');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let input = e.target.value.replace(/\D/g, '');

            if (input.startsWith('7') || input.startsWith('8')) {
                input = input.substring(1);
            }

            let formatted = '+7 ';
            if (input.length > 0) {
                formatted += '(' + input.substring(0, 3);
            }
            if (input.length >= 4) {
                formatted += ') ' + input.substring(3, 6);
            }
            if (input.length >= 7) {
                formatted += '-' + input.substring(6, 8);
            }
            if (input.length >= 9) {
                formatted += '-' + input.substring(8, 10);
            }

            e.target.value = input.length === 0 ? '' : formatted;
        });
    }

    //---------------------------------------------------------
    // MODERATION OF PENDING EVENTS IN THE ADMIN PROFILE (AJAX)
    //---------------------------------------------------------
    const pendingContainer = document.getElementById('admin-pending-list');

    async function loadPendingEvents() {
        if (!pendingContainer) return;

        try {
            const response = await fetch('/api/pending-events');
            const events = await response.json();

            if (events && events.length > 0) {
                pendingContainer.innerHTML = events.map(ev => {
                    const safeDesc = (ev.description || '').replace(/'/g, "\\'");

                    return `
                        <div class="pending-card" id="event-block-${ev.journal_id}">
                            <div class="pending-card-body">
                                <h4>${ev.name}</h4>
                                <p class="pending-time"><strong>Время:</strong> ${ev.start_date} — ${ev.end_date}</p>
                                <p class="pending-desc">${ev.description || 'Описание отсутствует.'}</p>
                            </div>
                            <div class="pending-card-actions">
                                <button class="btn-approve" onclick="moderateEvent(${ev.journal_id}, 'approve', {name: '${ev.name}', start_date: '${ev.start_date}', end_date: '${ev.end_date}', description: '${safeDesc}'})">Одобрить</button>
                                <button class="btn-reject" onclick="moderateEvent(${ev.journal_id}, 'reject')">Отклонить</button>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                pendingContainer.innerHTML = '<p class="empty-text">Новых предложенных событий пока нет.</p>'
            }
        } catch (error) {
            console.error(error);
            pendingContainer.innerHTML = '<p class="error-text">Не удалось загрузить список предложенных событий.</p>';
        }
    }

    window.moderateEvent = async function(eventId, action, eventData = {}) {
        try {
            let response;
            
            if (action === 'approve') {
                response = await fetch('/admin/calendar/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        journalId: eventId,
                        name: eventData.name,
                        start_date: eventData.start_date,
                        end_date: eventData.end_date,
                        description: eventData.description
                    })
                });
            } else {
                response = await fetch(`/admin/calendar/reject/${eventId}`, {
                    method: 'DELETE'
                });
            }

            let isSuccess = response.ok;
            
            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const data = await response.json();
                isSuccess = data.success;
            }

            if (isSuccess) {
                const element = document.getElementById(`event-block-${eventId}`);
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        loadPendingEvents();
                    }, 300);
                }
            } else {
                alert('Не удалось выполнить модерацию');
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка связи с сервером');
        }
    };

    loadPendingEvents();

    //---------------------------------------------------------
    // VALIDATION OF PENDING EVENTS FORM
    //---------------------------------------------------------
    const suggestForm = document.getElementById('suggest-event-form');
    const startInput = document.getElementById('event-start');
    const endInput = document.getElementById('event-end');

    if (suggestForm && startInput && endInput) {
        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);

        startInput.min = localISOTime;

        startInput.addEventListener('change', () => {
            endInput.min = startInput.value;
        });

        suggestForm.addEventListener('submit', (e) => {
            const startDate = new Date(startInput.value);
            const endDate = new Date(endInput.value);

            if (endDate <= startDate) {
                e.preventDefault();
                alert('Ошибка: Дата окончания события должна быть позже даты его начала!');
            }
        });
    }

    //---------------------------------------------------------
    // DELETE DOCUMENT BY ADMIN FROM PUBLIC LIST (AJAX)
    //---------------------------------------------------------
    window.adminDeleteDocument = async function(docId) {
        try {
            const response = await fetch(`/document/delete/${docId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const docElement = document.getElementById(`global-doc-block-${docId}`);
                if (docElement) {
                    docElement.style.opacity = '0';
                    docElement.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        docElement.remove();
                    }, 300);
                }
            } else {
                alert('Не удалось удалить документ (ошибка сервера)');
            }
        } catch (error) {
            console.error("Delete document by admin error", error);
            alert('Ошибка связи с сервером');
        }
    }

    //---------------------------------------------------------
    // ASYNC DELETE COMMENT BY ADMIN (AJAX)
    //---------------------------------------------------------
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete-comment-cross')) {
            const button = e.target;
            const commentId = button.getAttribute('data-id');

            try {
                const response = await fetch(`/admin/comment/delete/${commentId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (data.success) {
                    const commentElement = document.getElementById(`comment-block-${commentId}`);
                    if (commentElement) {
                        commentElement.style.opacity = '0';
                        commentElement.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            commentElement.remove();
                        }, 300);
                    }
                } else {
                    alert('Не удалось удалить комментарий');
                }
            } catch (error) {
                console.error('Delete comment by admin error:', error);
                alert('Ошибка связи с сервером');
            }
        }
    });

    //---------------------------------------------------------
    // AUTOMATIC SEARCH AND FILTRATION TOPICS ON THE FORUM (UX)
    //---------------------------------------------------------
    window.filterForumTopics = function() {
        const query = document.getElementById('forum-search').value.toLowerCase();
        
        const topicCards = document.querySelectorAll('.forum-grid .topic-card');

        topicCards.forEach(card => {
            const titleElement = card.querySelector('.topic-title');
            const metaElement = card.querySelector('.topic-meta');
            
            const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
            const metaText = metaElement ? metaElement.textContent.toLowerCase() : '';

            if (titleText.includes(query) || metaText.includes(query)) {
                card.style.display = 'flex'; 
            } else {
                card.style.display = 'none';
            }
        });
    };

    //---------------------------------------------------------
    // DOCUMENT REPORT BY STUDENT FUNCTIONAL (AJAX)
    //---------------------------------------------------------
    const complaintModal = document.getElementById('complaint-modal');
    const complaintForm = document.getElementById('complaint-form');

    window.reportDocument = function(docId, docName) {
        if (!complaintForm) return;
        document.getElementById('complaint-doc-id').value = docId;
        document.getElementById('complaint-doc-title').textContent = docName;
        complaintModal.style.display = 'flex';
    };

    if (complaintForm) {
        complaintForm.addEventListener('submit', async (e) => {
            const docId = document.getElementById('complaint-doc-id').value;
            const reason = document.getElementById('complaint-reason').value;

            try {
                const response = await fetch('/document/report', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        documentId: docId,
                        reason: reason
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Ваша жалоба успешно отправлена модераторам на рассмотрение!');
                    complaintModal.style.display = 'none';
                    complaintForm.reset();
                } else {
                    alert('Не удалось отправить жалобу');
                }
            } catch (error) {
                console.error(error);
                alert('Ошибка связи с сервером');
            }
        })
    }

    //---------------------------------------------------------
    // MODERATE DOCUMENT REPORT BY STUDENT IN THE ADMIN PROFILE (AJAX)
    //---------------------------------------------------------
    const complaintsContainer = document.getElementById('admin-complaints-list');

    async function loadAdminComplaints() {
        if (!complaintsContainer) return;

        try {
            const response = await fetch('/admin/complaints-events');
            const complaints = await response.json();

            if (complaints && complaints.length > 0) {
                complaintsContainer.innerHTML = complaints.map(c => `
                    <div class="complaint-card" id="complaint-row-${c.journal_id}">
                        <div class="complaint-card-body">
                            <h4>Жалоба на Документ #${c.document_id}</h4>
                            <p class="complaint-reason-text"><strong>Причина:</strong> <span class="reason-highlight">${c.reason}</span></p>
                            <p class="complaint-meta-date">Отправил Студент #${c.student_id} | ${c.timestamp}</p>
                        </div>
                        <div class="complaint-card-actions">
                            <button class="btn-complaint-delete-doc" onclick="processComplaint(${c.journal_id}, ${c.document_id}, 'delete')">Удалить файл</button>
                            <button class="btn-complaint-reject" onclick="processComplaint(${c.journal_id}, ${c.document_id}, 'reject')">Отклонить</button>
                        </div>
                    </div>
                `).join('');
            } else {
                complaintsContainer.innerHTML = '<p class="empty-text">Жалоб от студентов пока нет. На сайте порядок!</p>';
            }
        } catch (err) {
            console.error(err);
            complaintsContainer.innerHTML = '<p class="error-text">Не удалось загрузить список жалоб.</p>';
        }
    }

    window.processComplaint = async function(journalId, docId, action) {
        try {
            let response;
            if (action === 'delete') {
                response = await fetch(`/document/delete/${docId}`, { method: 'DELETE' });
                
                if (response.ok) {
                    await fetch(`/admin/complaint/reject/${journalId}`, { method: 'DELETE' });
                }
            } else {
                response = await fetch(`/admin/complaint/reject/${journalId}`, { method: 'DELETE' });
            }

            if (response.ok) {
                const element = document.getElementById(`complaint-row-${journalId}`);
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        loadAdminComplaints();
                    }, 300);
                }
            } else {
                alert('Не удалось выполнить действие');
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка связи с сервером');
        }
    };

    loadAdminComplaints();
});