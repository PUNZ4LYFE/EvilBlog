window.addEventListener('load', init, false);

function init() {
    var url = 'http://localhost:3000';
    var owner = 'Karla';
    var posts = [];
    var selectedPostIU = null;
    requestAllPosts();
    document.getElementById('botonPost').addEventListener('click', postPost);
    document.getElementById('botonBorrar').onclick = borrarPost;
    document.getElementById('botonUpdate').onclick = updatePost;
    document.getElementById('botonComentar').onclick = crearComment;

    function onClickSelectPost(event) {
        if (selectedPostIU !== null) {
            removeSelected();
        }
        selectedPostIU = event.target;
        event.srcElement.classList.remove('postStyle');
        event.srcElement.classList.add('selected');
        document.getElementById('titulo').value = selectedPostIU.post.title;
        document.getElementById('cuerpo').value = selectedPostIU.post.body;
        //console.log(selectedPostIU.PostIU);
    }

    function removeSelected(event) {
        selectedPostIU.classList.remove('selected');
        selectedPostIU.classList.add('postStyle');
    }

    function requestAllPosts() {
        var request = new XMLHttpRequest();
        request.open('GET', url + '/posts', true);
        request.setRequestHeader('Access-Control-Allow-Origin', '*'); //solicitar permiso porque viene de otro dominio
        request.onreadystatechange = requestAllPostsCallback;
        request.send();
    }

    function requestAllPostsCallback(event) {
        var request = event.target;
        switch (request.readyState) {
            case XMLHttpRequest.DONE:
                switch (request.status) {
                    case 200:
                        posts = [];
                        document.getElementById('HTMLBody').innerText = '';
                        //console.log(request.responseText);
                        var postsData = JSON.parse(request.responseText);
                        for (const key in postsData) {
                            var postData = postsData[key];
                            var editable = false;
                            if (postData.owner === owner) {
                                editable = true;
                            }
                            var post = new Post(key, postsData[key].title, postsData[key].body,
                                postsData[key].owner, postsData[key].timestamp, editable);
                            posts.push(post);
                            crearPostUI(post);

                        }
                        break;
                }
        }

    }

    function crearPostUI(post) {
        var nuevaInterfaz = new PostIU(post);
        //console.log(post.fbkey);
        nuevaInterfaz.container.setAttribute("id", post.fbkey);
        //console.log(nuevaInterfaz.container.id);
        nuevaInterfaz.container.onclick = onClickSelectPost;
    }


    function postPost(event) {
        var titulo = document.getElementById('titulo').value;
        var cuerpo = document.getElementById('cuerpo').value;
        var timestamp = new Date();
        var post = new Post(null, titulo, cuerpo, owner, timestamp, true);
        var request = new XMLHttpRequest();
        request.open('POST', url + '/posts', true);
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        request.onreadystatechange = sendPostCallback;
        request.send(JSON.stringify(post));
        document.getElementById('titulo').value = '';
        document.getElementById('cuerpo').value = '';
    }

    function sendPostCallback(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            }
        }
    }

    function borrarPost() {
        var request = new XMLHttpRequest;
        request.open('DELETE', url + '/posts', true);
        request.onreadystatechange = deletePostCallback;
        request.send();
        document.getElementById('titulo').value = '';
        document.getElementById('cuerpo').value = '';

    }

    function deletePostCallback(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            }
        }
    }

    function updatePost(event) {
        var timestamp = new Date();
        var request = new XMLHttpRequest();
        request.open('PATCH', url + '/posts', true);
        request.onreadystatechange = updatePostCallBack;
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        var post = '{ "key":' + JSON.stringify(selectedPostIU.post.fbkey)
            + ', "title":' + JSON.stringify(document.getElementById('titulo').value)
            + ', "body":' + JSON.stringify(document.getElementById('cuerpo').value)
            + ', "owner":' + JSON.stringify(owner)
            + ', "timestamp":' + JSON.stringify(timestamp) + '}';
        console.log(post);
        request.send(post);
        document.getElementById('titulo').value = '';
        document.getElementById('cuerpo').value = '';
    }

    function updatePostCallBack(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            }
        }
    }

    function crearComment(event) {
        var post = selectedPostIU.post;
        var body = document.getElementById('comentario').value;
        var timestamp = new Date();
        var comentarioCreado = new Comment(null, body, owner, timestamp, post.fbkey, post);
        console.log(comentarioCreado);
        crearCommentIU(comentarioCreado);

        var body = document.getElementById('comentario').value = '';
    }

    function crearCommentIU(comentario) {
        var containerTargetId = selectedPostIU.post.fbkey;
        var timestamp = new Date();
        var commentUI = new CommentIU(comentario, containerTargetId, timestamp);
    }
}
