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


interface IDictionary {
    put(key:any, value:any): void
    get(key:any, elseValue:any):any
    remove(key:any): void
    containsKey(key:any): Boolean
    keys(): Array<any>
    values(): Array<any>
}

class Dictionary {

    _keys: Array<string> = new Array<string>()
    _values: Array<any> = new Array<any>()

    constructor(init: { key: any; value: any; }[]=null) {
        if (init != null) {
            for (var x = 0; x < init.length; x++) {
                this[init[x].key] = init[x].value
                this._keys.push(init[x].key)
                this._values.push(init[x].value)
            }
        }
    }

    put(key: any, value: any) {
        this[key] = value
        this._keys.push(key)
        this._values.push(value)
    }

    get(key:any, elseValue:any=null):any {
        if (typeof this[key] === "undefined") {
            return elseValue
        } else {
            return this[key]
        }   
    }

    remove(key: any) {
        var index = this._keys.indexOf(key, 0)
        this._keys.splice(index, 1)
        this._values.splice(index, 1)

        delete this[key];
    }

    keys(): Array<any> {
        return this._keys;
    }

    values(): Array<any> {
        return this._values
    }

    containsKey(key: any) {
        if (typeof this[key] === "undefined") {
            return false
        }

        return true
    }

    toLookup(): IDictionary {
        return this
    }
}
