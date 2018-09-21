let jQuery = require('./assets/js/jquery.js');
(<any>window).$ = jQuery;
(<any>window).jQuery = jQuery;

require('./assets/js/bootstrap.js');
require('./assets/js/popper.min.js');
// require('./assets/js/jquery.jqpagination.js');
require('./assets/js/jPages.js');

// Turndown : Html to Markdown convertor
let TurndownService = require("./assets/js/turndown.browser.umd.js");
(<any>window).TurndownService = TurndownService;
