const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 2000;

app.use(express.json());