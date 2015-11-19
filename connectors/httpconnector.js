
var util = require('util');
var HttpConnector = require('elasticsearch/src/lib/connectors/http');

/**
 * Custom HttpConnector
 * Inherits from elasticsearch/src/lib/connectors/http.js
 */
function CustomHttpConnector(host, config) {
  HttpConnector.call(this, host, config);
}
util.inherits(CustomHttpConnector, HttpConnector);

/**
 * Function overrides function in elasticsearch/src/lib/connectors/http.js
 * The leading slash is removed from the path enabling access via a proxy
 * to elasticsearch instance.
 *
 */
CustomHttpConnector.prototype.makeReqParams = function(params) {
	var reqParams = HttpConnector.prototype.makeReqParams.call(this, params);

	if(reqParams.path && reqParams.path.charAt(0) === '/'){
		reqParams.path = reqParams.path.substr(1);		
	}

	return reqParams;
};

module.exports = CustomHttpConnector;