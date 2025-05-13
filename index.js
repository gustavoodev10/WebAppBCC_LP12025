import express from 'express';
import session from 'express-session';
import verificarAutenticacao from './seguranca/autenticacao.js';

const host = "0.0.0.0";
const porta = 3000;
const app = express();

//Possibilitando a comunicação com estado (statefull)
app.use(session({
  secret:"M1nH4Ch4v3S3cR3t4",
  resave: true,
  saveUninitialized:false,
  cookie: {
    maxAge: 1000 * 60 * 15,
    httpOnly: true
  }

}));

//configurar o express para processar os parâmetros contidos na url
//qs -> true - mais poderosa para lidar com parâmetros da requisicao
//querystring

app.use(express.urlencoded({extended:true}));

//compartilhando publicamente os arquivos existentes na pasta "publico"
app.use(express.static("./publico")); //assets


app.post("/login",(requisicao, resposta) => {
  //desestruturação javascript
  const { usuario, senha } = requisicao.body;
  if (usuario == "admin" && senha == "admin"){
    requisicao.session.autenticado = true;
    resposta.redirect("/menu.html");
  }
  else{
    let conteudo = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/login.css"/>
    <link rel="stylesheet" href="/css/bootstrap.min.css"/>
    <title>Página de login</title>
    </head>
    <body>
    <div class="container">
    <div class="row">
    <div class="col-md-6 offset-md-3">
    <h2 class="text-center text-dark mt-5">Bem-vindo</h2>
    <div class="text-center mb-5 text-dark">Faça o login</div>
    <div class="card my-5">
    
    <form action="/login" method="POST" class="card-body cardbody-color p-lg-5">
    
    <div class="text-center">
    <img src="/imagens/login-avatar.webp" class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
    width="200px" alt="profile">
    </div>
    
    <div class="mb-3">
    <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}" aria-describedby="emailHelp"
    placeholder="usuário">
    </div>
    <div class="mb-3">
    <input type="password" class="form-control" id="senha" name="senha" placeholder="senha">
    </div>
    <div class="text-center"><button type="submit" class="btn btn-color px-5 mb-5 w-100">Login</button></div>
    </form>
    <div class="alert alert-danger">
    <p>Usuário ou senha incorretos!</p>
    </div>
    </div>
    
    </div>
    </div>
    </div>
    </body>
    </html>
    `;
    resposta.send(conteudo);
    resposta.end();
  }
});

app.use(verificarAutenticacao,express.static("./privado")); //assets
//Daqui para baixo só estará acessível mediante autenticação.

app.get('/logout',(requisicao,resposta)=>{
    requisicao.session.destroy(); //exclui a sessão de um usuário
    resposta.redirect("/login.html"); //lembre-se que esse recurso é público
});

app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);
});


