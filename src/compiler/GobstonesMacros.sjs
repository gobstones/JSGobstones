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

operator ++ 12 left { $xs, $ys } => #{ $xs.concat($ys) }

let procedure = macro {
    rule {
        $name:ident ( $($params:ident) (,) ...) $body
    } => {
        const $name = function (t, $params (,) ...) $body
    }
}

let foreach = macro {
    rule {
        $index:ident in $list:expr $body
    } => {
        foreach($list, function ($index) $body);
    }
}

let repeat = macro {
    rule {
        ($times:expr) $body
    } => {
        repeat($times, function () $body);
    }
}

let program = macro {
    rule {
        $body
    } => {
        function program (t) $body
    }
}

let function = macro {
    rule {
        $name:ident ( $($params:ident) (,) ...) $body
    } => {
        const $name = declareFunction(function (t, $params (,) ...) $body);
    }
}

let return = macro {
    rule { ( $arg:expr ) } => {
        return ($arg);
    }
    rule { ( $($args:expr) (,) ...) } => {
        return ([$args]);
    }
}

macro (:=) {
    rule infix { $varName:ident | $expr:expr  } => {
        $varName = $expr;
    }
}