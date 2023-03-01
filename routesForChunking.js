/**
 * @module routesForChunking This modules builds up the page with the concept of sending the
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
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getHead = (req, res, next) => {
  res.set({
    "Content-Type": "text/html; charset=UTF-8", //This is done to overcome the issue of minimum number of bytes needed to render the DOM in firefox.
  });
  res.write(`<!DOCTYPE html>
		<html>${renderToString(<Head />)}`);
  res.flush();
  next();
};

/**
 * @function getHeader This function makes the header part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getHeader = (req, res, next) => {
  res.write(`<body><div id="root">${renderToString(<Header />)}`);
  res.flush();
  next();
};

/**
 * @function getNewUsers This function makes the new users part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getNewUsers = (req, res, next) => {
  res.write(`${renderToString(<NewUsers users={req.users} />)}`);
  res.flush();
  next();
};

/**
 * @function getTopPerformers This function makes the main content part of the HTML. It internally
 * 					 complies the react component of the same as well. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getTopPerformers = (req, res, next) => {
  res.write(`${renderToString(<TopPerformers data={req.topPerformers} />)}`);
  res.flush();
  next();
};

/**
 * @function getFooter This function makes the footer part of the HTML. It internally
 * 					   complies the react component of the same as well. Additionally this set the data
 * 					   on a window object. Its flushes the prepared html back to client.
 * @returns {string} Returns the HTML string
 */
const getFooter = (req, res) => {
  res.write(`${renderToString(<Footer />)}</div>
		</body>
		<script>window.dataLayer=${JSON.stringify(globalData)}</script>		
		<script src="../../bundle.js"></script>
		</html>`);
  res.flush();
  res.end();
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
 * @function routesForChunking This function performs the task of sending the data in chunks back to the browser
 */
export const routesForChunking = () => {
  return [
    getHead,
    getHeader,
    getNewUsersData,
    getNewUsers,
    getTopPerformersData,
    getTopPerformers,
    getFooter,
  ];
};
