/**
 *	Unit tests for pre-defined organisation searches
 *	Requires Mocha testing framework: npm install mocha -g
 */

var assert = require('assert');
var sinon = require('sinon');
var base = require('../../searches/organisations/base');

/**
 *==================================================================
 *	UNIT TESTS FOR /searches/organisations/base
 *==================================================================
 */

 describe('test suite for searches/organisations/base.js', function(){
 	var sandbox;

 	before(function(){
 		// runs before all tests in this block
 	});

 	after(function(){
 		// runs after all tests in this block
 	});

 	beforeEach(function(){
 		// runs before each test in this block
 		sandbox = sinon.sandbox.create();

 	});

 	afterEach(function(){
 		// runs after each test in this block
 		sandbox.restore();
 	});

 	describe('#toQuery()', function(){

 		it('should allow null options', function(done){ 		
 			search = new base();

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{	 					 				
	 				done();			
 				}		

 			});

 		});

 		it('should generate a filter for id', function(done){
 			var search, id;
 			
 			id = 56;
 			search = new base({ id: id});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.filter.bool.must[0].term._id, id, 'id incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a single term phrase query', function(done){
 			var search, term;
 			
 			term = 'NHS Borders';
 			search = new base({ terms: term});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{				
	 				assert.equal(q.query.filtered.query.bool.should.length, 2, 'incorrect length of array');	 					 				
	 				assert.equal(q.query.filtered.query.bool.should[0].match_phrase.orgName, term, 'term incorrect for orgName');
	 				assert.equal(q.query.filtered.query.bool.should[1].match_phrase.orgDescription, term, 'term incorrect for orgDescription');
	 				done(); 					
 				}		

 			});

 		}); 

 		it('should generate a multi term phrase query', function(done){
 			var search, terms;
 			
 			terms = ['NHS Borders', 'NHS Greater Glasgow & Clyde', 'Kilbryde Hospice'];
 			search = new base({ terms: terms});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.query.bool.should.length, 6, 'incorrect length of array'); 					 				
	 				assert.equal(q.query.filtered.query.bool.should[0].match_phrase.orgName, terms[0], 'term incorrect for orgName');
	 				assert.equal(q.query.filtered.query.bool.should[1].match_phrase.orgDescription, terms[0], 'term incorrect for orgDescription');
	 				assert.equal(q.query.filtered.query.bool.should[2].match_phrase.orgName, terms[1], 'term incorrect for orgName');
	 				assert.equal(q.query.filtered.query.bool.should[3].match_phrase.orgDescription, terms[1], 'term incorrect for orgDescription');
	 				assert.equal(q.query.filtered.query.bool.should[4].match_phrase.orgName, terms[2], 'term incorrect for orgName');
	 				assert.equal(q.query.filtered.query.bool.should[5].match_phrase.orgDescription, terms[2], 'term incorrect for orgDescription');	 					 				
	 				done(); 					
 				}		

 			});

 		});  

 		it('should generate a filter for a single org type', function(done){
 			var search, orgtype;
 			
 			orgtype = 'NHS Board';
 			search = new base({ orgTypes: orgtype});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.filter.bool.must[0].terms.orgType, orgtype, 'org type incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a filter for multiple org types', function(done){
 			var search, orgtypes;
 			
 			orgtypes = ['NHS Board','GP Practice', 'Government'];
 			search = new base({ orgTypes: orgtypes});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.deepEqual(q.query.filtered.filter.bool.must[0].terms.orgType, orgtypes, 'org types incorrect');
	 				done(); 					
 				}		

 			});

 		});  				 		
 	});	
 });