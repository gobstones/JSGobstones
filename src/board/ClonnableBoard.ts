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


/// <reference path="Board.ts" />
/// <reference path="ClonnableCell.ts" />

class ClonnableBoard extends Board {
	
	static MAX_RECURSION_DEPTH:number = 10
	
	parent:ClonnableBoard
	changed:boolean
	recursionDepth:number = 0
	
	constructor(size:Dimension, parent:ClonnableBoard=null) {
		super(size)
		this.parent = parent
	}
		
	createCell():ICell {
		return new ClonnableCell()
	}
		
	/* Board API */
		
	putStone(color:Color) {
		super.putStone(color)
		this.changed = true
	}
	
	takeStone(color:Color) {
		super.takeStone(color)
		this.changed = true
	}
	
	/* Clone support */
	
	clone():ClonnableBoard {
		if (this.recursionDepth == ClonnableBoard.MAX_RECURSION_DEPTH) {
			return this.cloneWithoutDependency()
		} else {
			return this.cloneWithDependency()
		}
	}
	
	cloneWithoutDependency():ClonnableBoard {
		var clonnedBoard:ClonnableBoard = new ClonnableBoard(this.size)
		clonnedBoard.copyFrom(this)
		return clonnedBoard
	}
	
	cloneWithDependency():ClonnableBoard {
		var clonnedBoardParent:ClonnableBoard;
			
		if (this.changed || this.parent == null) {
			// Let's be brothers
			clonnedBoardParent = new ClonnableBoard(this.size)
			clonnedBoardParent.copyFrom(this)
			this.parent = clonnedBoardParent
			this.clearBoard()
		} else {
			// Luke, I am your father
			clonnedBoardParent = this.parent
		}
		
		var clonnedBoard:ClonnableBoard = new ClonnableBoard(this.size, clonnedBoardParent)
		clonnedBoard.head = this.head
		return clonnedBoard
	}
	
	copyFrom(otherBoard:ClonnableBoard) {
		this.size = otherBoard.size
		this.head = otherBoard.head		
		this.getRegion().eachPoint((point:Point) => {
			this.cells[point.y][point.x].copyFrom(otherBoard.cells[point.y][point.x])	
		})
	}
	
}