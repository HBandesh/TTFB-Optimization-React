import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Head} from './app/components/head';
import {Header} from './app/components/header';
import {MainContent} from './app/components/mainContent';
import {Footer} from './app/components/footer';
import {Navigation} from './app/components/navigation';
import request from 'superagent';


const port = process.env.PORT || 9090 ,
server = express();

let globalData = {};

server.use(express.static('./public'));

var getHead = () => {
	return(`<!DOCTYPE html>
		<html>${renderToString(<Head/>)}`);
}

var getHeader = () => {
	return(`<body><div id="root">${renderToString(<Header />)}`);
}
var getNavigation = () => {
	return (`${renderToString(<Navigation data={globalData.navigationList} />)}`);
}

var getMainContent = () => {
	return(`${renderToString(<MainContent data={globalData.mainContent} />)}`);
}

var getFooter = () => {
	return (`${renderToString(<Footer />)}</div>
		</body>
		<script>window.dataLayer=${JSON.stringify(globalData)}</script>		
		<script src="../../bundle.js"></script>
		</html>`);
}

var getData = (req,res,next) => {
	let users = [];
	const usersPromise = new Promise((resolve,reject)=> {
		const getUsers = pageNumber => {
			request.get(`https://reqres.in/api/users?page=${pageNumber}`).then(res => {
				if(pageNumber !== 3) {
					users = [...users,...res.body.data];
					getUsers(++pageNumber);
				} else {
					globalData.navigationList = users
					resolve();
				}
			});
		}
		getUsers(1);
	});
	const performersPromise = new Promise((resolve,reject)=> {
		request.get("https://reqres.in/api/users?delay=2").then(response => {
			globalData.mainContent = response.body.data;
			resolve();
		});
	});
	Promise.all([usersPromise,performersPromise]).then(res=> next());
}

var generateHtml = (req,res,next) => {
	res.send(`${getHead()}${getHeader()}${getNavigation()}${getMainContent()}${getFooter()}`);
}

server.get("/",[getData,generateHtml]);

server.listen(port,()=>{
	console.log("express server is listing on configured port "+port);
});