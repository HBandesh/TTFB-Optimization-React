import express from 'express';
import compression from 'compression';
import {routesForChunking} from './routesForChunking';
import {routesForNonChunking} from './routesForNonChunking';
import path from 'path';

const port = process.env.PORT || 8080 ,
server = express();

//Compressing the data before sending it back to client.
server.use(compression());
server.use(express.static('./public'));

//Defining Routes
//Route for Home page
server.get("/",(req,res) => res.sendFile(path.join(__dirname + '/index.html')));
//Route for Page with the chunking concept implemented.
server.get("/chunking",routesForChunking());
//Route for the page without chunking concept implemented.
server.get("/nonChunking",routesForNonChunking());

server.listen(port,()=>{
	console.log("express server is listing on configured port "+port);
});