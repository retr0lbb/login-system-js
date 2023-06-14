const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'loginJs'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados');
});

app.use(express.json());

//registro
app.post('/register', (req, res) => {
  const { user_name, user_pass } = req.body;
  const hashedPassword = bcrypt.hashSync(user_pass, 10);

  db.query('INSERT INTO usuarios (user_name, user_pass) VALUES (?, ?)', [user_name, hashedPassword], (err) => {
    if (err) {
      res.status(500).send('Erro no registro de usuários');
      console.log(err)
    } else {
      res.status(200).send('Usuário cadastrado com sucesso');
    }
  });
});

app.post('/login', (req, res) => {
  const { user_name, user_pass } = req.body;

  db.query('SELECT * FROM usuarios WHERE user_name = ?', [user_name], (err, results) => {
    if (err) {
      res.status(500).send('Erro ao realizar login');
    } else if (results.length === 0) {
      res.status(401).send('Usuário não encontrado');
    } else {
      const user = results[0];


      bcrypt.compare(user_pass, user.user_pass, (err, result) => {
        if (err) {
            console.error(err);
            res.end("Erro não especificado");
        }else if(result){
            res.status(200).send('Login sucesso');
            console.log('sucesso no login')
        }else{
            res.status(201).send("Senha ou algo incorreto");
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});