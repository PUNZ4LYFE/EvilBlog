//console.log('pls work');

//Dependencias
var http = require('http'); //Así se importa un módulo de Node
var url = require('url');
var fs = require('fs');
const path = require('path');
var uniqid = require('uniqid');

//Variables
var port = 3000;
var localhost = 'localhost';

//var server = http.createServer(function(request, response){
//  response.end("Hola :'3");
//});

var server = http.createServer((request, response) => { //arrow function
    var parseUrl = url.parse(request.url, true);
    //console.log(parseUrl);
    var path = parseUrl.pathname;
    path = path.replace(/^\/+|\/+$/g, '');
    var method = request.method;

    var query = parseUrl.query;
    var headers = request.headers;

    switch (path) {
        case 'posts':
            switch (method) {
                case 'OPTIONS':
                    respondToOptions(request, response);
                 break;

                case 'GET':
                    getPosts(request, response);
                break;

                case 'POST':
                    postPosts(request, response);
                    break;

                case 'PATCH':
                    updatePost(request, response);
                break;

                case 'DELETE':
                    deletePost(request, response, parseUrl.query.key);
                break;

                default:
                    send404(request, response);
                break;
            }
            break;
    }

});



server.listen(port, localhost, function () {
    console.log('El servidor está corriendo :3');
});

//function requestListener(request, response){
//  response.end("Hola :'3");
//}

function addCrossHeaders(request, response) {
    var origin = '*';

    if (request.headers['origin']) {
        origin = request.headers['origin'];
    }
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'access-control-allow-credentials');
    response.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin');
}

function loadPosts() {
    return new Promise(loadPostsPromiseExecuter);
}

function loadPostsPromiseExecuter(resolve, reject) {
    fs.readFile(path.resolve(process.cwd(), './data/posts.json'), function (err, data) {
        if (err) {
            //reject();
        } else {
            var postsData = JSON.parse(data);
            var posts = postsData['posts'];
            //console.log(posts);
            resolve(posts);
        }
    });
}

function savePosts(posts){
    return new Promise(function(resolve, reject){
        fs.writeFile(path.resolve(process.cwd(), './data/posts.json'), JSON.stringify(posts), function (err){
            if(err){

            } else {
                resolve();
            }
        })
    });
}

function getPosts(request, response){
    setResponseHeaders(request, response);
    loadPosts().then(function(posts){
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(posts));
        response.end();
    }).catch(function(){
        send404(request, response)
    });
}

function respondToOptions(request, response) {
    setResponseHeaders(request, response);
    response.writeHead(200);
    response.end();
}

function setResponseHeaders(request, response) {

    var origin = '*';
    if(request.headers['origin']){
        origin = request.headers['origin'];
    }

    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    if (request.headers['content-type']) {
        response.setHeader('Content-Type', request.headers['content-type'])
    }
    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Content-Type');
}

function send404(request, response) {
    setResponseHeaders(request, response);
    response.writeHead(404, {'Content-Type': 'application/json'});
    response.end();
}

function postPosts(request, response){
    setResponseHeaders(request, response);
    let buffer = [];
    let post = null;

    request.on('data', function (chunk) {
        buffer.push(chunk);
    });
        
    request.on('end', function () {
        buffer = Buffer.concat(buffer).toString();
        post = JSON.parse(buffer);

        loadPosts().then(function (posts){
            posts[uniqid()] = post;
            savePosts(posts).then(function(){
                response.writeHead(200);
                response.end();
            }).catch(function (){
                send404(request, response);
            });
        }).catch(function(){
            send404(request, response);
        });

        });
}

function savePosts(posts){
    return new Promise(function(resolve, reject){
        fs.writeFile(path.resolve(process.cwd(), './data/posts.json'), JSON.stringify(posts), function(err){
            if(err){

            } else {
                resolve();
            }
        })
    });
}

function updatePost(request, response){
    setResponseHeadder(request, response);

    let buffer = [];
    let post = null;

    request.on('data', function (chunk){
        buffer.push(chunk);
    });
    request.on('end', function(){
        buffer = Buffer.concat(buffer).toString();
        post = JSON.parse(buffer);

        loadPosts().then(function(posts){
            for (const key in posts){
                for (const keyToUpdate in post){
                    if(key === keyToUpdate){
                        posts[key] = post[key];
                    }
                }
            }

            savePosts(posts).then(function(){
                response.writeHead(200);
                response.end();
            }).catch(function(){
                send404(request, response);
            });

        });
    });
}

function deletePost(request, response, key){
    setResponseHeaders(request, response);
    loadPosts.then(function(){
        delete posts[key];

        savePosts(posts).then(function(){
            response.writeHead(200);
            response.end();
        }).catch(function(){
            send404(request, response);
        });
    }).catch(function(){
        send404(request, response);
    });
}