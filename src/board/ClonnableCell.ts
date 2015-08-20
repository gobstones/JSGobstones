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


/// <reference path="Cell.ts" />

class ClonnableCell extends Cell {
    
	parent:Cell;
	
	constructor(parent:Cell=null) {
		super()
		this.parent = parent
	}
	
	/* Cell API */
	
	numberOfStones(color:Color):number {
		var count:number = super.numberOfStones(color)
		if (this.parent != null) {
			count += this.parent.numberOfStones(color)
		}
		return count
	}
	
	takeStone(color:Color) {
		if (this.parent != null && !this.existStones(color)) {
			this.mergeWith(this.parent)
			this.parent = null
		}	
		super.takeStone(color)
	}
	
	clear() {
		this.parent = null
		super.clear()
	}
		
	/* Clone support */
		
	clone() {
		var clonnedCell:ClonnableCell = new ClonnableCell()
		clonnedCell.copyFrom(this)
		return clonnedCell
	}
}