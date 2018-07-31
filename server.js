import express from 'express';
import compression from 'compression';
import {route} from './routes';

const port = process.env.PORT || 8080 ,
server = express();

server.use(compression());
server.use(express.static('./public'));



server.get("/",route());

server.listen(port,()=>{
	console.log("express server is listing on configured port "+port);
});