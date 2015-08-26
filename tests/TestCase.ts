

class TestCase {
    
    test: (assert:any) => void
    name: string
    
    constructor(name, f) { 
        this.test = f
        this.name = name
    }
    
    static automated(name:String, args, gbscode:String, jsfunction:(any)=>any, nretvals:number=1) { 
        return new TestCase(name,
            (assert) => {
                var gbs_script = "program { " + gbscode.replace("$numbers", "[" + args.numbers[0].join(",") + "]") + " }"
                assert.ok(JSGobstones.run(gbs_script) == jsfunction(args))
        });
    }
}