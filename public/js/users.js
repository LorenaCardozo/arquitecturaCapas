document.querySelectorAll('.adm-user').forEach(button => {
    button.addEventListener('click', MostrarUsuarios);
});

document.querySelectorAll('.adm-user_role').forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');
        const currentRole = this.getAttribute('data-current-role');

        changeUserRole(userId, currentRole);
    });
});


document.querySelectorAll('.adm-user_delete').forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');

        deleteUser(userId);
    });
});

function MostrarUsuarios(event) {
        // Redirigir 
        window.location.href = `/api/users`;
}

function changeUserRole(userId, currentRole) {
    const newRole = currentRole === 'user' ? 'premium' : 'user';
    
    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta del servidor, si es necesario
        console.log(data);
        // Recargar la página o actualizar la lista de usuarios
        location.reload();
    })
    .catch(error => {
        console.error('Error al cambiar el rol:', error);
    });
}


function deleteUser(userId) {
    
    fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Recargar la página o actualizar la lista de usuarios
        location.reload();
    })
    .catch(error => {
        console.error('Error al eliminar el usuario:', error);
    });
}