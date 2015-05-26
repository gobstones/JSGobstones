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


/// <reference path="../utilities/Spatial.ts" />
/// <reference path="Cell.ts" />
/// <reference path="IBoard.ts" />
/// <reference path="../language/GobstonesTypes.ts" />
/// <reference path="../language/GobstonesBuiltins.ts" />
/// <reference path="../exceptions/SelfDestructionException.ts" />

class Board implements IBoard {
		
	size:Dimension;
	head:Point;
	cells:Array<Array<ICell>>;

	constructor(size:Dimension) {
		this.size = size
		this.head = new Point(0,0)
		this.initializeBoard()
	}
	
	getSize():Dimension { return this.size  }
	getHead():Point  	{ return this.head  }
	getCells():Array<Array<ICell>> { return this.cells }
	
	createCell():ICell {
		return new Cell()
	}
	
	initializeBoard() {
		this.cells = new Array<Array<Cell>>();
		this.getRegion().eachPoint((point:Point) => {
			if (this.cells[point.y] == null) {
				this.cells[point.y] = new Array<Cell>();
			}
			this.cells[point.y][point.x] = this.createCell()	
		})
	}
	
	getRegion():Region {
		return new Region(new Point(0,0), this.size)
	}
	
	getCurrentCell():ICell {
		return this.cells[this.head.y][this.head.x];
	}
	
	/* Board API */
	
	goToBoundary(direction:Direction) {
		var newPoint:Point = new Point(0,0)
		
		if (direction.delta.y > 0) {
			newPoint.y = this.size.height -1
		}
		
		if (direction.delta.x > 0) {
			newPoint.x = this.size.width -1
		}
		
		this.head = newPoint;
	}
	
	move(direction:Direction) {
		if (this.canMove(direction)) {
			this.head = this.head.plus(direction.delta);
		} else {
			throw new SelfDestructionException("Cannot move");
		}
	}
	
	canMove(direction:Direction) {
		return this.head.plus(direction.delta).inRegion(this.getRegion());
	}
	
	existStones(color:Color):boolean {
		return this.getCurrentCell().existStones(color)
	}
	
	numberOfStones(color:Color):number {
		return this.getCurrentCell().numberOfStones(color)
	}
	
	putStone(color:Color) {
		this.getCurrentCell().putStone(color)
	}
	
	takeStone(color:Color) {
		this.getCurrentCell().takeStone(color)
	}
	
	clearBoard() {
		this.getRegion().eachPoint((point:Point) => {
			this.cells[point.y][point.x].clear()	
		})
	}
}
