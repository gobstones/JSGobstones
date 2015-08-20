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


/// <reference path="GobstonesTypes.ts" />
/// <reference path="../utilities/Spatial.ts" />



var Norte:Direction = new Direction("Norte", new Point(0, 1))
var Este :Direction = new Direction("Este",  new Point(1, 0))
var Sur  :Direction = new Direction("Sur",   new Point(0,-1))
var Oeste:Direction = new Direction("Oeste", new Point(-1, 0))


var Azul :Color = new Color("Azul")
var Negro:Color = new Color("Negro")
var Rojo :Color = new Color("Rojo")
var Verde:Color = new Color("Verde")