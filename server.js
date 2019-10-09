let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')

var LOCAL_PORT = 3000

let app = express()
let db

app.use(express.static('public'))

let connectionString = 'mongodb://localhost:27017/TodoApp'

// let connectionString = 'mongodb+srv://nacho:klingon@platzi-g8u7b.mongodb.net/TodoApp?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()

  app.listen(process.env.PORT || LOCAL_PORT, function () {
    console.log(`http://localhost:${LOCAL_PORT}`)
  })

})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next){
  res.set('WWW-Authenticate','Basic realm="Simple Todo App"')
  // console.log(req.headers.authorization) // para campturar la usuario y contrasenya
 if (req.headers.authorization == "Basic bmFjaG86YXJtYWR1cmE="){
  next()
 } else {
  res.status(401).send("Se necesita autentificarse")
 }
}

app.use(passwordProtected)

app.get('/', function(req, res) {
db.collection('items').find().toArray(function(err, items) {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">Que hace falta</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">
          
    </ul>
    
  </div>
  <script>
  let items = ${JSON.stringify(items)}
  </script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
</body>
</html>`)
})
})

app.post('/create-item', function(req, res) {
  let safeText =sanitizeHTML(req.body.text, {allowedTags:[],allowedAttributes:{}})
  db.collection('items').insertOne({text: safeText}, function(err, info) {
    res.json(info.ops[0])
  })
  // console.log(req.body.item) // localiza lo que se escribe en el elemento item del formulario
})

app.post('/update-item', function(req, res) {
  let safeText =sanitizeHTML(req.body.text, {allowedTags:[],allowedAttributes:{}})
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res){
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)} ,function(){
    res.send("Exito")
  })
})