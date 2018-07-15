class Comment {
	constructor(fbkey, pbody, powner, ppostKey, ptimestamp, ppost) {
        this.fbkey = fbkey;
        this.body = pbody;
        this.owner = powner;
        this.postKey = ppostKey;
        this.post = ppost;
        if(ptimestamp==null){     
                this.timestamp = new Date();
        } else{
                this.timestamp = new Date(ptimestamp);

        }
	}

	
}