var _ = function(callback) {
  window.addEventListener('load', callback, false);
};

_.extend = function(d, s) {
  for(var k in s){
    if(s.hasOwnProperty(k)){
      d[k] = s[k];
    }
  }
  return d;
};
