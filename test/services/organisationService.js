/**
 *	Unit tests for organisation service
 *	Requires Mocha testing framework: npm install mocha -g
 */

var assert = require('assert');
var sinon = require('sinon');
var service = require('../../services/organisationService');
var searches = require('../../searches');
var elasticsearch = require('elasticsearch');
var clientProxy = require('../../client');

/**
 *==================================================================
 *	UNIT TESTS FOR services/organisationService
 *==================================================================
 */

 describe('test suite for services/organisationService.js', function(){
 	var sandbox
 		, client
 		, organisations
 		, aquireStub;

 	before(function(){
 		// runs before all tests in this block
 	});

 	after(function(){
 		// runs after all tests in this block
 	});

 	beforeEach(function(){
 		// runs before each test in this block
 		sandbox = sinon.sandbox.create();

 		// create elaticsearch client
 		client = new elasticsearch.Client();
 		
 		// stub the acquire function to return elasticsearch client created above
 		aquireStub = sandbox.stub(clientProxy, 'acquire').returns(client);

 		// create the service
 		organisations = new service('jobs', 'organisation');

 	});

 	afterEach(function(){
 		// runs after each test in this block
 		sandbox.restore();
 	});

 	describe('#mapHbCode()', function(){
 		it('should return correct org(s) for NSS', function(done){
 			var code = 'nss';
 			var expected = [463,19];
 			
 			organisations.mapHbCode(code, function(org){
 				assert.deepEqual(org, expected, 'incorrect org(s) returned');
 				done();
 			});
 		});		

 		it('should return the code if no match is found', function(done){
 			var code = 5624; // this will not find a match
 			
 			organisations.mapHbCode(code, function(org){
 				assert.equal(org, code, 'incorrect org(s) returned');
 				done();
 			});
 		});	 		
 	});	

 	describe('#search()', function(){
 		it('should call elasticsearch client object search() function exactly once', function(done){
 			// stub 'search' function of elasticsearch client
 			var searchStub = sandbox.stub(client, 'search').yields(null, {});

 			organisations.search({}, function(err, results){
				sinon.assert.calledOnce(searchStub);
				done(); 					
 			});
 		});

 		it('should call search object toQuery() function exactly once', function(done){
 			var q = 'the query';

 			// stub 'search' function of elasticsearch client
 			var searchStub = sandbox.stub(client, 'search').yields(null, {});

 			// stub the search prototype 'toQuery' function
 			var toQueryStub = sandbox.stub(searches.organisations.base.prototype, 'toQuery')
 				.yields(null, q); 			

 			organisations.search({}, function(err, results){
				sinon.assert.calledOnce(toQueryStub);
				done(); 					
 			});
 		});	 

 		it('should pass correct options to search object constructor', function(done){
 			var q = 'the query';

 			// spy on search constructor
 			var ctrSpy = sandbox.spy(searches.organisations, 'base');

 			// stub 'search' function of elasticsearch client
 			var clientStub = sandbox.stub(client, 'search').yields(null, {}); 			

 			var options = {
 				id: 56
 				, orgtype: 'NHS Board'
 				, term: ['Greater Glasgow']	
 			}

 			var expectedOptions = {
 				id: options.id
 				, orgTypes: options.orgtype
 				, terms: options.term
 			};

 			organisations.search(options, function(err, results){
				sinon.assert.calledWith(ctrSpy, expectedOptions);
				done(); 					
 			});
 		});  				

 		it('should pass correct options to elasticsearch client object search() function', function(done){
 			var q = 'the query';

 			// stub 'search' function of elasticsearch client
 			var searchStub = sandbox.stub(client, 'search').yields(null, {});

 			// stub the search prototype 'toQuery' function
 			var toQueryStub = sandbox.stub(searches.organisations.base.prototype, 'toQuery')
 				.yields(null, q); 	

 			var options = {
 				id: 80
 				, orgtype: ['NHS Board', 'GP Practice']
 				, term: ['Greater Glasgow']
 				, size: 34		
 				, from: 11
 				, field: ['orgName', 'orgDescription']		
 			}

 			var expectedOptions = {
	        	index         : 'jobs',
	        	type          : 'organisation',
	        	_sourceInclude: options.field,
	        	_sourceExclude: [
    				'orgContactName'
    				,'orgContactEmail'
    				,'orgContactTel'
    				,'orgContactFax'],
	          	body          : q,
	          	size          : options.size,
	          	from          : options.from
 			};

 			organisations.search(options, function(err, results){
				sinon.assert.calledWith(searchStub, expectedOptions);
				done(); 					
 			});
 		}); 		

 		it('should pass default from and size options to elasticsearch client object search() function', function(done){
 			var defaultFrom = 0, defaultSize = 100, q = 'the query';

 			// stub 'search' function of elasticsearch client
 			var searchStub = sandbox.stub(client, 'search').yields(null, {});

 			// stub the search prototype 'toQuery' function
 			var toQueryStub = sandbox.stub(searches.organisations.base.prototype, 'toQuery')
 				.yields(null, q); 	


 			var expectedOptions = {
	        	index         : 'jobs',
	        	type          : 'organisation',
	        	_sourceInclude: undefined,
	        	_sourceExclude: [
    				'orgContactName'
    				,'orgContactEmail'
    				,'orgContactTel'
    				,'orgContactFax'],
	          	body          : q,
	          	size          : defaultSize,
	          	from          : defaultFrom
 			};

 			organisations.search({}, function(err, results){
				sinon.assert.calledWith(searchStub, expectedOptions);
				done(); 					
 			});
 		});	

 		it('should pass results from elasticsearch client object search() function to callback', function(done){
 			// create mock result
			var expected = {
				hit: 'an organisation'
			};

 			// stub 'search' function of elasticsearch client - the stub will yield the search result
 			var searchStub = sandbox.stub(client, 'search').yields(null, expected);

 			organisations.search({}, function(err, results){
 				assert.equal(err, null, 'error was passed to callback');
 				assert.ok(results, 'results not passed to callback');
 				assert.equal(results.hit, expected.hit, 'incorrect results passed to callback');
				done(); 					
 			});
 		});	 

 		it('should pass error from elasticsearch client object search() function to callback', function(done){
 			// create mock error
			var error = new Error();
			error.message = 'error from elasticsearch client search()';
			error.stack = 'this is the stacktrace';

 			// stub 'search' function of elasticsearch client - the stub will yield the error
 			var searchStub = sandbox.stub(client, 'search').yields(error, null); 			

 			organisations.search({}, function(err, results){
 				assert.ok(error, 'error not passed to callback');
 				assert.equal(err.message, error.message, 'error message incorrect');
 				assert.equal(err.stack, error.stack, 'error stacktrace incorrect');
				done(); 					
 			});
 		});	 	

 		it('should pass error from search object toQuery() function to callback', function(done){
 			// create mock error
			var error = new Error();
			error.message = 'error from base.toQuery()';
			error.stack = 'this is the stacktrace';

 			// stub 'search' function of elasticsearch client
 			var searchStub = sandbox.stub(client, 'search').yields(null, {});

 			// stub the search prototype 'toQuery' function - the stub will yield the error
 			var toQueryStub = sandbox.stub(searches.organisations.base.prototype, 'toQuery')
 				.yields(error, null); 

 			organisations.search({}, function(err, results){
 				assert.ok(error, 'error not passed to callback');
 				assert.equal(err.message, error.message, 'error message incorrect');
 				assert.equal(err.stack, error.stack, 'error stacktrace incorrect');
				done(); 					
 			});
 		});	 

 		it('should not invoke elasticsearch client object search() function if search object toQuery() function yields an error', function(done){
 			// create mock error
			var error = new Error();
			error.message = 'error from base.toQuery()';
			error.stack = 'this is the stacktrace';

 			// stub 'search' function of elasticsearch client
 			var searchStub = sandbox.stub(client, 'search').yields(null, {});

 			// stub the search prototype 'toQuery' function - the stub will yield the error
 			var toQueryStub = sandbox.stub(searches.organisations.base.prototype, 'toQuery')
 				.yields(error, null); 

 			organisations.search({}, function(err, results){
 				sinon.assert.notCalled(searchStub);
				done(); 					
 			});
 		});	 
 	});

 	describe('#getById()', function(){
 		it('should call elasticsearch client object get() function exactly once', function(done){ 			
 			// stub 'get' function of elasticsearch client
 			var getStub = sandbox.stub(client, 'get').yields(null, {}, 200);

 			organisations.getById(80, function(err, results){
				sinon.assert.calledOnce(getStub);
				done(); 					
 			});
 		});	

 		it('should pass correct options to elasticsearch client object get() function', function(done){
 			var id = 80;

 			// stub 'get' function of elasticsearch client
 			var getStub = sandbox.stub(client, 'get').yields(null, {}, 200); 			

 			var expectedOptions = {
	        	index   : 'jobs',
	        	type    : 'organisation',
	        	id 		: id,
	        	ignore 	: 404,
	        	_sourceExclude: [
    				'orgContactName'
    				,'orgContactEmail'
    				,'orgContactTel'
    				,'orgContactFax']
 			};

 			organisations.getById(id, function(err, results){
				sinon.assert.calledWith(getStub, expectedOptions);
				done(); 					
 			});
 		});  	

 		it('should pass results from elasticsearch client object get() function to callback', function(done){
 			// create mock result
			var expected = {
				hit: 'an organisation'
			};

 			// stub 'get' function of elasticsearch client - stub will yield the expected result
 			var getStub = sandbox.stub(client, 'get').yields(null, expected, 200); 	

 			organisations.getById(80, function(err, results){
 				assert.equal(err, null, 'error was passed to callback');
 				assert.ok(results, 'results not passed to callback');
 				assert.equal(results.hit, expected.hit, 'incorrect results passed to callback');
				done(); 					
 			});
 		});	 	

 		it('should pass error from elasticsearch client object get() function to callback', function(done){
 			// create mock error
			var error = new Error();
			error.message = 'error from elasticsearch client get()';
			error.stack = 'this is the stacktrace';

 			// stub 'get' function of elasticsearch client - stub wil yield the error
 			var getStub = sandbox.stub(client, 'get').yields(error, null, 500); 	

 			organisations.getById(80, function(err, results){
 				assert.ok(error, 'error not passed to callback');
 				assert.equal(results, null, 'results were unexpectedly passed to callback')
 				assert.equal(err.message, error.message, 'error message incorrect');
 				assert.equal(err.stack, error.stack, 'error stacktrace incorrect');
				done();			
 			});			
 		});
 	}); 
 });