/**
 *	Elasticsearch module
 *
 *	Export public functionalty.
 */

var elastic = {};

elastic.client = require('./client').client();

elastic.searches = {
	vacancies: {
		base: require('./searches/vacancies/base'),
		live: require('./searches/vacancies/live')
	},
	organisations: {
		base: require('./searches/organisations/base')
	}
};

module.exports = elastic;