/**
 * @module Head This module implements the functionality and the HTML of head
 */
import React from "react";

export const Head = ({}) => {
  return (
    <head>
      <title>CHUNKED POC</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
        integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" type="text/css" href="/styles/main.css" />
      <link rel="dns-prefetch" href="s3.amazonaws.com" />
      <link rel="dns-prefetch" href="img00.deviantart.net" />
      <link rel="preconnect" href="https://s3.amazonaws.com" />
      <link rel="preconnect" href="https://img00.deviantart.net" />
      <link rel="preload" href="/images/banner.webp" as="image" />
      <link
        rel="preload"
        href="https://img00.deviantart.net/bd6a/i/2013/220/e/2/thor__the_dark_world__hi_res_textless_banner__by_phetvanburton-d6hb9q0.jpg"
        as="image"
      />
    </head>
  );
};
