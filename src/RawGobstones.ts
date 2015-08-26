// Author: Ary Pablo Batista <arypbatista@gmail.com>
/*
    This file is part of JSGobstones.
    JSGobstones is free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    JSGobstones is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with JSGobstones.  If not, see <http://www.gnu.org/licenses/>.
*/
/// <reference path="./language/GobstonesBuiltins.ts" />
/// <reference path="./language/GobstonesConstants.ts" />
/// <reference path="./board/Board.ts" />
/// <reference path="./board/ClonnableBoard.ts" />
/// <reference path="./board/IBoard.ts" />
/// <reference path="./board/BoardPrinter.ts" />
/// <reference path="./language/GobstonesPrimitives.ts" />
/// <reference path="./parser/Parser.ts" />
/// <reference path="./JSGobstones.ts" />


// function
var puedePonerCuadrado = declareFunction(function (t) {
    var puede = true
    foreach(gbsRange(minDir(), maxDir()), function (d) {
        if (puedeMover(t, d)) {                    
            Mover(t, d)
        } else {
            puede = false
        }
    });
    
    return(puede)
})

// procedure
function PonerCuadrado(t, c) {
    foreach(gbsRange(minDir(), maxDir()), function (d) {
        Poner(t, c)
        Mover(t, d)
    });
}

// program
function program(t) {
    //Mover(t, Norte)
    //Poner(t, Verde)
    if (puedePonerCuadrado(t)) {
        PonerCuadrado(t, Azul);     
    }   
    
    return ([2,3])
}

var t:IBoard = new ClonnableBoard(new Dimension(4, 4));
console.log(program(t));
(new BoardPrinter()).print(t);

var textProgram = "" +
"program {"+
"    Skip "+
"}        "

console.log(parser.parse(textProgram))