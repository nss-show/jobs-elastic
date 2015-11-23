/**
 *	Elasticsearch module
 *
 *	Export public functionalty.
 */

var elastic = {

	// the client used to connect to elasticsearh
	client: require('./client'),

	// services used to query elasticsearch
	services: require('./services')
};

module.exports = elastic;