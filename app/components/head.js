import React from 'react';

export const Head = ({}) => {
    return(
        <head>
            <title>CHUNKED POC</title>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossOrigin="anonymous"/>
            <link rel="stylesheet" type="text/css" href="/style.css"/>
            <link rel="dns-prefetch" href="s3.amazonaws.com"/>
            <link rel="dns-prefetch" href="www.hdwallpaper.nu"/>
            <link rel="dns-prefetch" href="longwallpapers.com"/>
            <link rel="preconnect" href="https://s3.amazonaws.com"/>
            <link rel="preconnect" href="https://www.hdwallpaper.nu"/>
            <link rel="preconnect" href="http://longwallpapers.com"/>
            <link rel="preload" href="http://longwallpapers.com/Desktop-Wallpaper/marvel-avengers-wallpapers-high-definition-For-Desktop-Wallpaper.jpg" as="image"/>
            <link rel="preload" href="https://www.hdwallpaper.nu/wp-content/uploads/2017/07/thor-1.jpg" as="image"/>
        </head>
    );
}