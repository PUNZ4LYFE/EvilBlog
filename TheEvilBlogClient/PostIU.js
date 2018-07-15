class PostIU {
	constructor(post) {
        this.post = post;
        this.postUIkey = post.fbkey;

        this.container = document.createElement('div');
        this.title = document.createElement('h2');
        this.body = document.createElement('p');
        this.timestamp = document.createElement('p');

        this.container.appendChild(this.title);
        this.container.appendChild(this.body);
        this.container.appendChild(this.timestamp);

        this.title.innerText = this.post.title;
        this.body.innerText = this.post.body;
        this.timestamp.innerText = this.post.owner + ' ' + '-' + ' ' + this.post.timestamp.getDate() + '/' +
         (this.post.timestamp.getMonth() + 1) + '/' + this.post.timestamp.getFullYear();

        this.container.classList = 'postStyle';
        if(this.post.editable == true){
                this.container.classList.add('editable');
        }

        this.container.post = this.post;
        document.getElementById('HTMLBody').appendChild(this.container);
	}

	
}