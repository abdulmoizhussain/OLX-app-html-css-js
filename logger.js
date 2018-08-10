// var a = 'ccccccccc';
// logit({ a });
function log(variable) {
  // METHOD-1
  // var a='asd'; log({a});
  for (key in variable) {
    if (variable.hasOwnProperty(key))
      console.log(key, variable[key]);
  }

  // METHOD-2
  // var a='asd'; log(a);
  // for (key in window)
  //   if (window[key] === variable)
  //     console.log(key, variable);
  
  // METHOD-3
  // var a='aasdas'; log({a});
  // console.log(Object.keys(variable)[0], variable);
}
