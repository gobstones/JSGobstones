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


/// <reference path="../utilities/Dictionary.ts" />
/// <reference path="../utilities/Functional.ts" />
/// <reference path="ICell.ts" />

class Cell implements ICell {

  stones:IDictionary;

  constructor() {
      this.stones = new Dictionary();
  }

  putStone(color:Color) {
    this.setStones(color, this.numberOfStones(color) + 1)
  }
  
  takeStone(color:Color) {
    if (this.existStones(color)) {
      this.setStones(color, this.numberOfStones(color) - 1)
    } else {
      throw new SelfDestructionException("Cannot take stones.")
    }
  }
  
  setStones(color:Color, count:number) {
    this.stones.put(color.value, count);
  }
  
  getStones(color:Color):number {
    return this.stones.get(color.value, 0)
  }
  
  existStones(color:Color):boolean {
    return this.numberOfStones(color) > 0;
  }
  
  numberOfStones(color:Color):number {
    return this.getStones(color)
  }
  
  clear() {
    this.stones = new Dictionary();
  }
  
  /* Iteration */
	
	eachExistentStoneColor(f:(color:Color)=>void) {
		foreach(this.stones.keys(), f)
	}
  
  /* Merge and Copy */
  
  mergeWith(otherCell:Cell) {
		otherCell.eachExistentStoneColor((color:Color) => {
			this.setStones(color, this.numberOfStones(color) + otherCell.numberOfStones(color))
		})
	}
	
	copyFrom(otherCell:Cell) {
		this.clear()
		otherCell.eachExistentStoneColor((color:Color) => {
			this.setStones(color, otherCell.numberOfStones(color))
		})
	}
}
