/**
 * @module routesForNonChunking This modules builds up the page without the concept of sending the 
 * 								HTML back in chunks
 */

import React from 'react';
import {renderToString} from 'react-dom/server';
import {Head} from './app/components/head';
import {Header} from './app/components/header';
import {MainContent} from './app/components/mainContent';
import {Footer} from './app/components/footer';
import {Navigation} from './app/components/navigation';
import request from 'superagent';

let globalData = {};

/**
 * @function getHead This function makes the head part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getHead = () => {
	return(`<!DOCTYPE html>
		<html>${renderToString(<Head/>)}`);
}

/**
 * @function getHeader This function makes the header part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getHeader = () => {
	return(`<body><div id="root">${renderToString(<Header />)}`);
}

/**
 * @function getNavigation This function makes the navigation part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getNavigation = () => {
	return (`${renderToString(<Navigation data={globalData.navigationList} />)}`);
}

/**
 * @function getMainContent This function makes the main content part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getMainContent = () => {
	return(`${renderToString(<MainContent data={globalData.mainContent} />)}`);
}

/**
 * @function getFooter This function makes the footer part of the HTML. It internally
 * 					   complies the react component of the same as well. Additionally this set the data
 * 					   on a window object. 
 * @returns {string} Returns the HTML string
 */
const getFooter = () => {
	return (`${renderToString(<Footer />)}</div>
		</body>
		<script>window.dataLayer=${JSON.stringify(globalData)}</script>		
		<script src="../../bundle.js"></script>
		</html>`);
}

/**
 * @function getData This function gathers the data required to build to page but making AJAX calls.
 */
const getData = (req,res,next) => {
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

/**
 * @function generateHtml Ths function generates the complete HTML of the page.
 */

const generateHtml = (req,res,next) => {
	res.send(`${getHead()}${getHeader()}${getNavigation()}${getMainContent()}${getFooter()}`);
}

export const routesForNonChunking = () => {
    return ([getData,generateHtml]);
}