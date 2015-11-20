/**
 *	Service for vacancies
 */
var searches = {
    base: require('../searches/vacancies/base'),
    live: require('../searches/vacancies/live')
};

var client = require('../client');

/**
 *  Constructor
 */
var VacancyService = function(index, type){
    this.index = index;
    this.type = type;
    this.client = client.get();

    if(!this.client){
        throw new Error('Client does not exist. Call "connect" to create client.');
    }
}

/**
 *  Search for vacancies
 */
VacancyService.prototype.search = function(options, next){
    var search, self = this;

    // set default values for undefined options
    options = options || {};
    options.size = options.size || 100;
    options.from = options.from || 0;

    // create search instance, initialize with options
    search = new searches.live({
        id          : options.id,
        workPatterns: options.pattern,
        orgs        : options.org,
        categories  : options.category,
        ref         : options.ref,
        orgTypes    : options.orgtype,
        jobTypes    : options.jobtype,
        terms       : options.term                     
    });

    // build the query
    search.toQuery(function(err, q){
        if(err){
            next(err);
        }else{
            // execute the search
            self.client.search({
                index   : self.index,
                type    : self.type,
                _source : options.field,
                body    : q,
                size    : options.size,
                from    : options.from
            }, function(err, results){
                if(err){
                    next(err);
                }else{
                    next(null, results);
                }
            })
        }
    });      
};

/**
 *  Get a single vacancy by id.
 */  
VacancyService.prototype.getById = function(id, next){
    var self = this;

    self.client.get({
        index   : self.index,
        type    : self.type,
        id      : id, 
        ignore  : 404 // if not found do not throw an error
    },function(err, result, status){
        if(err){
            next(err);
        }else{
            next(null, result, status);
        }
    });
}

module.exports = VacancyService;

