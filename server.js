const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3300;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/login.html'));
});

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vectra_db',
  port: 3306
};

app.get('/api/users', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, nome_completo as name, email, funcao as role, senha FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  } finally {
    if (connection) connection.end();
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT nome_completo, funcao FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) connection.end();
  }
});

app.post('/api/users', async (req, res) => {
  const {nome_completo, email, funcao, senha} = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nome_completo, email, funcao, senha) VALUES (?, ?, ?, ?)',
      [nome_completo, email, funcao, senha]
    );
    res.json({success: true, id: result.insertId});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'DB error'});
  } finally {
    if (connection) connection.end();
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_completo, funcao, senha } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query = 'UPDATE usuarios SET nome_completo = ?, funcao = ?' + (senha ? ', senha = ?' : '') + ' WHERE id = ?';
    const params = senha ? [nome_completo, funcao, senha, id] : [nome_completo, funcao, id];
    const [result] = await connection.execute(query, params);
    if (result.affectedRows === 0) return res.status(404).json({error: 'Usuário não encontrado'});
    res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'DB error'});
  } finally {
    if (connection) connection.end();
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({error: 'Usuário não encontrado'});
    res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'DB error'});
  } finally {
    if (connection) connection.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});

