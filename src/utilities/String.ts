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

interface String {
    times(n:number):string;
	toArray():Array<string>;
}

String.prototype.times = function(n) {
	var output = ""
	for (var i = n; i > 0; i--) {
		output += this
	}	
    return output
}

String.prototype.toArray = function() {
	var output:Array<string> = new Array<string>()
	for (var i = 0; i < this.length; i++) {
		output.push(this.charAt(i))
	}
	return output
}