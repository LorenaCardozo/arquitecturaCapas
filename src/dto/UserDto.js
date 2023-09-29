export default class UserDTO {
    constructor(user) {
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
    }
}

export function createUserDTO(reqUser) {

    ///console.log(reqUser);

    if (!reqUser) {
        return null;
    }
    const userDTO = new UserDTO(reqUser);
    return userDTO;
}