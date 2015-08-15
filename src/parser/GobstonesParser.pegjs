start
	= gobstones
	
gobstones
	= _ defs:defs _ 
	
defs
	= def
	/ def defs

def
	= "program" _ programBody
	
programBody
	= "{" _ cmds _ "}" 
	
cmds 
	= (cmd _ ";"? _)*
	
cmd
	= simpleCmd
	
simpleCmd
	= "Skip"
	/ procCall
//	/ varName ":=" gexp
//	/ varTuple1 ":=" funcCall
	
procCall
	= procName args
	
args
	= gexpTuple
	
gexpTuple
	= "(" gexps ")"
	
gexps
	= gexp
	/ gexp "," gexps
	
gexp
	= natom
	
natom
	= varName
	/ literal
	/ "(" gexp ")"
	
// Identifies and names
	
procName
	= upperid
	
funcName
	= lowerid
	
varName
	= lowerid
	
upperid
	= !reservedId head:[A-Z] tail:[a-zA-Z]* { return [head] + tail.join("") }
	
lowerid
	= !reservedId head:[a-z] tail:[a-zA-Z]* { return head + tail.join("") }
	
// Literal

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
	
// Reserved
	
reservedId
	= "if"
	
// optional whitespace
_  = [ \t\r\n]* { return undefined }

__  = [ \t\r\n]+ { return undefined }