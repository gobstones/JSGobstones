// Author: Ary Pablo Batista <arypbatista@gmail.com>
/*
	This file is part of JSGobstones.
    JSGobstones is free software: you can redistribute it and/or 
    modify it under the terms of the GNU General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/


/// <reference path="GobstonesConstants.ts" />
/// <reference path="../utilities/Functional.ts" />
/// <reference path="../board/Board.ts" />


function Mover(board:IBoard, direction:Direction) {
	board.move(direction)
}

function Poner(board:IBoard, color:Color) {
	board.putStone(color);
}

function Sacar(board:IBoard, color:Color) {
	board.takeStone(color);
}

function BOOM(message) {
	throw new GobstonesException("BOOM")
}

function gbsRange(minValue:any, maxValue:any):Array<any> {
	if (minValue instanceof GobstonesEnum) {
		return GobstonesEnum.range(minValue, maxValue)
	} else if (typeof minValue == "number") {
		return range(minValue, maxValue)		
	}
}

function minDir():Direction {
	return Norte
}

function maxDir():Direction {
	return Oeste
}