var sleep = (milliseconds) => {
    var arr = [];
    for (var i = 0; i < 166666; i++) {
        arr.push("<li>'Please chal ja'</li>");
    }
    return arr;
}

export class Data {
    static getData = () => {
        const data = [];
        for (let i=0;i<=5;i++) {
            data.push('Radnom Data Chunked');
        }
        return data;
    }
    static getJunk = () => {
        const data = [];
        for (let i=0;i<=1025;i++) {
            data.push('Radnom Data Chunked');
        }
        return data;
    }
    static getHead = () => {
        return `<head>
            <title>CHUNKED POC</title>
            <link rel="stylesheet" type="text/css" href="/style.css"/>
        </head>`;
    }
    static getHeader = () => {
        return `<header>
        <div style="display:none;">
            ${sleep(3000)}
        </div>
        <h1>
            Welcome to Chuked Application
        </h1>
        <div>
        </div>
    </header>`
    }
    static getMain = () => {
        return `<div style="display:none;">
            ${sleep(3000)}
            </div>
            <ul>
                <li>Harnoor Bandesh</li>
                <li>Harnoor Bandesh</li>
                <li>Harnoor Bandesh</li>
                <li>Harnoor Bandesh</li>
                <li>Harnoor Bandesh</li>
                <li>Harnoor Bandesh</li>
            </ul>`;
    }
    static getfooter = () => {
        return `<footer>
        <div style="display:none;">
            ${sleep(3000)}
        </div>
        <h2>End of chunked App</h2>
        <a href="/">Home</a>
    </footer>`
    }
}