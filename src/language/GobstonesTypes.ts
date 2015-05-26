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
/// <reference path="../exceptions/GobstonesException.ts" />

class GobstonesEnum {
	
	value:number
	_name:string
		
	constructor(name:string=null) {		
		this.getCases().push(this)
		this.value = this.getCases().length -1
		this._name = name 
	}
	
	getCases():Array<GobstonesEnum> {
		throw new GobstonesException("Subclass responsability")
	}
	
	name():string {
		if (this._name == null) {
			return this.value.toString()
		} else {
			return this._name
		}
	}
	
	static range(minValue:GobstonesEnum, maxValue:GobstonesEnum):Array<GobstonesEnum> {
		var values = new Array<GobstonesEnum>()
		var i:GobstonesEnum = minValue;
		while (i.value < maxValue.value) {
			values.push(i)
			i = i.next()
		}
		values.push(i)
		return values
	}
	
	getCase(value:number):GobstonesEnum {
		return this.getCases()[value % this.getCases().length]
	}
	
	next():GobstonesEnum {
		return this.getCase(this.value+1)
	}
}


class Color extends GobstonesEnum {
	
	static cases:Array<Color> = new Array<Color>()
	
	getCases():Array<Color> {
		return Color.cases
	}
}

class Direction extends GobstonesEnum {
	
	static cases:Array<Direction> = new Array<Direction>()
	
	delta:Point
	
	constructor(name:string, delta:Point) {
		super(name)
		this.delta = delta
	}
	
	getCases():Array<Direction> {
		return Direction.cases
	}
}