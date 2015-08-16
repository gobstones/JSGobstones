// Author: Ary Pablo Batista <arypbatista@gmail.com>

{

  Array.prototype.purge = function () {
    return this.filter(function(n) { return n != undefined }); 
  };
  const OB = "{";
  const CB = "}";

  var oldJoin = Array.prototype.join;

  Array.prototype.joinp = function () {
    var separator = arguments[0] || "";
    return this.purge().join(separator); 
  };

  Array.prototype.subset = function () {
   var arr = [];
   var _this = this;
   for (var i = 0; i < arguments.length; i++) {
     var index = arguments[i];
     arr.push(_this[index]);
   };
   return arr;
  };

  Array.prototype.flatten = function () {    
    var args = arguments;
    return this.reduce(function (prev, curr) {
      return prev.concat(curr.subset.apply(curr, args));
    }, []);
  };

  function buildInteractiveBody(branches) {
    return [ "{",
        "var _key = API.read();",
        "while (_key != K_CTRL_D) {",
            "switch (_key) {",
                branches,
            "}",
            "API.show();",
            "_key = API.read();",
        "}",
     "}"
    ].join("\n")
  }

  function buildProgramReturnArgs(args) {
   console.log(args);
   return args.map (function (expr) {
       return ["'"+expr+"'", expr]
   });
  }

  function buildMultipleAssign(vars, exprs) {
   return "var $exprs = " + exprs + ";\n" + vars.map(function (v, i) {
     return v + " = $exprs[" + i + "]"
   }).join("\n");  

  }
}


// ########################################
//  Gobstones 
// ########################################

start
    = gobstones 
    
gobstones
    = _ defs:defs { return defs }
     
    
// ########################################
//  Definitions
// ########################################
    
defs
    = defs:(def _)+ { return defs.flatten(0).joinp(";\n") }

def
    = "program" _ body:programBody { return "var program = function ($board) " + body }
    / "interactive" _ "program" _ body:interactiveBody { return "var program = function ($board)" + body }
    / "procedure" _ name:procName _ params:params _ body:procedureBody { return "var " + name + "= function " + params + body; }
    / "function"  _ name:funcName _ params:params _ body:functionBody { return "var " + name + " = declareFunction(function" + params +  body + ")" }
        
params = "(" _ vars:(varList _)? ")" { return "($board" + ( vars ? "," + vars[0] : "" ) +  ")" }

programBody
    = "{" _ cmds:cmds _ rtn:(programReturn _)? "}" { return "{" + cmds + ";" + (rtn ? rtn:"") + "}" } 

functionBody
    = "{" _ cmds:cmds _ rtn:returnCmd _ "}" { return "{" + cmds + ";" + rtn + "}" }

procedureBody
    = blockCmd


// ########################################
//  Branches
// ########################################

cmdBranches
    = branches:(cmdBranch _ )+ { return branches.flatten(0) }

cmdBranch
    = defaultBranch
    / lit:literal _ action:branchAction { return "case " + lit + ":" + action + " break;" }
    
branchAction
    = branchAssocOp _ block:blockCmd { return block }
    
branchAssocOp = "->" 

defaultBranch = "_" _ action:branchAction { return "default: " + action + " break;" }

// ########################################
//  Interactive
// ########################################

interactiveBody
    = "{" _ branches:(keyBranch _)* "}" { return buildInteractiveBody(branches.flatten(0)) }

keyBranch
    = defaultBranch
    / lit:keyConstant _ action:branchAction { return "case " + lit + ":" + action + " break;" }


// ########################################
//  Commands
// ########################################

blockCmd
    = "{" _ cmds:cmds _ "}" { return "{" + cmds + "}" }

cmds 
    = cmds:(cmd _ ";"? _)* { return cmds.flatten(0).joinp(";\n"); }
    
cmd
    = simpleCmd
    / compCmd
    
programReturn
    = "return" _ "(" _ args:retExprs _ ")" { return "returnVars" + "(" + args + ")" }

retExprs
    = expr:gexp more:(_ "," _ gexp)* { return buildProgramReturnArgs([expr].concat(more.flatten(3))) }

returnCmd 
    = "return" _ args:args { return "return" + args }

simpleCmd
    = name:varName _ ":=" _ expr:gexp { return name + "=" + expr }
    / procCall
    / "Skip" { return "" }
    / varT:varTuple  _ ":=" _ expr:(multipleAssignExpr) { return buildMultipleAssign(varT, expr) }

multipleAssignExpr = funcCall
                   / e:gexpTuple { return "Array(" + e + ")" }

compCmd
    = "if" _ "(" _ bexp:bexp _ ")" (_ "then")? _ body:blockCmd elseBlock:(_ "else" _ blockCmd)? { return "if (" + bexp + ")" + body + (elseBlock? "else" + elseBlock[3]:"");}
    / "switch" _ "(" _ expr:gexp _ ")" _ "to" _ body:cmdBranches { return "switch (" + expr + ")" + OB + body + CB }

    / "foreach" _ varName:varName _ "in" _ seq:sequence _ body:blockCmd { return "foreach(" + seq + ", function (" + varName + ")" + body + ")" }
    / "repeat" _ "(" _ expr:gexp _ ")" _ body:blockCmd { return "repeat ("  + expr + ", function()"+ body +")" }
    / "while" _ "(" _ bexp:bexp _ ")" _ body:blockCmd { return "while" + "(" + bexp + ")" + body }
    / blockCmd

    
// ########################################
//  Sequences
// ########################################
    
sequence
    = "[" _ seq:sequenceDef _ "]" { return seq }

sequenceDef
    = range
    / enum

range
    = t1:gexp t2:(_ "," _ gexp)? _ ".." _ t3:gexp { return "range(" + t1 + (t2?"," + t2[3]:"") + "," + t3 + ")" }

enum
    = xs:gexpList { return "[" + xs + "]" }
    
    
// ########################################
//  Expressions
// ########################################

gexp
    = bexp

bexp
    = t1:bterm t2:(_ "||" _ bexp)? { return [t1,t2?t2[4]:undefined].joinp("||")}

bterm
    = t1:bfact t2:(_ "&&" _ bterm)? { return [t1,t2?t2[4]:undefined].joinp("&&")}

bfact
    = not:("not" _)? t:batom { return (not? "!(" + t + ")": t) }

batom
    = t1:nexp t2:(_ rop _ nexp)? { return [t1,t2?t2[4]:undefined].join(t2 ? t2[2] : "")}

nexp
    = one:nterm more:(_ nop _ nterm)* { return [one].concat(more.flatten(1,3)).joinp("") }

nterm
    = more:(nfactH _ "*" _)* last:nfactH { return more.flatten(0,2).concat(last).joinp("") }

nfactH
    = more:(nfactL _ mop _)* last:nfactL { return more.flatten(0,2).concat(last).joinp("") }

nfactL
    = one:natom more:(_ "^" _ natom)*  { return [one].concat(more.flatten(1,3)).joinp("")}

natom
    = funcCall
    / literal
    / "-" expr:natom { return "-" + expr; }
    / "(" expr:gexp ")" { return "(" + expr + ")" }
    / varName

gexpTuple
    = "(" _ gexpList:gexpList _ ")" { return "(" + gexpList + ")" }
   
gexpList
    = expr:gexp more:(_ "," _ gexp)* { 
return ([expr].concat(more.flatten(3))) }
    


// ########################################
//  Callables
// ########################################

procCall
    = name:procName _ args:args { 
return name + args }
    
// TODO
funcCall
    = name:funcName args:args { return name + args }
   
args
    = "(" gexpList:(_ gexpList)? _ ")" { return "(" + (["$board"] + (gexpList ? "," + gexpList[1]: "")) + ")" }


// ########################################
//  Operations
// ########################################

rop = "==" 
    / "/=" { return "!=" }
    / "<" 
    / "<=" 
    / ">=" 
    / ">"
nop = "+" { return "+" }
    / "-" { return "-" }
mop = "div" { return "/" }
    / "mod" { return "%" }


// ########################################
//  Identifies and names
// ########################################
    
procName
    = $upperid
    
funcName
    = $lowerid
    
varName
    = $lowerid
    
upperid
    = !reserved [A-Z] [a-zA-Z0-9_']*
    
lowerid
    = !reserved [a-z] [a-zA-Z0-9_']*
    
varTuple = "(" _ vars:varList _ ")" { return  vars }

varList  = varName:varName more:(_ "," _ varName)* { return [varName].concat(more.flatten(3)) }


// ########################################
//  Literals
// ########################################

literal 
    = numLiteral
    / boolLiteral
    / colorLiteral
    / dirLiteral
    
numLiteral
    = integer
    
boolLiteral
    = "True"
    / "False"
    
colorLiteral
    = "Verde"
    / "Rojo"
    / "Azul"
    / "Negro"
    
dirLiteral
    = "Norte"
    / "Este"
    / "Sur"
    / "Oeste"   

integer
    = digits:[0-9]+
    
// ########################################
//  Reserved
// ########################################
    
reserved = reservedId ![A-Za-z0-9_']
    
reservedId
    = "if" / "then" / "else"
    / "program" / "procedure" / "function" / "interactive"
    / "switch" / "to"
    / "foreach" / "in"
    / "Skip" / "return" / "repeat"
    / keyConstant

    
// ########################################
//  Key Constants
// ########################################

keyConstant
    = "K_SHIFT_A"
    / "K_SHIFT_B"
    / "K_SHIFT_C"
    / "K_SHIFT_D"
    / "K_SHIFT_E"
    / "K_SHIFT_F"
    / "K_SHIFT_G"
    / "K_SHIFT_H"
    / "K_SHIFT_I"
    / "K_SHIFT_J"
    / "K_SHIFT_K"
    / "K_SHIFT_L"
    / "K_SHIFT_M"
    / "K_SHIFT_N"
    / "K_SHIFT_O"
    / "K_SHIFT_P"
    / "K_SHIFT_Q"
    / "K_SHIFT_R"
    / "K_SHIFT_S"
    / "K_SHIFT_T"
    / "K_SHIFT_U"
    / "K_SHIFT_V"
    / "K_SHIFT_W"
    / "K_SHIFT_X"
    / "K_SHIFT_Y"
    / "K_SHIFT_Z"
    / "K_CTRL_A"
    / "K_CTRL_B"
    / "K_CTRL_C"
    / "K_CTRL_D"
    / "K_CTRL_E"
    / "K_CTRL_F"
    / "K_CTRL_G"
    / "K_CTRL_H"
    / "K_CTRL_I"
    / "K_CTRL_J"
    / "K_CTRL_K"
    / "K_CTRL_L"
    / "K_CTRL_M"
    / "K_CTRL_N"
    / "K_CTRL_O"
    / "K_CTRL_P"
    / "K_CTRL_Q"
    / "K_CTRL_R"
    / "K_CTRL_S"
    / "K_CTRL_T"
    / "K_CTRL_U"
    / "K_CTRL_V"
    / "K_CTRL_W"
    / "K_CTRL_X"
    / "K_CTRL_Y"
    / "K_CTRL_Z"
    / "K_ARROW_LEFT"
    / "K_ARROW_UP"
    / "K_ARROW_RIGHT"
    / "K_ARROW_DOWN"
    / "K_ENTER"
    / "K_SPACE"
    / "K_DELETE"
    / "K_BACKSPACE"
    / "K_TAB"
    / "K_ESCAPE"
    / "K_0"
    / "K_1"
    / "K_2"
    / "K_3"
    / "K_4"
    / "K_5"
    / "K_6"
    / "K_7"
    / "K_8"
    / "K_9"
    / "K_A"
    / "K_B"
    / "K_C"
    / "K_D"
    / "K_E"
    / "K_F"
    / "K_G"
    / "K_H"
    / "K_I"
    / "K_J"
    / "K_K"
    / "K_L"
    / "K_M"
    / "K_N"
    / "K_O"
    / "K_P"
    / "K_Q"
    / "K_R"
    / "K_S"
    / "K_T"
    / "K_U"
    / "K_V"
    / "K_W"
    / "K_X"
    / "K_Y"
    / "K_Z"


// ########################################
//  Whitespace and Comment Rules
// ########################################

__ "blank" = whitespace _ { return " " }
_ "blank" = (whitespace / comment)* { return " " }
whitespace "whitespace" = $([\n\r\t ])
comment "comment"
    = "//" (![\r\n] .)*
      / "/*" (!"*/" .)* "*/"