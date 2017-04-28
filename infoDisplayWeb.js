// --------------------------------------------------------------------------------------------------
// InfoDisplayWeb - NodeJS implementation 
// - WebApi 
//     - /images => array of images (JPG files). Clients browsers can show these (in a slideshow)
//     - /pages => array of web-pages. Client can visit & show them (in a slideshow)
//      
// This WebAPI is created for the client (web-browser)
// - HTML5/AngularJS implementation of a full screen kioskmode information/news/picture/webpage slide show viewr
// 
// 2017-02-06 Vincent van Beek - VibeSoft
//-----------------------------------------------------------------------------------------------------
var express = require('express');           // Express web application framework. http://expressjs.com/ 
var fs = require('fs');                     // We will use the native file system
var os = require('os');                     // OS specific info
var config = require('./infoDisplayConfig.json'); 	// Configuration file of this module which includes Logger configuration (log4js)

var APPNAME = "InfoDisplayWeb";             // Name of this app
var PORT = process.env.PORT || 8088;        // Node will listen on port from environment setting, or when not set to port number...

var app = express();                        // W're using Express


var pagesList = [];	                        // Array with pages (URLs and settings) to be shown by the client browser in a slide show.


//------------------------------------------------------------------------------------------------------
// Setup & Configure logging; from config.file
var log4js = require('log4js'); 			// Logger module to log into files
log4js.configure(config.log4js);            // see: https://github.com/nomiddlename/log4js-example/blob/master/app.js
var logger = log4js.getLogger("infoDisplay");
logger.info('Starting InfoDisplay...');  // Log that w're starting


//------------------------------------------------------------------------------------------------------
// Monitors a local samba share on new PPT-slides (JPGs) and create a html page for each (JPG) slide
var slidesHandler = require('./modules/slides/newSlidesHandler.js');   
slidesHandler.init();

//-------------------------------------------------------------------------------------------------------
// Initialize news handler
var newsHandler = require('./modules/news/newsHandler.js');
newsHandler.init();

//-------------------------------------------------------------------------------------------------------
// Show in logfile what to expect on a app.get /slides 
logger.debug('/slides =>' + JSON.stringify(slidesHandler.getSlides(), null, 4));


//-------------------------------------------------------------------------------------------------------
// Load list of configured web-pages and its settings.
logger.debug('Load configured pages (pages.json)');
pagesList = JSON.parse(fs.readFileSync('./pages.json', 'utf8'));
logger.debug('/pages =>' + JSON.stringify(pagesList, null, 4));


//--------------------------------------------------------------------------------------------------------
// static link the html-root folder to subdir "html" folder 
app.use('/', express.static('/home/pi/html'));
logger.info('Mapped html subfolder to http://'+ os.hostname() );

//--------------------------------------------------------------------------------------------------------
// CORS: Allow cross-domain requests (blocked by default) 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//--------------------------------------------------------------------------------------------------------
// /slides    => Send the list of slides (web pages /URLs) on request.
app.get('/slides', function (req, res, next) {
    logger.info('get-slides requested. returning the array with urls and settings');
    res.contentType('application/json');
    res.send(JSON.stringify(slidesHandler.getSlides(), null, 4));
});

//--------------------------------------------------------------------------------------------------------
// /pages    => Send the list of web pages (URLs) on request.
app.get('/pages', function (req, res, next) {
    logger.info('get-pages requested. returning the array with urls and settings');
    res.contentType('application/json');
    res.send(JSON.stringify(pagesList, null, 4));
});

//--------------------------------------------------------------------------------------------------------
// /news    => NEWS handlers
app.get('/news',function(req,res){
    try{
        logger.info('NEWS start: ');
        var html = newsHandler.getIndexHTML();
	
        if (html) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            res.status(503, 'Unable to retrieve index').end();
        }
    } catch (err) {
    logger.error('/news/ : Something went wrong....' , err);
    res.status(503, 'Something went wrong: ' + err).end();
    }
});

app.get('/news/:source/items', function(req, res) {
    try {
        var source = req.params.source;
        logger.info('app.get: /news/' + source + '/items');
	
        var items = newsHandler.getNewsItems(source);
        if (items) {
            res.json(items);
            res.end();  
        } else {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            res.setHeader("Expires", "0"); // Proxies.
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("<html><body><p>News items not (yet?) loaded for source: " + source + "</p></body></html>");
            res.end();  
        }
    } catch (err) {
        logger.error('/news/:source/items : Something went wrong....' , err);
        res.status(503, 'Something went wrong: ' + err).end();		
    }
});

app.get('/news/:source', function(req, res) {
    try {
        var source = req.params.source;
        logger.info('app.get: /news/' + source);
		
        var html = newsHandler.getNews(source);
        if (html) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            res.setHeader("Expires", "0"); // Proxies.
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();  
        } else {
            res.status(404, 'News source not found or not yet cached (' + source + ')').end();
        }
    } catch (err) {
        logger.error('/news/:source : Something went wrong....' , err);
        res.status(503, 'Something went wrong: ' + err).end();		
    }
}); 
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
// Main     => Setup the server / start listening on configured IP & Port.
var server = app.listen(PORT, function () {
    // Log that we have started and accept incomming connections on the configured port/
    logger.info(APPNAME + " is ready and listening on port: " + PORT);
    console.log(APPNAME + " is ready and listening on port: " + PORT);
});
//--------------------------------------------------------------------------------------------------------


