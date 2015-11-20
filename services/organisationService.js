/**
 *	Service for organisations
 */

var searches = {
  base: require('../searches/organisations/base')    
};

var client = require('../client');

/*
  Organisations returned by this service may not have live vacancies.  
  The service therefore excludes contact details from results. 
*/
var contactFields = [
  'orgContactName',
  'orgContactEmail',
  'orgContactTel',
  'orgContactFax'
];     

/**
 *  Constructor
 */
var OrganisationService = function(index, type){
  this.index = index;
  this.type = type;    
  this.client = client.get();
}

/**
 *  Map Health Board code to organisation id.
 *  If no match is found the code parameter is
 *  simply returned in the callback.
 */
OrganisationService.prototype.mapHbCode = function(code, next){    
  var org;

  switch(code){
      case 'nss':
          org = [463,19];
          break;
      default:
          org = code;
  }  
  next(org);    
}

/**
 *  Search for organisations.  
 */
OrganisationService.prototype.search = function(options, next){
  var search, self = this;;

  // set default values for undefined options
  options = options || {};
  options.size = options.size || 100;
  options.from = options.from || 0;

  // create search instance, initialize with options
  search = new searches.base({
      id          : options.id,
      orgTypes    : options.orgtype,
      terms       : options.term
  });

  // build the query
  search.toQuery(function(err, q){
    if(err){
      next(err);
    }else{
      // execute the search
      self.client.search({
        index         : this.index,
        type          : this.type,
        _sourceInclude: options.field,
        _sourceExclude: contactFields,
        body          : q,
        size          : options.size,
        from          : options.from
      }, function(err, results){
        if(err){
          next(err);
        }else{
          next(null, results);
        }
      })
    }
  });  
}

/**
 * Get a single organisation by id.  
 */
OrganisationService.prototype.getById = function(id, next){
  var self = this;

  self.client.get({
    index         : this.index,
    type          : this.type,
    id            : id,
    _sourceExclude: contactFields,    
    ignore        : 404 // if not found do not throw an error
  },function(err, result, status){
    if(err){
      next(err);
    }else{
      next(null, result, status);
    }
  });  
}

module.exports = OrganisationService;