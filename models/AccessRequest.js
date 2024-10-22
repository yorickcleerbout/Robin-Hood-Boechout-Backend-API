class AccessRequest {
    constructor(id, email, requested_at, granted_at, revoked_at) {
        (this.id = id),
        (this.email = email),
        (this.requested_at = requested_at),
        (this.granted_at = granted_at),
        (this.revoked_at = revoked_at);
    }
}

export default AccessRequest;