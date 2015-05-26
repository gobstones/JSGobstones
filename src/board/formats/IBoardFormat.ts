/// <reference path="../IBoard.ts" />

interface IBoardFormat {
	load(board:IBoard, s:string)
	dump(board:IBoard):string
}