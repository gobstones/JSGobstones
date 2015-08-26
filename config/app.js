/*
  Author: Ary Pablo Batista <arypbatista@gmail.com>

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

'use strict';

// Module dependencies
var express    = require('express');

module.exports = (function () {

  var app = express();
  // Setup static public directory
  app.use(express.static(__dirname + '/../public'));
  app.use('/bower_components', express.static(__dirname + '/../bower_components'));
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/../views');
    
  return app;
  
})();