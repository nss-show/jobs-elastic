/**
 *	Export the searches
 */
module.exports = {

	vacancies: {
		base: require('./vacancies/base'),
		live: require('./vacancies/live')
	},
	organisations: {
		base: require('./organisations/base')
	}

}