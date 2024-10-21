class Subscriber {
    constructor(id, email, uuid, confirmed_at) {
        (this.id = id),
        (this.email = email),
        (this.uuid = uuid),
        (this.confirmed_at = confirmed_at);
    }
}

export default Subscriber;