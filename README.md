Have you ever wondered why the Google search pages or Amazon site loads really fast? Well stay with me while I take you through the concept, implemented by the big giants, that drastically reduces Time to first byte, improves time to interactivity and page speed index. But firstly, let us go through some concepts that leads to the idea.

#Analyzing Critical Rendering Path (CRP)
 
First of all, let us define the vocabulary that we would be using frequently :->

1.	 **Critical Resource**: Resource that could block initial rendering of the page.
2.	**Time To First Byte(TTFB)**: Measures the duration from the user or client making an HTTP request to the first byte of the page being received by the client's browser.

Optimizing web performance is all about understanding what happens in the intermediate steps between receiving the HTML, CSS, and JavaScript bytes and the required processing to turn them into rendered pixels - that's the critical rendering path(CRP).

Before the pages are rendered the browser has to go through all the following steps:->

![alt text](https://cdn-images-1.medium.com/max/1200/1*DvtGakCxv1pYZzwiaPN4kg.png)

When the browser first hits the page it downloads the HTML. It then start building up the DOM tree. Each tag in HTML represents node inside the DOM tree which has all the information regarding it. Let us take an example to understand this fully :->

Suppose Browser receives the following HTML form server.

<!DOCTYPE html>
    <html>
     <head>
       <meta name="viewport" content="width=device-width,initial-      scale=1">
       <link href="style.css" rel="stylesheet">
       <title>Critical Path</title>
     </head>
     <body>
        <p>Hello <span>web performance</span> students!</p>
         <div><img src="awesome-photo.jpg"></div>
     </body>
</html>

Browser converts it into a tree object called DOM as :->


![alt text](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/dom-tree.png)

**NOTE THAT THE DOM CONSTRUCTION PROCESS IS INCREMENTAL (THIS IS THE BASIS OF THE IDEA FOR WHICH I AM WRITING THIS BLOG, PROGRESSIVE RENDERING).**

While the browser was constructing the DOM of our simple page, it encountered a link tag in the head section of the document referencing an external CSS stylesheet: style.css. Anticipating that it needs this resource to render the page, it immediately dispatches a request for this resource, which comes back with the following content:

body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }

Browser then creates the CSSOM (CSS Object Model)

![alt text](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/cssom-tree.png)

The CSSOM and DOM trees are combined into a render tree, which is then used to compute the layout of each visible element and serves as an input to the paint process that renders the pixels to screen. This is what a render tree looks like

![alt text](https://github.com/HBandesh/TTFB-Optimization-React/blob/master/public/images/render-tree-construction%20(1).png)
 
Some nodes are not visible (for example, script tags, meta tags, and so on), and are omitted since they are not reflected in the rendered output. Some nodes are hidden via CSS and are also omitted from the render tree.

Now with the Render tree in place we can head for the Layout step. The output of the layout process is a "box model," which precisely captures the exact position and size of each element within the viewport: all of the relative measurements are converted to absolute pixels on the screen.

Finally, now that we know which nodes are visible, and their computed styles and geometry, we can pass this information to the final stage, which converts each node in the render tree to actual pixels on the screen. This step is often referred to as "painting".

**Note that the CSS is render blocking. Until the CSSOM is not constructed fully browser cannot proceed to the render tree step. Hence we need to serve the CSS file to browser as soon as possible which is why we keep all the link tags in head section.**

Now let us add JavaScript to our example:->


<!DOCTYPE html>
    <html>
     <head>
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <link href="style.css" rel="stylesheet">
       <title>Critical Path</title>
     </head>
     <body>
        <p>Hello <span>web performance</span> students!</p>
        <div><img src="awesome-photo.jpg"></div>
        <script src="app.js"></script>
     </body>
</html>


By default, JavaScript execution is "parser blocking": when the browser encounters a script in the document it must pause DOM construction, download the file, hand over control to the JavaScript runtime, and let the script execute before proceeding with DOM construction. The browser does not know what the script is planning to do on the page, it assumes the worst case scenario and blocks the parser.

Hold on!!!!!! This is not the worst case that can happen while DOM parsing. In the last example, we can see that we have both CSS and JS external files that the browser needs to download. Now, suppose the CSS files takes some time to download and in the meanwhile JS file gets downloaded. Now, the browser will assume the worst case scenario that JS might query CCSOM, which is why it does not start parsing the JS file until the CSS file is downloaded and CSSOM is ready! Let us look at some diagram which might help us to get a better understanding to what I am trying to say.
 
![alt text](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/analysis-dom-css-js.png)

CSS is DEMON for any webpage! It is render blocking and parse blocking as well. We need to be very careful in handling it.

Let us look into some ways to optimize the CRP.

#OPTIMIZING THE CRP:

Till now we know that the CSS is a DEMON. Get it to the client as soon and as quickly as possible to optimize the time to first render. However, what if we have some CSS styles that are only used under certain conditions, for example, when the page is being printed or being projected onto a large monitor? It would be nice if we didn’t have to block rendering on these resources. CSS "media types" and "media queries" allow us to address these use cases:

<link href="style.css" rel="stylesheet">
<link href="print.css" rel="stylesheet" media="print">
<link href="other.css" rel="stylesheet" media="(min-width: 40em)">

A [media query](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#use-css-media-queries-for-responsiveness) consists of a media type and zero or more expressions that check for the conditions of particular media features. For example, our first stylesheet declaration doesn't provide a media type or query, so it applies in all cases; that is to say, it is always render blocking. On the other hand, the second stylesheet declaration applies only when the content is being printed---perhaps you want to rearrange the layout, change the fonts, and so on, and hence this stylesheet declaration doesn't need to block the rendering of the page when it is first loaded. Finally, the last stylesheet declaration provides a "media query," which is executed by the browser: if the conditions match, the browser blocks rendering until the style sheet is downloaded and processed. **When declaring your style sheet assets, pay close attention to the media type and queries; they greatly impact critical rendering path performance.**


By default all JavaScript is parser blocking. A signal to the browser that the script does not need to be executed at the exact point where it's referenced allows the browser to continue to construct the DOM and let the script execute when it is ready; for example, after the file is fetched from cache or a remote server. To achieve this, we mark our script as async.

<script src="app.js" async></script>

Adding the async keyword to the script tag tells the browser not to block DOM construction while it waits for the script to become available, which can significantly improve performance. One more plus point of async attribute is that the script does not gets blocked waiting for CSSOM to get ready. Analytics script is great example for async attribute as the script does not changes the DOM in any way. There is one more attribute for script tags, which is defer. You can learn about defer by visiting [here](https://hacks.mozilla.org/2009/06/defer/).


*And finally!!!!!! The climax part of the blog arrives, where I will tell you the main secret, apart from the optimizations stated above, that big companies imply and do wonders!!!!*

#SENDING HTML IN CHUNKS FROM SERVER

Look at the following images and decide, in which way would you want your websites to render :->

![alt text](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/progressive-rendering.png)

Got an answer? It’s the first one obviously! No one really like to see the blank page for long enough. It is much better to render the HTML in chunks on the webpage which is what the google search pages and Amazon and other big giants do. Now when you first hit the URL of any website, the complete HTML of the page gets build up on server. Till that time the browser is sitting ideal doing nothing. After the HTML is built on server, for the page which has been requested, it is passed on to the browser. The browser then start building up the DOM and go through all the CRP steps as mentioned before. The following diagram will help us get this thing more clear.

 ![alt text](https://github.com/HBandesh/TTFB-Optimization-React/blob/master/public/images/Untitled%20Diagram.png)

So why don’t we optimize the ideal time of browser and make browser start building up DOM , as the process is incremental, by sending the HTML chunk that is ready on server. In other words, we can flush out the HTML in chunks the moment they get ready instead of waiting for the entire HTML to get prepared. This will make browser to start building up the DOM/CSSOM tree instead of waiting ideal. Isn’t that a wonderful idea!

Let us take an example to grab this idea even better. The following is the google search page:

 ![alt text](https://github.com/HBandesh/TTFB-Optimization-React/blob/master/public/images/googleAnalysis.png)

Now suppose we hit this URL, browser dispatches request to server to serve this page. Server starts building this page and has completed the HTML of Part A but for Part B it has to fetch the data from some source which will take some more time. Now instead of waiting for the part B to get completed the server flushes out the completed HTML of part A to browser so that it starts building up the DOM and in meantime the server prepares the HTML of part B with the required data. In this way, the user would be able to see the webpage loading progressively on the browser. Sending HTML in chunks also reduces the Time to first byte greatly and improves performance and page speed index of the page. 

**THIS IS WHAT GOOGLE IS ACTUALLY DOING IN THIER SEARCH PAGES! EVEN AMAZON THOWRS THEIR HEADER FIRST WHILE REST OF THE PAGE GETS PREPARED ON SERVER.**

Sending the HTML in chunks also serves one more purpose of optimization. As your <head> tag reaches the client first, the browser initiates the CSS and other requests in head tag, which helps the browser to download other critical resources while the rest of HTML is prepared by server. You can even preload the heavy images in head tag which will be used by the HTML that is yet to come from server, improving page load time!


Now the question comes on how to send HTML in chunks  from server side?

Well we have different ways in different languages. We have a method called flush in Java, .Net and PHP. In Node JS we need to res.write() whenever our HTML chunk is ready.

**NOTE THAT THE BROSWER DOES NOT MAKE REPITIVE CALLS TO SERVER TO GET ALL THE CHUNKS. ALL THE HTML CHUNKS ARE SERVED OVER A SINGLE CALL TO SERVER.**

I have made a POC on Node JS (Express) + React, where the react components are rendered on Node and each component is flushed to browser as soon as their HTML gets prepared on Node. You can find the source code [here](https://github.com/HBandesh/TTFB-Optimization-React).

You can try the Live demo by visiting [here](http://www.harnoorbandesh.co.in/).

In the demo you can see links. The ‘Move to page without chunking’ link  will move you the page in which the HTML chunking concept has not been applied and the ‘Move to page with chunking’ link will move you to the page in which the chunking concept has been applied. Below is the screenshot of the page.
 
![alt text](https://github.com/HBandesh/TTFB-Optimization-React/blob/master/public/images/chunking1.png)
![alt text](https://github.com/HBandesh/TTFB-Optimization-React/blob/master/public/images/chunking2.png)
![alt text](https://github.com/HBandesh/TTFB-Optimization-React/blob/master/public/images/chunking3.png)
 

 

The page is divided into 4 parts. The moment the part A gets prepared on server it is flushed to the browser so that the browser can start building up the DOM. The PART B is build up using the data from an API, the moment browser creates the HTML of part A , the HTML of part B gets prepared on server and is then served to browser, as DOM construction is an incremental process. The story goes on for PART C and PART D. Here is one catch! Even before sending the PART A, I send one more chunk to browser which is the head tag of HTML. In the head tag I have preloaded all the heavy banner images in header and footer, done pre connect and dns-prefetch of all the remaining images (Learn more about preload, prefetch and pre-connect [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)). The head tag also contains the CSS file links. Now as the PART A gets prepared on the server the browser dispatches the request of all the resources in the head section so that page gets populated faster when the HTML  arrives.

The performance test on both the pages were run with the help of lighthouse extension in chrome. And the result are really encouraging. (The test was run 10 times on both the pages and the average of all the values are displayed below)

PARAMETER	NON CHUNKING	CHUNKING
Performance	60	77
TTFB	2.75 seconds	0.099 seconds
Speed Index	10848 ms	3547 ms
Time to Interactivity	7623 ms	7170 ms
First Meaningful Paint	2673 ms	2173 ms

Learn more about [Time to Interactivity](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive), [Speed Index](https://developers.google.com/web/tools/lighthouse/audits/speed-index), [first meaningful paint](https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint).

This basic idea implementation can drastically improve the performance of a web page. I Hope I was able to explain the concept. 

If you want to contribute in the idea, or if you feel something better can be done in it, then please go ahead , fork the repo/create a new branch and raise a pull request to me. Please find below the steps to turn on the App on local:->
1.	Clone from https://github.com/HBandesh/TTFB-Optimization.
2.	Install Node on your system.
3.	Run “npm install” inside the folder where you have cloned the code.
4.	Run “npm run dev” to make the bundle.js.
5.	Terminate the process and run “npm start”. The App will start running on 8080 port.


