document.addEventListener('DOMContentLoaded', () => {
  const token = getTokenFromCookie(); // Obtener el token de la cookie

  if (token) {
      window.location.href = 'videogames.html'; // Redirigir a la página de videojuegos
  }
});

document.getElementById("registration-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Evitar que el formulario se envíe de manera predeterminada

  const phoneNumber = document.getElementById("phoneNumber").value;
  const password = document.getElementById("pass").value;
  const email = document.getElementById("email").value;

  // Validación del número de teléfono
  if (phoneNumber.length < 10) {
      alert("El número de teléfono debe contener al menos 10 caracteres.");
      return;
  }

  // Validación de la contraseña
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
      alert("La contraseña debe contener al menos 8 caracteres, una letra, un número y un carácter especial (@ $ ! % * # ? &)");
      return;
  }

  const userData = {
      phoneNumber: phoneNumber,
      password: password,
      email: email
  };

  fetch("https://localhost:7165/api/users/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
      // Manejar la respuesta del servidor si es necesario
      alert("Usuario Registrado, ahora inicia sesion");
      location.reload();
  })
  .catch(error => {
      alert("Error registrando el usuario");
  });
});




  document.getElementById("signin-button").addEventListener("click", function() {
    const username = document.getElementById("emailLog").value;
    const password = document.getElementById("passwordLog").value;

    const loginData = {
        username: username,
        password: password
    };

    fetch("https://localhost:7165/api/auth/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Inicio de sesión fallido");
        }
        return response.text(); // Obtener el token como texto
    })
    .then(token => {
        // Guardar el token en el almacenamiento local (localStorage, sessionStorage)
        const expirationDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
        document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; SameSite=None; Secure; path=/`;
        // Redireccionar si el inicio de sesión es exitoso
        window.location.href = "http://localhost:8080/videogame/videogames.html"; // Cambiar por la URL real
    })
    .catch(error => {
        console.error("Error:", error);
        // Aquí podrías mostrar un mensaje de error en tu página
    });
});
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
