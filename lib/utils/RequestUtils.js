function paginate (array, page_size, page_number) {
  return array.slice(
    (page_number - 1) * page_size, page_number * page_size
  );
}
  
function parseQueryInteger (request, property, defaultValue) {
  return !request.query[property] 
    || isNaN(parseInt(request.query[property]))
    ? defaultValue
    : parseInt(request.query[property]);
}
  
module.exports = {
  paginate,
  parseQueryInteger
};
