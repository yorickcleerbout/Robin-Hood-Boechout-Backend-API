class User {
    constructor(id, firstName, lastName, email, password, salt, role) {
        (this.id = id),
        (this.firstName = firstName),
        (this.lastName = lastName),
        (this.email = email),
        (this.password = password)
        (this.salt = salt),
        (this.role = role);
    }
}

export default User;