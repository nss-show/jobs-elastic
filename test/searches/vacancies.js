/**
 *	Unit tests for pre-defined vacancy searches
 *	Requires Mocha testing framework: npm install mocha -g
 */

var assert = require('assert');
var sinon = require('sinon');
var base = require('../../searches/vacancies/base');
var live = require('../../searches/vacancies/live');

/**
 *==================================================================
 *	UNIT TESTS FOR /searches/vacancies/base
 *==================================================================
 */

 describe('test suite for searches/vacancies/base.js', function(){
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

 		it('should generate a wildcard query for vacancy reference', function(done){
 			var search, ref;
 			
 			ref = 'my ref';
 			search = new base({ ref: ref});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.query.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.query.bool.must[0].wildcard.vacRef, ref + '*', 'wildcard incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a filter for id', function(done){
 			var search, id;
 			
 			id = 42256;
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
 			
 			term = 'Salaried GP';
 			search = new base({ terms: term});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{				
	 				assert.equal(q.query.filtered.query.bool.should.length, 2, 'incorrect length of array');	 					 				
	 				assert.equal(q.query.filtered.query.bool.should[0].match_phrase.vacDescription, term, 'term incorrect for vacDecription');
	 				assert.equal(q.query.filtered.query.bool.should[1].match_phrase.vacTitle, term, 'term incorrect for vacTitle');
	 				done(); 					
 				}		

 			});

 		}); 

 		it('should generate a multi term phrase query', function(done){
 			var search, terms;
 			
 			terms = ['Salaried GP', 'Acute Internal Medicine', 'Accident & Emergency'];
 			search = new base({ terms: terms});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.query.bool.should.length, 6, 'incorrect length of array'); 					 				
	 				assert.equal(q.query.filtered.query.bool.should[0].match_phrase.vacDescription, terms[0], 'term incorrect for vacDecription');
	 				assert.equal(q.query.filtered.query.bool.should[1].match_phrase.vacTitle, terms[0], 'term incorrect for vacTitle');
	 				assert.equal(q.query.filtered.query.bool.should[2].match_phrase.vacDescription, terms[1], 'term incorrect for vacDecription');
	 				assert.equal(q.query.filtered.query.bool.should[3].match_phrase.vacTitle, terms[1], 'term incorrect for vacTitle');
	 				assert.equal(q.query.filtered.query.bool.should[4].match_phrase.vacDescription, terms[2], 'term incorrect for vacDecription');
	 				assert.equal(q.query.filtered.query.bool.should[5].match_phrase.vacTitle, terms[2], 'term incorrect for vacTitle');	 					 				
	 				done(); 					
 				}		

 			});

 		}); 

 		it('should generate a filter for a single org', function(done){
 			var search, org;
 			
 			org = 80;
 			search = new base({ orgs: org});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.filter.bool.must[0].terms.orgNo, org, 'org incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a filter for multiple orgs', function(done){
 			var search, orgs;
 			
 			orgs = [80,56,463];
 			search = new base({ orgs: orgs});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.deepEqual(q.query.filtered.filter.bool.must[0].terms.orgNo, orgs, 'orgs incorrect');
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

 		it('should generate a filter for a single work pattern', function(done){
 			var search, pattern;
 			
 			pattern = 1;
 			search = new base({ workPatterns: pattern});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.filter.bool.must[0].terms.vacFullTime, pattern, 'work pattern incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a filter for multiple work patterns', function(done){
 			var search, patterns;
 			
 			patterns = [1, 2, 5];
 			search = new base({ workPatterns: patterns});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.deepEqual(q.query.filtered.filter.bool.must[0].terms.vacFullTime, patterns, 'work patterns incorrect');
	 				done(); 					
 				}		

 			});

 		});  		

 		it('should generate a filter for a single job type', function(done){
 			var search, jobtype;
 			
 			jobtype = 1;
 			search = new base({ jobTypes: jobtype});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.filter.bool.must[0].terms.vacPermanent, jobtype, 'job type incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a filter for multiple job types', function(done){
 			var search, jobtypes;
 			
 			jobtypes = [1, 2, 5];
 			search = new base({ jobTypes: jobtypes});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.deepEqual(q.query.filtered.filter.bool.must[0].terms.vacPermanent, jobtypes, 'job types incorrect');
	 				done(); 					
 				}		

 			});

 		}); 

 		it('should generate a filter for a single category', function(done){
 			var search, category;
 			
 			category = 4;
 			search = new base({ categories: category});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.equal(q.query.filtered.filter.bool.must[0].terms.vacCatNo, category, 'category incorrect');
	 				done(); 					
 				}		

 			});

 		});

 		it('should generate a filter for multiple categories', function(done){
 			var search, categories;
 			
 			categories = [4, 7, 8];
 			search = new base({ categories: categories});

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{			
	 				assert.equal(q.query.filtered.filter.bool.must.length, 1, 'incorrect length of array');				
	 				assert.deepEqual(q.query.filtered.filter.bool.must[0].terms.vacCatNo, categories, 'categories incorrect');
	 				done(); 					
 				}		

 			});

 		});
 	});	
 });


/**
 *==================================================================
 *	UNIT TESTS FOR /searches/vacancies/live
 *==================================================================
 */

 describe('test suite for searches/vacancies/live.js', function(){
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

 		it('should generate a query which excludes internal only vacancies', function(done){
 			var search;
 			
 			search = new live();

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{				
	 				assert.equal(q.query.filtered.query.bool.must_not.length, 1, 'incorrect length of array');	 					 				
	 				assert.equal(q.query.filtered.query.bool.must_not[0].match_phrase.vacDescription, 'internal only');	 				
	 				done(); 					
 				}		

 			});

 		}); 

 		it('should generate a filter for live vacancies only', function(done){
 			var search, year, month, day, hour, min, sec;

 			year = 2015;
 			month = 10;
 			day = 21;
 			hour = 14;
 			min = 44;
 			sec = 22;

 			// mock out the creation of dates
 			sandbox.useFakeTimers(new Date(year,month,day,hour,min,sec).getTime());
 			//sandbox.useFakeTimers(new Date('2015-10-21 14:55').getTime());

 			search = new live();

 			search.toQuery(function(err, q){ 	
 				if(err){ done(err); }
 				else{	
 					// requires +1 to month because in js months are zero based
 					var closingDateGte = year + '-' + (month + 1) + '-' + day + 'T00:00:00';
 					var postedDateLte = year + '-' + (month + 1) + '-' + day + 'T' + hour + ':' + min + ':' + sec;

 					// confirm that we filter out closed vacancies; also checks format of date
 					assert.equal(q.query.filtered.filter.bool.must[0].range.vacClosingDate.gte, closingDateGte);
 					// confirm that we filter out vacancies not yet posted; also checks format of date
 					assert.equal(q.query.filtered.filter.bool.must[1].range.vacDatePosted.lte, postedDateLte); 				
	 				done(); 					
 				}		

 			});

 		});  		
 	});	
 });