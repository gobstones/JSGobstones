function declareFunction(f:Function):Function {
    return function () {
        arguments[0] = arguments[0].clone()
        return f.apply(this, arguments)
    }
}