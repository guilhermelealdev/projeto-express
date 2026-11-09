
const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const banco = new DatabaseSync("banco.db");

app.use(express.json());
app.use(express.static("public"));

banco.exec(`
  CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    genero TEXT
  )
`);

// LISTAR
app.get("/jogos", (req, res) => {
  const jogos = banco.prepare("SELECT * FROM jogos").all();
  res.json(jogos);
});

// CADASTRAR
app.post("/jogos", (req, res) => {
  const { nome, genero } = req.body;

  banco.prepare("INSERT INTO jogos (nome, genero) VALUES (?, ?)")
    .run(nome, genero);

  res.json({ mensagem: "Jogo cadastrado!" });
});

// EDITAR
app.put("/jogos/:id", (req, res) => {
  const { nome, genero } = req.body;

  banco.prepare("UPDATE jogos SET nome = ?, genero = ? WHERE id = ?")
    .run(nome, genero, req.params.id);

  res.json({ mensagem: "Jogo atualizado!" });
});

// EXCLUIR
app.delete("/jogos/:id", (req, res) => {
  banco.prepare("DELETE FROM jogos WHERE id = ?")
    .run(req.params.id);

  res.json({ mensagem: "Jogo excluído!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});