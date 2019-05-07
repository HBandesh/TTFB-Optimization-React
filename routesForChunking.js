/**
 * @module routesForChunking This modules builds up the page with the concept of sending the 
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

let promiseStackCenter = {};

let globalData = {};

/**
 * @function getHead This function makes the head part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getHead = (req,res,next) => {
	res.set({
		'Content-Type': 'text/html; charset=UTF-8', //This is done to overcome the issue of minimum number of bytes needed to render the DOM in firefox.
	});
	res.write(`<!DOCTYPE html>
		<html>${renderToString(<Head/>)}`);
	res.flush();
	next();
}

/**
 * @function getHeader This function makes the header part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getHeader = (req,res,next) => {
	res.write(`<body><div id="root">${renderToString(<Header />)}`);
	res.flush();
	next();
}

/**
 * @function getNavigation This function makes the navigation part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getNavigation = (req,res,next) => {

    const sendHtml = () => {
		res.write(`${renderToString(<Navigation data={globalData.navigationList} />)}`);
		res.flush();
		next();
	}

    if(promiseStackCenter["navigationList"]["isLoaded"]) {
        sendHtml();
    } else {
        Promise.all(promiseStackCenter["navigationList"]["promiseStack"]).then(res => {
            sendHtml();
        })
    }
}

/**
 * @function getMainContent This function makes the main content part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getMainContent = (req,res,next) => {

    const sendHtml = () => {
        res.write(`${renderToString(<MainContent data={globalData.mainContent} />)}`);
		res.flush();
		next();
    }

    if(promiseStackCenter["mainContent"]["isLoaded"]) {
        sendHtml();
    } else {
        Promise.all(promiseStackCenter["mainContent"]["promiseStack"]).then(res => {
            sendHtml();
        })
    }
}


/**
 * @function getFooter This function makes the footer part of the HTML. It internally
 * 					   complies the react component of the same as well. Additionally this set the data
 * 					   on a window object. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getFooter = (req,res) => {
	res.write(`${renderToString(<Footer />)}</div>
		</body>
		<script>window.dataLayer=${JSON.stringify(globalData)}</script>		
		<script src="../../bundle.js"></script>
		</html>`);
	res.flush();
	res.end();
}

/**
 * @function updatePromisCenterObj This function updates the promise stack for the react components.
 * @param {String} component Name of the part for whose data is ready
 */
const updatePromisCenterObj = component => {
    promiseStackCenter[component] = {};
    promiseStackCenter[component]["isLoaded"] = false;
    promiseStackCenter[component]["promiseStack"] = [];
}

/**
 * @function getPageData This function gathers the data required to build to page but making AJAX calls.
 */
const getPageData = (req,res,next) => {
    let users = [];
    updatePromisCenterObj("mainContent");
    promiseStackCenter["mainContent"]["promiseStack"].push(new Promise((resolve,reject)=> {
		request.get("https://reqres.in/api/users?delay=2").then(response => {
            globalData.mainContent = response.body.data;
            promiseStackCenter["mainContent"]["isLoaded"] = true;
			resolve();
		});
    }));
    updatePromisCenterObj("navigationList");
	promiseStackCenter["navigationList"]["promiseStack"].push(new Promise((resolve,reject)=> {
		const getUsers = pageNumber => {
			request.get(`https://reqres.in/api/users?page=${pageNumber}`).then(res => {
				if(pageNumber !== 3) {
					users = [...users,...res.body.data];
					getUsers(++pageNumber);
				} else {
                    globalData.navigationList = users
                    promiseStackCenter["navigationList"]["isLoaded"] = true;
                    resolve();
                    next();
				}
			});
		}
		getUsers(1);
    }));
}

export const routesForChunking = () => {
    return ([getHead,getHeader,getPageData,getNavigation,getMainContent,getFooter]);
}