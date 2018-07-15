class CommentIU {
	constructor(post, containerId, timestamp) {
        this.post = post;

        this.container = document.createElement('div');
        this.body = document.createElement('p');
        this.footer = document.createElement('p');

        this.container.appendChild(this.body);
        this.container.appendChild(this.footer);

        this.body.innerText = this.post.body;

        this.footer.innerText = this.post.owner + ' ' + '-' + ' ' + timestamp.getDate() + '/' +
        (timestamp.getMonth() + 1) + '/' + timestamp.getFullYear();

        this.container.classList.add('comment');
        this.container.post = this.post;
        document.getElementById(containerId).appendChild(this.container);
	}

	
}