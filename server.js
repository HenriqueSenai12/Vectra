const express = require('express');
const cors = require('cors'); // Adicionado
const { NodeSSH } = require('node-ssh');
const app = express();
const ssh = new NodeSSH();

app.use(cors()); // Adicionado para permitir que o Index.html acesse o servidor

const configRobo = {
  host: '192.168.137.x', // !!! LEMBRE-SE DE COLOCAR O IP REAL DO SEU EV3 AQUI !!!
  username: 'robot',
  password: 'maker'
};

app.get('/iniciar', async (req, res) => {
  try {
    await ssh.connect(configRobo);
    // Remove o arquivo de parada se ele existir e inicia o programa
    await ssh.execCommand('rm -f /tmp/robot_stop');
    ssh.execCommand('python3 /home/robot/Vectra/main.py', { cwd: '/home/robot/Vectra' });
    res.send('Comando Iniciar enviado!');
  } catch (err) {
    res.status(500).send('Erro: ' + err.message);
  }
});

app.get('/encerrar', async (req, res) => {
  try {
    await ssh.connect(configRobo);
    // Cria o arquivo que o main.py monitora para parar
    await ssh.execCommand('touch /tmp/robot_stop');
    res.send('Comando Encerrar enviado!');
  } catch (err) {
    res.status(500).send('Erro: ' + err.message);
  }
});

app.listen(3000, () => console.log('Servidor Node rodando na porta 3000'));