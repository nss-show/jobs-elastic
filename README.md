![Build Status](https://circleci.com/gh/nss-show/jobs-elastic.svg?style=shield&circle-token=:4328cd0fcd34b71d6c1bbfebc7107867ce64a246)

# jobs-elastic

A javascript module used to simplify access to Elasticsearch index (jobs).

## Examples

### Require module

'''javascript
var jobsElastic = require('jobs-elastic');
'''

### Connect Client

'''javascript
var config = {
	server: {
		protocol: 'http',
		host: 'localhost',
		post: '9200'
	}
}

// create the elastic client and connect
jobsElastic.client.connect(options);
'''

### Search for jobs
'''javascript
var vacancyService = new jobsElastic.services.vacancies('jobs', 'vacancy');

var options = {
	terms: ['gp'],
	orgs: [80, 56]
}

vacancyService.search(options, function(err, results){
	// console.log(results);
});
'''

### Get a single job
'''javascript
var vacancyService = new jobsElastic.services.vacancies('jobs', 'vacancy');
var id = 44254;

vacancyService.getById(id, function(err, result, status){
	// console.log(status);
	// console.log(results);
});
'''

### Search for organisations
'''js
var organisationService = new jobsElastic.services.organisations('jobs', 'organisation');

var options = {
	terms: ['glasgow'],
	orgTypes: 'NHS Board'
}

organisationService.search(options, function(err, results){
	// console.log(results);
});
'''

### Get a single organisation
'''javascript
var organisationService = new jobsElastic.services.organisations('jobs', 'organisation');
var id = 80;

organisationService.getById(id, function(err, result, status){
	// console.log(status);
	// console.log(results);
});
'''