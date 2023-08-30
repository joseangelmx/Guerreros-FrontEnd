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
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', () => {
        // Borrar la cookie
        deleteCookie('token');

        // Redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
    });

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
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
        const token = getTokenFromCookie(); // Obtener el token de la cookie
    
        fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el token al encabezado
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            return response.json();
        })
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
        .catch(error => {                        
            const noRecordsMessage = document.createElement('p');
            noRecordsMessage.textContent = 'ERROR IN THE SERVICE';
            noRecordsMessage.style.color = "white";
            noRecordsMessage.style.display = 'flex';
            noRecordsMessage.style.justifyContent = 'center';
            noRecordsMessage.style.height = '100vh';
            console.log(token);
            cardContainer.appendChild(noRecordsMessage);
        });
    }
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const game = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            year: parseInt(document.getElementById('year').value),
            genre: document.getElementById('genre').value,
            publisher: document.getElementById('publisher').value
        };
    
        const token = getTokenFromCookie(); // Obtener el token de la cookie
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Agregar el token al encabezado
                },
                body: JSON.stringify(game)
            });
    
            if (response.ok) {
                modal.style.display = "none";
                location.reload();
            } else {
                // Manejar el caso si no se pudo agregar el nuevo juego
            }
        } catch (error) {
            // Manejar errores si es necesario
            console.error('Error:', error);
        }
    });
    

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const game = {
            id: document.getElementById('idInput').value,
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            year: parseInt(document.getElementById('editYear').value),
            genre: document.getElementById('editGenre').value,
            publisher: document.getElementById('editPublisher').value
        };
    
        const token = getTokenFromCookie(); // Obtener el token de la cookie
        
        try {
            const response = await fetch(endpoint + game.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Agregar el token al encabezado
                },
                body: JSON.stringify(game)
            });
    
            if (response.ok) {
                editModal.style.display = "none";
                location.reload();
            } else {
                console.log('No se pudo actualizar este registro');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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

    const token = getTokenFromCookie(); // Obtener el token de la cookie
    
    fetch(endpoint + id, {
        headers: {
            'Authorization': `Bearer ${token}` // Agregar el token al encabezado
        }
    })
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
    const token = getTokenFromCookie(); // Obtener el token de la cookie

    // Mostrar ventana de confirmación
    const isConfirmed = confirm('¿Estás seguro de que deseas eliminar este registro?');

    if (isConfirmed) {
        fetch(endpoint + recordId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Agregar el token al encabezado
            }
        })
        .then(response => {
            if (response.ok) {
                // El registro se eliminó correctamente, puedes realizar algunas acciones después de la eliminación
                console.log('Registro eliminado correctamente');
                location.reload();
                // Puedes recargar la página o actualizar la lista de registros aquí si es necesario
            } else {
                // Manejar el caso en que no se pudo eliminar el registro
                console.log('Fallo en la eliminación del registro');
            }
        })
        .catch(error => {
            // Manejar errores si es necesario
            console.error('Error:', error);
        });
    }
}


function getTokenFromCookie() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'token') {
            return value;
        }
    }
    return null;
}

const passwordInput = document.getElementById('pass');
const passwordValidation = document.getElementById('passwordValidation');

passwordInput.addEventListener('input', function () {
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (passwordRegex.test(password)) {
        passwordValidation.textContent = '';
    } else {
        passwordValidation.textContent = 'La contraseña debe contener al menos 8 caracteres, una letra, un número y un carácter especial (@ $ ! % * # ? &)';
    }
});