function declareFunction(f:Function):Function {
    return function () {
        arguments[0] = arguments[0].clone()
        return f.apply(this, arguments)
    }
}

function returnVars() {
  foreach(arguments, function (arg) {
      console.log(arg + " -> " + this[arg])
      console.log("OK")
  });
}
