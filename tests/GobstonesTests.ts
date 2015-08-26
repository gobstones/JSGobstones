/// <reference path="./TestCase.ts" />

var GobstonesTests = [
    
    TestCase.automated(
        "GobstonesTest1",
        { numbers : [ [1,2,3] ] },
        "res := 0 \
         foreach n in $numbers \
          { res := res * 10 + n } \
         return(res)",
        (args) => {
            return args.numbers.reduce((r, n) => r + n, 0)
        }
    )
    
]