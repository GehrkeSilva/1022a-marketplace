import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';



const app = express();
app.use(express.json());
app.use(cors());

// Configuração da conexão com o banco
const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.dbhost || "mysq-marketplace-projeto-69.c.aivencloud.com",
    user: process.env.dbuser || "avnadmin",
    password: process.env.dbpassword || "AVNS_gyfqNavqN5EDMFzAwmj",
    database: process.env.dbname || "defaultdb",
    port: process.env.dbport ? parseInt(process.env.dbport) : 27925,
  });
};

// Rota para listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const connection = await createConnection();
    const [result] = await connection.query("SELECT * FROM produtos");
    await connection.end();
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server ERROR");
  }
});

// Rota para adicionar produtos
app.post("/produtos", async (req, res) => {
  try {
    const connection = await createConnection();
    const { nome, descricao, preco, imagem } = req.body;
    const [result] = await connection.query(
      "INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)",
      [nome, descricao, preco, imagem]
    );
    await connection.end();
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Rota para listar usuários
app.get("/usuarios", async (req, res) => {
  try {
    const connection = await createConnection();
    const [result] = await connection.query("SELECT * FROM usuarios");
    await connection.end();
    res.send(result);
  } catch (e) {
    res.status(500).send("Server ERROR");
  }
});

app.post("/carrinho", async (req, res) => {
    try {
      const connection = await createConnection();
      const { nome, preco, imagem } = req.body;
      const [result] = await connection.query(
        "INSERT INTO carrinho (nome, preco, imagem) VALUES (?, ?, ?)",
        [nome, preco, imagem]
      );
      await connection.end();
  
      // Retorna o ID do item inserido
      res.send({nome, preco, imagem });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });
  

// Rota para listar os itens do carrinho
app.get("/carrinho", async (req, res) => {
  try {
    const connection = await createConnection();
    const [result] = await connection.query(
      "SELECT id, nome, preco, imagem, quantidade FROM carrinho"
    );
    await connection.end();
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server ERROR");
  }
});

// Rota para remover um item do carrinho
app.delete("/carrinho/:id", async (req, res) => {
  try {
    const connection = await createConnection();
    const { id } = req.params;
    const [result] = await connection.query(
      "DELETE FROM carrinho WHERE id = ?",
      [id]
    );
    await connection.end();
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server ERROR");
  }
});

app.listen(8000, () => {
  console.log("Iniciei o servidor");
});
