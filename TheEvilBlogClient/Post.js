class Post {
	constructor(fbkey, ptitle, pbody, powner, ptimestamp, peditable) {
        this.fbkey = fbkey;
        this.title = ptitle;
        this.body = pbody;
        this.owner = powner;
        this.editable = peditable;
        if(ptimestamp==null){     
                this.timestamp = new Date();
        } else{
                this.timestamp = new Date(ptimestamp);

        }
	}

	
}