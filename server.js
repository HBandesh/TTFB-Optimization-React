import express from 'express';
import compression from 'compression';
import {routesForChunking} from './routesForChunking';
import {routesForNonChunking} from './routesForNonChunking';
import path from 'path';

const port = process.env.PORT || 8080 ,
server = express();

server.use(compression());
server.use(express.static('./public'));

server.get("/",(req,res) => res.sendFile(path.join(__dirname + '/index.html')));
server.get("/chunking",routesForChunking());
server.get("/nonChunking",routesForNonChunking());

server.listen(port,()=>{
	console.log("express server is listing on configured port "+port);
});