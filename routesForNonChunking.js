/**
 * @module routesForNonChunking This modules builds up the page without the concept of sending the
 * 								HTML back in chunks
 */

import React from "react";
import { renderToString } from "react-dom/server";
import { Head } from "./app/components/Head.jsx";
import { Header } from "./app/components/Header.jsx";
import { TopPerformers } from "./app/components/TopPerformers.jsx";
import { Footer } from "./app/components/Footer.jsx";
import { NewUsers } from "./app/components/NewUsers.jsx";
import request from "superagent";

let globalData = {};

/**
 * @function getHead This function makes the head part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getHead = () => {
  return `<!DOCTYPE html>
		<html>${renderToString(<Head />)}`;
};

/**
 * @function getHeader This function makes the header part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getHeader = () => {
  return `<body><div id="root">${renderToString(<Header />)}`;
};

/**
 * @function getNewUsers This function makes the new users part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getNewUsers = () => {
  return `${renderToString(<NewUsers users={globalData.newUsers} />)}`;
};

/**
 * @function getTopPerformers This function makes the main content part of the HTML. It internally
 * 					 complies the react component of the same as well.
 * @returns {string} Returns the HTML string
 */
const getTopPerformers = () => {
  return `${renderToString(<TopPerformers data={globalData.topPerformers} />)}`;
};

/**
 * @function getFooter This function makes the footer part of the HTML. It internally
 * 					   complies the react component of the same as well. Additionally this set the data
 * 					   on a window object.
 * @returns {string} Returns the HTML string
 */
const getFooter = () => {
  return `${renderToString(<Footer />)}</div>
		</body>
		<script>window.dataLayer=${JSON.stringify(globalData)}</script>		
		<script src="../../bundle.js"></script>
		</html>`;
};

/**
 * @function getNewUsersData This function fetches the new avenger recruits.
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Object} next middleware
 */

const getNewUsersData = async (req, res, next) => {
  try {
    const response = await request.get(`https://reqres.in/api/users`);
    req.users = response.body.data;
    globalData.newUsers = response.body.data;
  } catch (error) {
    req.users = [];
    globalData.newUsers = [];
  }
  next();
};

/**
 * @function getTopPerformersData This function fetches the top performing avengers.
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Object} next middleware
 */
const getTopPerformersData = async (req, res, next) => {
  try {
    const response = await request.get(`https://reqres.in/api/users?delay=2`);
    req.topPerformers = response.body.data;
    globalData.topPerformers = response.body.data;
  } catch (error) {
    req.topPerformers = [];
    globalData.topPerformers = [];
  }
  next();
};

/**
 * @function generateHtml Ths function generates the complete HTML of the page.
 */

const generateHtml = (req, res, next) => {
  res.send(
    `${getHead()}${getHeader()}${getNewUsers()}${getTopPerformers()}${getFooter()}`
  );
};

/**
 * @function routesForNonChunking This function builds up the eniter HTML and sends back to the browsers
 * 								  once all of it is done.
 */
export const routesForNonChunking = () => {
  return [getNewUsersData, getTopPerformersData, generateHtml];
};
