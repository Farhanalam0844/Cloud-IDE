const http = require('http');
const path= require('path')
const express = require('express');
const pty = require('node-pty');
const { Server } = require('socket.io');
const fs = require('fs');
const chokidar= require('chokidar')
const app = express();
const server = http.createServer(app);

// Correct CORS configuration
const io = new Server(server, {
    cors: {
      origin: '*', // Replace '*' with your allowed origins for better security
      methods: ['GET', 'POST'],
    },
  });
  
  const CWD = path.join(process.env.INIT_CWD || process.cwd(), 'user');
// Creating the terminal process
var ptyProcess = pty.spawn('bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: CWD,
  env: process.env,
});

// Listen for data from the terminal process and emit it via Socket.IO
ptyProcess.onData((data) => {
  io.emit('terminal:data', data);
  // console.log(data,"data  ")
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('User connected with id: ', socket.id);

  // Listen for terminal commands and write them to the terminal process
  socket.on('terminal:write', (data) => {
    ptyProcess.write(data);
  });
  socket.on("message:sent",(data)=>{
    console.log(`Message received : ${data}`)
  })
  socket.on('error',(error)=>{
    console.log(error)
  })
  // Optional: Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
  socket.on("code:set",({code,path})=>{
    fs.writeFile(`./user/${path}`,code,()=>console.log("data written"))
  })
});
app.get('/files/content', async (req, res) => {
  const path = req.query.path;
  console.log(path,"path")
  fs.readFile(`./user/${path}`, 'utf-8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Error reading file " });
    }
    console.log("code:get", data);
    res.json({ content: data });
  });
});
chokidar.watch('./user').on('all', (event, path) => {
  console.log(`change : ${event}, Path: ${path}`); 
  io.emit('file:refresh');
});

app.get('/files',(req,res)=>{
  const rootDir = CWD; 
  const fileTree = getFileTree(rootDir);
  // console.log(fileTree)
  res.json(fileTree);
  
})

app.get('/',(req,res)=>{
  console.log("Page loaded")
  res.json({"message":"Hello from server"});
  
})
// Start the server
server.listen(8001, () => {
  console.log(`Docker Server running at port: 8001`);
});



/**
 * Recursively gets the directory structure as a tree.
 * @param {string} dirPath - The root directory path.
 * @returns {void}
 */


function getFileTree(dirPath) {
  const stats = fs.lstatSync(dirPath);
  
  // Base case: If it's a file, return just the filename.
  if (!stats.isDirectory()) {
    return null;
  }

  // If it's a directory, build an object for it.
  const tree = {};
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    tree[item] = getFileTree(fullPath); // Recursively add subdirectories and files
  });

  return tree;
}
