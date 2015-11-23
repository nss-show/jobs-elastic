/**
 *  Utility functions.
 *
 */    

var utils = {};

/**
 * Adds parameter to an array and returns it.
 * If the parameter is an array it is simply returned.
 */
utils.toArray = function (obj){
  var array = [];
  if(obj){
    if(obj.constructor === Array){
      array = obj;
    }
    else{
      array.push(obj);          
    }
  }
  return array;    
}

module.exports = utils;