/**
 *  Live query for vacancies.  
 *
 *  This class inherits from Base, adding additional 
 *  filters to ensure that only live, public vacancies
 *  are returned.
 *
 */
var Base = require('./base');
var moment = require('moment');

/**
 *  Constructor
 */
var Live = function(options){
  Base.call(this, options);
};

Live.prototype = Object.create(Base.prototype);
Live.prototype.constructor = Live;

/**
 *  Generates the search query.  The query is returned as JSON.
 *  Overrides Base implementation.
 *
 *  @param {callback} next - The callback to pass control to.
 *
 */
Live.prototype.toQuery = function(next){  

  // retrieve default query from base class
  Base.prototype.toQuery.call(this, function(err, q){
    if(err){
      next(err);
    }
    else{
      var query = q.query.filtered.query;
      var filter = q.query.filtered.filter;

      // ensure internal only vacancies are excluded
      query.bool.must_not.push({ 
        match_phrase: { 
          vacDescription: 'internal only' 
        }
      });

      // ensure only live vacancies are returned
      // closing date must be >= today at midnight
      filter.bool.must.push({
          range: {
              vacClosingDate: {
                  gte: moment().format('YYYY-MM-DDT00:00:00')
              }
          }
      });
      // posted date must be <= now
      filter.bool.must.push({
          range: {
              vacDatePosted: {
                  lte: moment().format('YYYY-MM-DDTHH:mm:ss')
              }
          }
      });

      next(null, q);
    }
  });
}


// module.exports allows us to pass this to other files when it is called
module.exports = Live;
