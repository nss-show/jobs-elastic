/**
 *	Client for connecting to elasticsearch
 */

var elasticsearch   = require('elasticsearch');
var connector       = require('./connectors/httpconnector');

var _client;

/**
 * Export public functions
 */
module.exports = {

    /**
     *  Create client and connect
     */
    connect: function(options){
        var host = {};
        options = options || {};

        if(options.proxy){
            // we are using a proxy
            host.protocol = options.proxy.protocol;
            host.host = options.proxy.host;
            host.port = options.proxy.port;            
        }else{
            // no proxy
            host.protocol = options.server.protocol;
            host.host = options.server.host;
            host.port = options.server.port;
        }

        host.path = options.server.protocol + '://' 
            + options.server.host;

        // add authentication
        if(options.server.user 
            && options.server.pass){

            host.auth = options.server.user + ':' 
            + options.server.pass;
        }

        // add headers
        if(options.headers){
            host.headers = options.headers;
        }

        // create the client
        _client = new elasticsearch.Client({
            host: [ host ],
            connectionClass: connector   
        });
    },

    /**
     *  Retrieve the client
     */
	acquire: function(){
		return _client;
	}
}