var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

function modeGBS() {
  $("#modeGBS").addClass("active");
  $("#modeJS").removeClass("active");
  editor.setValue("Write your Gobstones program here...");
}

function modeJS() {
  $("#modeJS").addClass("active");
  $("#modeGBS").removeClass("active");
  editor.setValue("//This is an example program for JSGobstones\nvar puedePonerCuadrado = declareFunction(function (t) {\n    var puede = true;\n    foreach(gbsRange(minDir(), maxDir()), function (d) {\n        if (puedeMover(t, d)) {\n            Mover(t, d);\n        }\n        else {\n            puede = false;\n        }\n    });\n    return (puede);\n});\n// procedure\nfunction PonerCuadrado(t, c) {\n    foreach(gbsRange(minDir(), maxDir()), function (d) {\n        Poner(t, c);\n        Mover(t, d);\n    });\n}\n// program\nfunction program(t) {\n    //Mover(t, Norte)\n    //Poner(t, Verde)\n    if (puedePonerCuadrado(t)) {\n        PonerCuadrado(t, Azul);\n    }\n    return ([2, 3]);\n}");
}

function executeGobstones(program_text) {
  var parsed = parser.parse(program_text);
  var result = executeJSGobstones(parsed + ";");
  
  return "Result:\n " + result + "\n\n" + "JS Code:\n " + parsed;
}

function executeJSGobstones(program_text) {
  var jsprogram = "(function () {\n " + program_text + " var t = new ClonnableBoard(new Dimension(6, 6)); return [t, program(t)]; \n})();";
    console.log("Executing:\n" + jsprogram);
    var evalResult = eval(jsprogram);            
    console.log("Eval result:", evalResult[0], evalResult[1]);
    result = (new BoardPrinter()).toString(evalResult[0]);
    result = escapeHtml(result).replace("\n", "<br/>").replace(" ", "&nbsp;");  
    return result;
}
      
function execute() {
  var result = "Couldn't obtain an output...";
  try {
    if ($("#modeJS").hasClass("active")) {
      result = executeJSGobstones(editor.getValue());
    } else {
      result = executeGobstones(editor.getValue());
    }
  } catch(e) {
    result = e;
  }
  $("#outputBoard").html(result);
}