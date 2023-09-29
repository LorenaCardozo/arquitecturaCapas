import UserDTO, { createUserDTO } from '../dto/UserDto.js';

async function getUserDTO(req, res) {
    if (!req.user) {
        res.status(401).json({ message: 'No hay usuario autenticado' });
        return;
    }

    // Utiliza createUserDTO para crear un DTO a partir de req.user
    const userDTO = createUserDTO(req.user);

    if (!userDTO) {
        res.status(400).json({ message: 'Error al crear el DTO de usuario' });
        return;
    }

    // Envía el DTO de usuario como respuesta
    res.json(userDTO);
}

export {getUserDTO}

