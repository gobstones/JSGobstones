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

function repeat(n:number, f:Function) {
  for(var i = n; i > 0; i--) {
    f();
  }
}

function foreach(arr:Array<any>, f:Function) {
  for(var i = 0; i < arr.length; i++) {
    f(arr[i], i);
  }
}

function foreachMinusOne(arr:Array<any>, f:Function) {
  for(var i = 0; i < arr.length-1; i++) {
    f(arr[i], i);
  }
}

function map<T, E>(arr:Array<T>, f:Function):Array<E> {
  var newArr:Array<E> = new Array<E>()
  for(var i = 0; i < arr.length; i++) {
    newArr.push(f(arr[i], i));
  }  
  return newArr
}

function reverse<T>(arr:Array<T>):Array<T> {
  var newArr:Array<T> = new Array<T>()
  foreach(arr, (e) => {
    newArr = [e].concat(newArr)
  })
  return newArr
}

function forRangeDo(from:number, to:number, f:Function) {
  for(var i = from; i < to; i++) {
    f(i)
  }
}

function join<T>(arr:Array<T>, separator:string=""):string {
  var output:string = ""
  foreachMinusOne(arr, (v:T) => {
    output += v + separator
  })
  if (arr.length > 0) {
    output += arr[arr.length-1]
  }
  return output
}

function range(from:number, to:number=null) {
  if (to == null) {
    to = from;
    from = 0;
  }
  
  var range:Array<number> = [];
  for(var i = from; i < to; i++) {
    range.push(i);
  }
  return range;
}
