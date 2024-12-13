import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(express.json()); // Middleware para permitir JSON no corpo das requisições
app.use(cors()); // Middleware para habilitar CORS

// Configuração do pool de conexões com o banco
type ConnectionConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
};

const poolConfig: ConnectionConfig = {
  host: process.env.DB_HOST || "mysq-marketplace-projeto-69.c.aivencloud.com",
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "AVNS_gyfqNavqN5EDMFzAwmj",
  database: process.env.DB_NAME || "banco1022a",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 27925,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(poolConfig); // Cria um pool de conexões ao banco de dados

// Middleware para lidar com erros gerais
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error', details: err.message });
});

// Rota para listar produtos
app.get("/produtos", async (req: express.Request, res: express.Response) => {
  try {
    const [result] = await pool.query("SELECT * FROM produtos"); // Consulta todos os produtos
    res.send(result);
  } catch (e: any) {
    console.error("Erro ao buscar produtos:", e.message);
    res.status(500).json({ error: "Erro ao buscar produtos", details: e.message });
  }
});

// Rota para adicionar produtos
app.post("/produtos", async (req: express.Request, res: express.Response) => {
  try {
    const { marca, nome, descricao, preco, imagem, quantidade } = req.body;
    const [result]: any = await pool.query(
      "INSERT INTO produtos (marca, nome, descricao, preco, imagem, quantidade) VALUES (?, ?, ?, ?, ?, ?)",
      [marca, nome, descricao, preco, imagem, quantidade]
    );
    res.send({ id: result.insertId, marca, nome, descricao, preco, imagem, quantidade });
  } catch (e: any) {
    console.error("Erro ao adicionar produto:", e.message);
    res.status(500).json({ error: "Erro ao adicionar produto", details: e.message });
  }
});

// Rota para listar usuários
app.get("/usuarios", async (req: express.Request, res: express.Response) => {
  try {
    const [result] = await pool.query("SELECT * FROM usuarios"); // Consulta todos os usuários
    res.send(result);
  } catch (e: any) {
    console.error("Erro ao buscar usuários:", e.message);
    res.status(500).json({ error: "Erro ao buscar usuários", details: e.message });
  }
});

// Rota para adicionar itens ao carrinho
app.post("/carrinho", async (req: express.Request, res: express.Response) => {
  try {
    const { nome, preco, imagem } = req.body;
    const [result]: any = await pool.query(
      "INSERT INTO carrinho (nome, preco, imagem) VALUES (?, ?, ?)",
      [nome, preco, imagem]
    );
    res.send({ id: result.insertId, nome, preco, imagem });
  } catch (e: any) {
    console.error("Erro ao adicionar ao carrinho:", e.message);
    res.status(500).json({ error: "Erro ao adicionar ao carrinho", details: e.message });
  }
});

// Rota para listar os itens do carrinho
app.get("/carrinho", async (req: express.Request, res: express.Response) => {
  try {
    const [result] = await pool.query(
      "SELECT id, nome, preco, imagem FROM carrinho"
    ); // Consulta todos os itens do carrinho
    res.send(result);
  } catch (e: any) {
    console.error("Erro ao buscar itens do carrinho:", e.message);
    res.status(500).json({ error: "Erro ao buscar itens do carrinho", details: e.message });
  }
});

// Rota para remover um item do carrinho
app.delete("/carrinho/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const [result]: any = await pool.query(
      "DELETE FROM carrinho WHERE id = ?",
      [id]
    );
    res.send({ message: "Item removido com sucesso", id });
  } catch (e: any) {
    console.error("Erro ao remover item do carrinho:", e.message);
    res.status(500).json({ error: "Erro ao remover item do carrinho", details: e.message });
  }
});

// Inicialização do servidor
app.listen(8000, async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexão com o banco de dados bem-sucedida!");
    connection.release(); // Libera a conexão de volta para o pool
  } catch (e: any) {
    console.error("Erro ao conectar ao banco de dados na inicialização:", e.message);
  }
  console.log("Servidor iniciado na porta 8000");
});
