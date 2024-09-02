<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical Legends</title>
    <style>
        .game-board {
            display: grid;
            grid-template-columns: repeat(8, 50px);
            grid-template-rows: repeat(8, 50px);
            gap: 1px;
            background-color: #ccc;
        }
        .cell {
            width: 50px;
            height: 50px;
            background-color: #fff;
            border: 1px solid #999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }
        .character {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
        }
        .player { background-color: blue; }
        .enemy { background-color: red; }
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <h1>Tactical Legends</h1>
    <div id="game-board" class="game-board"></div>
    <div id="controls">
        <button id="end-turn">End Turn</button>
    </div>
    <script src="game.js"></script>
</body>
</html>
