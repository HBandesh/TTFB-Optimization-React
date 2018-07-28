import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {renderToString} from 'react-dom/server';

import App from './app/components/App';
import HtmlCustom from './app/components/html';
import {Head} from './app/components/head';
import {Header} from './app/components/header';
import {MainContent} from './app/components/mainContent';
import {Footer} from './app/components/footer';
import request from 'superagent';

import {Data} from './app/data.js';


const port = process.env.PORT || 8080 ,
server = express(),
data = Data.getData();

let globalData = {};

server.use(express.static('./public'));

// page to show chunked data
server.get("/chunked",(req,res) => {
	res.set({
		'Content-Type': 'text/html; charset=UTF-8', //This is done to overcome the issue of minimum number of bytes needed to render the DOM in firefox.
	});
	res.write(`<!DOCTYPE html>
		<html>${renderToString(<Head/>)}`);
	res.write(`<body>${renderToString(<Header />)}`);
	res.write(renderToString(<MainContent data={Data.getData()} />));
	res.write(`${renderToString(<Footer />)}</body></html>`);
	res.end();
});


//page to show non chunked data
server.get("/nonchunked",(req,res) => {
	res.set({
		'Content-Type': 'text/html; charset=UTF-8', //This is done to overcome the issue of minimum number of bytes needed to render the DOM in firefox.
	});
	const stream = `<!DOCTYPE html>
	<html>${renderToString(<Head/>)}<body>${renderToString(<Header />)}${renderToString(<MainContent data={Data.getData()} />)}${renderToString(<Footer />)}</body></html>`;
	res.send(stream);
});


/*page to show ismorphic rendering
	ToDo:send data in chunks
*/ 
server.get("/isomorphic",(req,res) => {
	request.get("https://reqres.in/api/users?delay=3").then(response => {
		globalData = response.body.data;
		ReactDOMServer.renderToNodeStream(
			<HtmlCustom initialData={JSON.stringify(globalData)}>
				<App content = {globalData}/>
			</HtmlCustom>).pipe(res);
	});
});

/**
 * Isomorphism with chunking and without the use of SetTimeOut. We can remove renderToNodeStream and use renderToString instead.
 */

var getHead = (req,res,next) => {
	res.set({
		'Content-Type': 'text/html; charset=UTF-8', //This is done to overcome the issue of minimum number of bytes needed to render the DOM in firefox.
	});
	res.write(`<!DOCTYPE html>
		<html>${renderToString(<Head/>)}`);
	next();
}

var getHeader = (req,res,next) => {
	res.write(`<body><div id="root">${renderToString(<Header />)}`);
	next();
}

var getMainContent = (req,res,next) => {
	request.get("https://reqres.in/api/users?delay=3").then(response => {
		res.write(`${renderToString(<MainContent data={response.body.data} />)}`);
		globalData = response.body.data;
		next();
	});
}

var getFooter = (req,res) => {
	res.write(`${renderToString(<Footer />)}</div>
		</body>
		<script>window.no=12</script>
		<script>window.mainContent=${JSON.stringify(globalData)}</script>		
		<script src="../../bundle.js"></script>
		</html>`);
	res.end();
}

server.get("/isomorphic-chunked",[getHead,getHeader,getMainContent,getFooter]);

server.get("/revalidate",(req,res) => {
	res.write(`<!DOCTYPE html>
		<html>${renderToString(<Head/>)}`);
	res.write(`<body><div id="root">${renderToString(<Header />)}`);
	res.write(renderToString(<MainContent data={Data.getData()}/>));
	res.write(`${renderToString(<Footer />)}</div>
		</body>
		</html>`);
	res.end();
});

server.get("/reactDoingNothing",(req,res) => {
	res.set({
		'Content-Type': 'text/html; charset=UTF-8', //This is done to overcome the issue of minimum number of bytes needed to render the DOM in firefox.
	});
	const stream = `<!DOCTYPE html>
	<html>${Data.getHead()}<body>${Data.getHeader()}${Data.getMain()}${Data.getfooter()}</body></html>`;
	res.send(stream);
})

server.listen(port,()=>{
	console.log("express server is listing on configured port "+port);
});