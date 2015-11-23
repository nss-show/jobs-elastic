/**
 *  Default query for organisations.
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
    self.terms        = util.toArray(options.terms);
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

  // match terms
  this.terms.forEach(function(term){
    query.bool.should.push(
      { match_phrase: { orgName : term } },
      { match_phrase: { orgDescription: term } }
    );
  });

  // organisation types
  if(this.orgTypes.length > 0){
    filter.bool.must.push({
      terms: { orgType: this.orgTypes }
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
