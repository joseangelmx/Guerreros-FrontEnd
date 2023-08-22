const endpoint = "https://localhost:7165/api/videogame/";
window.addEventListener('load', () => {
    const cardContainer = document.getElementById("cardContainer");
    const buttonModal = document.getElementById("buttonModal");
    const buttonCloseModal = document.getElementById("buttonCloseModal");
    const modal = document.getElementById("addGameModal");
    const form = document.getElementById('addGameForm');
    const editForm = document.getElementById('editGameForm');
    const editModal = document.getElementById('editGameModal');
    const buttonCloseEditModal = document.getElementById("buttonCloseEditModal");

    buttonModal.addEventListener('click', () => {
        modal.style.display = "block";
    });

    buttonCloseModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    buttonCloseEditModal.addEventListener('click', () => {
        editModal.style.display = "none";
    });

    function createCard(record) {
        const card = document.createElement("div");
        card.className = "col-xl-3 col-sm-6 mb-5";
        card.innerHTML = `
        <div class="bg-white rounded shadow-sm py-4 px-4 text-center">
        <i class="fa-solid fa-pen-to-square fa-xl d-flex justify-content-start align-items-start hand-pointer" onclick="editEntry(${record.id})"></i>
        <i class="fa-solid fa-trash fa-xl d-flex justify-content-end align-items-start hand-pointer" onclick="deleteEntry(${record.id})"></i>
        <br>
        <img src="https://img.freepik.com/free-vector/cute-astronaut-sitting-joystick-waving-hand-cartoon-vector-icon-illustration-science-technology-icon-concept_138676-6180.jpg?w=826&t=1692394480" alt="" width="100" class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"><br>
        <span class="small text-uppercase text-muted fw-bold">${record.title}</span><br>
        <span class="small text-uppercase text-muted">${truncateDescription(record.description)}</span><br>
        <span class="small text-uppercase text-muted fw-bold">${record.year}</span><br>
        <span class="small text-uppercase text-muted fw-bold">${record.genre}</span><br>
        <span class="small text-uppercase text-muted fw-bold">${record.publisher}</span><br>
    </div>
        `;
        return card;
    }
    

    function fetchAndRenderData() {
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    const noRecordsMessage = document.createElement('p');
                    noRecordsMessage.textContent = 'No records available.';
                    noRecordsMessage.style.color = "white";
                    noRecordsMessage.style.display = 'flex';
                    noRecordsMessage.style.justifyContent = 'center';
                    noRecordsMessage.style.height = '100vh';
                    cardContainer.appendChild(noRecordsMessage);
                } else {
                    data.forEach(record => {
                        const card = createCard(record);
                        cardContainer.appendChild(card);
                    });
                }
            })
            .catch(error =>{                        
                const noRecordsMessage = document.createElement('p');
            noRecordsMessage.textContent = 'ERROR IN THE SERVICE';
            noRecordsMessage.style.color = "white";
            noRecordsMessage.style.display = 'flex';
            noRecordsMessage.style.justifyContent = 'center';
            noRecordsMessage.style.height = '100vh';
            cardContainer.appendChild(noRecordsMessage);
        });
    }
    

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const game = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            year: parseInt(document.getElementById('year').value),
            genre: document.getElementById('genre').value,
            publisher: document.getElementById('publisher').value
        };

        // Fetch and add new game
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        })
            .then(response => response.json())
            .then(() => {
                modal.style.display = "none";
                location.reload();
            })
            .catch(error => {
                // Handle errors if necessary
            });
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const game = {
            id: document.getElementById('idInput').value,
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            year: parseInt(document.getElementById('editYear').value),
            genre: document.getElementById('editGenre').value,
            publisher: document.getElementById('editPublisher').value
        };

        // Fetch and update game
        fetch(endpoint + game.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        })
            .then(response => {
                if (response.ok) {

                    editModal.style.display = "none";
                    location.reload();
                } else {
                    console.log('cant update this recor');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    fetchAndRenderData();
    function truncateDescription(description) {
        const maxLength = 50;
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + "...";
        } else {
            return description;
        }
    }
    
});

function editEntry(id) {
    // Implementation here
    var time = document.getElementById("idInput");
    var title = document.getElementById("editTitle");
    var description = document.getElementById("editDescription");
    var year = document.getElementById("editYear");
    var genre = document.getElementById("editGenre");
    var publisher = document.getElementById("editPublisher");
    var modal = document.getElementById("editGameModal");
    
    fetch(endpoint + id)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('ERROR');
        }
    })
    .then(data => {
        time.value = data.id;
        title.value = data.title;
        description.value = data.description;
        year.value = data.year;
        genre.value = data.genre;
        publisher.value = data.publisher;
        modal.style.display = "block";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteEntry(recordId) {
    fetch(endpoint + recordId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // The record was deleted successfully, you can perform some actions after deletion
            console.log('Record deleted successfully');
            location.reload();
            // You can reload the page or update the list of records here if necessary
        } else {
            // Handle the case if the record couldn't be deleted
            console.log('Record deletion failed');
        }
    })
    .catch(error => {
        // Handle errors if necessary
        console.error('Error:', error);
    });
}
