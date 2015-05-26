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


/// <reference path="Functional.ts" />

class Dimension {
	width:number
	height:number
	
	constructor(width:number, height:number) {
		this.width = width
		this.height = height
	}
	
	toPoint():Point {
		return new Point(this.width, this.height)
	}
}

class Region {
	/* TODO: Currently only working for regions 
		     with positive origins and dimensions.
			 Make this more generic..
	*/	
	
	dimension:Dimension;
	origin:Point;
	
	constructor(origin:Point, dimension:Dimension) {
		this.origin = origin;
		this.dimension = dimension;
	}
	
	contains(aPoint:Point):boolean {
		return aPoint.greaterEqualThan(this.origin) && aPoint.lessThan(this.origin.plus(this.dimension.toPoint()))
	}
	
	eachPoint(f:Function) {
		forRangeDo(this.origin.y, this.origin.y + this.dimension.height,
			(y:number) => {
				forRangeDo(this.origin.y, this.origin.y + this.dimension.height,
					(x:number) => {
						f(new Point(x,y))	
					}
				)
			}
		)
		
	}
}

class Point {
	
	x:number
	y:number
	
	constructor(x:number, y:number) {
		this.x = x
		this.y = y
	}
	
	plus(aPoint:Point):Point {
		return new Point(this.x + aPoint.x, this.y + aPoint.y)
	}
	
	greaterEqualThan(aPoint:Point):boolean {
		return this.x >= aPoint.x && this.y >= aPoint.y;
	}
	
	greaterThan(aPoint:Point):boolean {
		return this.x > aPoint.x && this.y > aPoint.y;
	}
	
	lessThan(aPoint:Point):boolean {
		return this.x < aPoint.x && this.y < aPoint.y;
	}
	
	lessEqualThan(aPoint:Point):boolean {
		return this.x <= aPoint.x && this.y <= aPoint.y;
	}
	
	inRegion(aRegion:Region):boolean {
		return aRegion.contains(this)
	}
}