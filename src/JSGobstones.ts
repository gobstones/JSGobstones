/// <reference path="./board/Board.ts" />
/// <reference path="./board/ClonnableBoard.ts" />
/// <reference path="./board/IBoard.ts" />
/// <reference path="./parser/Parser.ts" />

class JSGobstones {

    static escapeHtml(string) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        }
        return String(string).replace(/[&<>"'\/]/g, (s) => entityMap[s])
    }
    
    static runJS(program_text) {
        
        var jsprogram = "(function () {\n " + program_text + " var t = new ClonnableBoard(new Dimension(6, 6)); return [t, program(t)]; \n})();"
        console.log("Executing:\n" + jsprogram)
        var evalResult = eval(jsprogram)
        console.log("Eval result:", evalResult[0], evalResult[1])
        
        var result = (new BoardPrinter()).toString(evalResult[0])
        
        result = this.escapeHtml(result).replace("\n", "<br/>").replace(" ", "&nbsp;")
        
        console.log(result)
        
        return evalResult[1]
        
    }
    
    static run(programText) {
        var parsed = parser.parse(programText)
        return this.runJS(parsed)
    }
}