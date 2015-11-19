/**
 *  Default query for vacancies.
 *
 */
var util = require('../../util');
/**
 *  Constructor
 */
var Base = function(options){
    // set default values for undefined options
    options = options || {};
    
    var self          = this;
    self.id           = options.id;    
    self.ref          = options.ref;
    self.workPatterns = util.toArray(options.workPatterns);
    self.terms        = util.toArray(options.terms);
    self.orgs         = util.toArray(options.orgs);
    self.jobTypes     = util.toArray(options.jobTypes);
    self.categories   = util.toArray(options.categories);
    self.orgTypes     = util.toArray(options.orgTypes);

};

/**
 *  Generates the search query.  The query is returned as JSON.
 *
 *  @param {callback} next - The callback to pass control to.
 *
 */
Base.prototype.toQuery = function(next){  

  // define the skeleton query
  var query = { bool: { must:[], must_not:[], 
    should:[], minimum_number_should_match: 1 } };

  var filter = { bool: { must:[], must_not:[], 
    should:[] } };

  var body = {
    query : {
      filtered: {
        query: query,
        filter: filter
      }
    }
  };

  // reference
  if(this.ref){
    query.bool.must.push({
      wildcard: { vacRef: this.ref.toLowerCase() + '*' }
    });
  }  

  // match terms
  this.terms.forEach(function(term){
    query.bool.should.push(
      { match_phrase: { 'vacDescription': term } },
      { match_phrase: { 'vacTitle': term } }
    );
  });

  // organisations
  if(this.orgs.length > 0){
    filter.bool.must.push({
      terms: { orgNo: this.orgs }
    });
  }

  // organisation types
  if(this.orgTypes.length > 0){
    filter.bool.must.push({
      terms: { orgType: this.orgTypes }
    });
  }  

  // work patterns
  if(this.workPatterns.length > 0){
    filter.bool.must.push({
      terms: { vacFullTime: this.workPatterns }
    });    
  }

  // job types
  if(this.jobTypes.length > 0){
    filter.bool.must.push({
      terms: { vacPermanent: this.jobTypes }
    });    
  }

  // categories
  if(this.categories.length > 0){
    filter.bool.must.push({
      terms: { vacCatNo: this.categories }
    });
  }

  // id
  if(this.id){
    filter.bool.must.push({
      term: { _id: this.id }
    });
  }  

  next(null, body);
};



// module.exports allows us to pass this to other files when it is called
module.exports = Base;
