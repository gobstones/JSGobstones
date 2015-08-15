// Author: Ary Pablo Batista <arypbatista@gmail.com>

// ########################################
//  Gobstones 
// ########################################

start
    = gobstones
    
gobstones
    = _ defs:defs
     
    
// ########################################
//  Definitions
// ########################################
    
defs
    = def _ defs
    / def _

def
    = "program" _ programBody
    / "interactive" _ "program" _ interactiveBody
    / "procedure" _ procName _ params _ procedureBody
    / "function"  _ funcName _ params _ functionBody
        
params = "(" _ (varList _)? ")"

programBody
    = "{" _ cmds _ (returnCmd _)? "}" 

functionBody
    = "{" _ cmds _ returnCmd _ "}"

procedureBody
    = blockCmd


// ########################################
//  Branches
// ########################################

cmdBranches
    = (cmdBranch _ )+

cmdBranch
    = "_" _ branchAction
    / literal _ branchAction
    
branchAction
    = branchAssocOp _ blockCmd
    
branchAssocOp = "->" 


// ########################################
//  Interactive
// ########################################

interactiveBody
    = "{" _ (keyBranch _)* "}"

keyBranch
    = "_" _ branchAction
    / keyConstant _ branchAction

// ########################################
//  Commands
// ########################################

blockCmd
    = "{" _ cmds _ "}"

cmds 
    = (cmd _ ";"? _)*
    
cmd
    = simpleCmd
    / compCmd
    
returnCmd 
    = "return" _ args

simpleCmd
    = varName _ ":=" _ gexp
    / procCall
    / "Skip"
    / varTuple  _ ":=" _ (funcCall / gexpTuple)

compCmd
    = "if" _ "(" _ bexp _ ")" (_ "then")? _ blockCmd (_ "else" _ blockCmd)?
    / "switch" _ "(" _ gexp _ ")" _ "to" _ cmdBranches
    / "foreach" _ varName _ "in" _ sequence _ blockCmd
    / "repeat" _ "(" _ gexp _ ")" _ blockCmd
    / "while" _ "(" _ bexp _ ")" _ blockCmd
    / blockCmd

    
// ########################################
//  Sequences
// ########################################
    
sequence
    = "[" _ sequenceDef _ "]"

sequenceDef
    = range
    / enum

range
    = gexp (_ "," _ gexp)? _ ".." _ gexp

enum
    = gexpList
    
    
// ########################################
//  Expressions
// ########################################

gexp
    = bexp

bexp
    = bterm (_ "||" _ bexp)?

bterm
    = bfact (_ "&&" _ bterm)?

bfact
    = ("not" _)? batom

batom
    = nexp (_ rop _ nexp)?

nexp
    = nterm (_ nop _ nterm)*

nterm
    = nfactH (_ "*" _ nfactH)*

nfactH
    = nfactL (_ mop _ nfactL)*

nfactL
    = natom (_ "^" _ natom)*

natom
    = funcCall
    / literal
    / "-" natom
    / "(" gexp ")"
    / varName

gexpTuple
    = "(" _ gexpList _ ")"
   
gexpList
    = gexp (_ "," _ gexp)*
    


// ########################################
//  Callables
// ########################################

procCall
    = procName _ args
    
funcCall
    = funcName args
    
args
    = "(" (_ gexpList)? _ ")"


// ########################################
//  Operations
// ########################################

rop = "==" / "/=" / "<" / "<=" / ">=" / ">"
nop = "+" / "-"
mop = "div" / "mod"


// ########################################
//  Identifies and names
// ########################################
    
procName
    = upperid
    
funcName
    = lowerid
    
varName
    = lowerid
    
upperid
    = !reserved $([A-Z] [a-zA-Z0-9_']*)
    
lowerid
    = !reserved $([a-z] [a-zA-Z0-9_']*)
    
varTuple = "(" _ varList _ ")"

varList  = varName (_ "," _ varName)*


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

__ "blank" = whitespace _
_ "blank" = (whitespace / comment)*
whitespace "whitespace" = [\n\r\t ]
comment "comment"
    = "//" (![\r\n] .)*
//    / "#"  (![\r\n] .)*
//    / "--" (![\r\n] .)*
    / "/*" (!"*/" .)* "*/"
//    / "{-" (!"-}" .)* "-}"
//    / "\"\"\"" (!"\"\"\"" .)* "\"\"\""