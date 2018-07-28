import React from 'react';

export class Head extends React.Component {
    render() {
        return(
            <head>
                <title>CHUNKED POC</title>
                <link rel="stylesheet" type="text/css" href="/style.css"/>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossOrigin="anonymous"/>
                <link rel="dns-prefetch" href="www.hdwallpaper.nu"/>
                <link rel="preconnect" href="https://www.hdwallpaper.nu"/>
                <link rel="preload" href="https://www.hdwallpaper.nu/wp-content/uploads/2017/07/thor-1.jpg" as="image"/>
            </head>
        );
    }
}