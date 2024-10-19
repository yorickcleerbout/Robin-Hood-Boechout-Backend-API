class Post {
    constructor(id, slug, post_details, tag, created_at, author, featured) {
        (this.id = id),
        (this.slug = slug),
        (this.post_details = post_details),
        (this.tag = tag),
        (this.created_at = created_at),
        (this.author = author),
        (this.featured = featured);
    }
}

export default Post;