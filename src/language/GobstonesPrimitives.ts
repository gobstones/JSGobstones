/// <reference path="../utilities/Functional.ts" />
	
function declareFunction(f:Function):Function {
    return function () {
        arguments[0] = arguments[0].clone()
        return f.apply(this, arguments)
    }
}

function returnVars() {
  for(var i = 0; i < arguments.length; i++) {
  	  var arg = arguments[i];
      console.log(arg[0] + " -> " + arg[1])
      console.log("OK")
  };
}
