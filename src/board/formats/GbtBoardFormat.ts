/// <reference path="../IBoard.ts" />
/// <reference path="../../utilities/String.ts" />
/// <reference path="../../utilities/Functional.ts" />
/// <reference path="./IBoardFormat.ts" />

/* Partially transcribed from PyGobstones */
class GbtBoardFormat implements IBoardFormat {
	
	cellWidth:number
	cellHeight:number
	maxNumberLength:number
	
	constructor(cellWidth:number=9, cellHeight:number=3, maxNumberLength:number=3) {
		this.cellWidth = cellWidth
		this.cellHeight = cellHeight
		this.maxNumberLength = maxNumberLength
	}
	
	load(board:IBoard, s:string) {
		throw new Error("Not implemented")
	}
	
	dump(board:IBoard):string {
		var output:string = ""
    	var rows:Array<string> = this.numbered_contents(board)
    	var i:number = 0
		var sep:string
    	foreach(rows,(row:string) => {
	      if (i == rows.length - 1) {
	        sep = ''
		  } else {
	        sep = '\n'
		  }
	      output += row+sep
	      i += 1
		})
		return output
	}
	
	numbered_contents(board:IBoard):Array<string> {
	    var res:Array<string> = new Array<string>()
	    var out:any = this.board_contents(board)
	    
		// vertical numbers
	    var row_id:number = board.getSize().height
	    var i:number = 0
		foreach(out, (row:Array<any>)=> {	    
	      if (i % (this.cellHeight + 1) == 2) {
	        row_id -= 1
	        res.push('  ' + row_id + ' ' + join(row) + ' ' + row_id + ' ')
		  } else {
	        res.push('    ' + join(row) + '   ')	      		  
		  }
		  i += 1
		})
	    
		// horizontal numbers
	    var rf:number = Math.floor(this.cellWidth / 2)
	    var lf:number = this.cellWidth - rf
	    var horiz:string = join(map(
			range(board.getSize().width), 
			function (i:number):string {
				return ' '.times(lf) + i + ' '.times(rf)	
			}
		))		
	    horiz = '    ' + horiz + '    '
		res = [horiz].concat(res)	    
	    res.push(horiz + '  ')
	    return res
	}
	
	board_contents(board:IBoard) {
	    var w:number  = board.getSize().width, 
			h:number  = board.getSize().height,
			gw:number = (this.cellWidth + 1) * w + 1,
			gh:number = (this.cellHeight + 1) * h + 1
			
		var out = []		
		foreach(range(gh), (j:number) => {
			out[j] = []
			foreach(range(gw), (i:number) => {
				out[j][i] = ' '
			})
		}) 	    
		
	    // row borders
		foreach(range(w), (x:number)=> {
			foreach(range(h+1), (y:number) => {
				foreach(range((this.cellWidth + 1) * x + 1, (this.cellWidth + 1) * (x + 1)),
					    (i:number)=> {
							out[(this.cellHeight + 1) * y][i] = '-'
						})
			})
		})
			          
	    // column borders		
		foreach(range(w+1), (x:number)=> {
			foreach(range(h), (y:number) => {
				foreach(range((this.cellHeight + 1) * y + 1, (this.cellHeight + 1) * (y + 1)),
					    (i:number)=> {
							out[i][(this.cellWidth + 1) * x] = '|'
						})
			})
		})
			    
	    // corners
		foreach(range(w+1), (x:number)=> {
			foreach(range(h+1), (y:number) => {
				out[(this.cellHeight + 1) * y][(this.cellWidth + 1) * x] = '+'
			})
		})
	    	
	    // head
	    var y0 = board.getHead().y,
			x0 = board.getHead().x
	    y0 = h - y0 - 1
		
		foreach(range(y0, y0+2), (y:number)=> {
			foreach(range((this.cellWidth + 1) * x0 + 1, (this.cellWidth + 1) * (x0 + 1)), 
			(i:number) => {
				out[(this.cellHeight + 1) * y][i] = 'X'
			})
		})
		
		foreach(range(x0, x0+2), (x:number)=> {
			foreach(range((this.cellHeight + 1) * y0 + 1, (this.cellHeight + 1) * (y0 + 1)), 
			(i:number) => {
				out[i][(this.cellWidth + 1) * x] = 'X'
			})
		})
	    	    
	    // contents
		foreach(range(w), (x:number)=> {
			foreach(range(h), (y:number) => {
				var cell = this.cell_contents(board.getCells()[h - y - 1][x])
				foreach(range(this.cellWidth), (i:number)=> {
					foreach(range(this.cellHeight), (j:number)=> {
						out[(this.cellHeight + 1) * y + j + 1][(this.cellWidth + 1) * x + i + 1] = cell[j][i]	
					})	
				})
			})
		})
		
	    return out
	}
	
	cell_contents(cell:ICell) {
		var w = this.cellWidth,
			h = this.cellHeight
		
	    var out = []		
		foreach(range(h), (j:number) => {
			out[j] = []
			foreach(range(w), (i:number) => {
				out[j][i] = ' '
			})
		}) 	    
		
		foreach(Color.cases, (color:Color) => {
			var count:number = cell.numberOfStones(color)
			
			if (count != 0) { // if count == 0 -> continue			
				if (count < 2)
					var y = 0
				else
					var y = this.cellHeight-1
					
				if (color.value % 2 == 0)
					var x = this.cellWidth-2
				else
					var x = this.maxNumberLength
					
				out[y][x] = color.name().charAt(0)
				
				var scount:string = count.toString()
				if (scount.length > this.maxNumberLength)
					scount = scount.slice(scount.length - this.maxNumberLength)
					
				foreach(reverse(scount.toArray()), (c:string) => {				
					x -= 1
					out[y][x] = c
				})
			}
		})
			   
	    return out
	}
}