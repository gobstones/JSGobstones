/*
  Author: Ary Pablo Batista <arypbatista@gmail.com>

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

'use strict';

var app = require('./config/app');

// render index page
app.get('/', function(req, res) {
  res.render('index');
});


var port = 8080;
app.listen(port);
console.log('listening at:', port);