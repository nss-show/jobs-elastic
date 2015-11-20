/**
 *	Elasticsearch module
 *
 *	Export public functionalty.
 */

var elastic = {

	// the client used to connect to elasticsearh
	client: require('./client'),

	// pre-defined search instances
	searches: {
		vacancies: {
			base: require('./searches/vacancies/base'),
			live: require('./searches/vacancies/live')			
		},
		organisations: {
			base: require('./searches/organisations/base')
		}
	},

	// services used to query elasticsearch
	services: {
		vacancies: require('./services/vacancyService'),
		organisations: require('./services/organisationService')		
	}
};

module.exports = elastic;