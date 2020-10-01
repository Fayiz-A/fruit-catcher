class Game {
    constructor() {
        this.fruitArray = [];
    }

    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }

    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }
        player1 = createSprite(200, 500);
        player1.addImage("player1", player_img);

        player2 = createSprite(800, 500);
        player2.addImage("player2", player_img);
        players = [player1, player2];
    }

    play() {
        form.hide();

        Player.getPlayerInfo();
        image(back_img, 0, 0, 1000, 800);
        var x = 100;
        var y = 200;
        var index = 0;
        drawSprites();

        var score = [];

        for (var plr in allPlayers) {

            index = index + 1;
            x = 500 - allPlayers[plr].distance;
            y = 500;

            players[index - 1].x = x;
            players[index - 1].y = y;

            score.push(allPlayers[plr].score);

            if (index === player.index) {

                fill("black");
                textSize(25);
                text(allPlayers[plr].name, x - 25, y + 25);

                for(var i = 0; i < this.fruitArray.length; i++) {

                    if(players[index-1].isTouching(this.fruitArray[i])) {

                        fruitGroup.remove(this.fruitArray[i]);
                        this.fruitArray[i].destroy();

                        score[index-1]++;
                        player.score = score[index-1];

                        database.ref('players/player' + index-1).update({
                            'score': player.score
                        })
                        player.update();
                    }
                }
            }
        }
        push();
        textSize(20);
        fill('white');
        text('Score: ' + score[0], 100, 100);
        text('Score: ' + score[1], 100, 200);
        pop();

        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance -= 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null) {
            player.distance += 10
            player.update();
        }

        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            var rand = Math.round(random(1, 5));
            switch (rand) {
                case 1: fruits.addImage("fruit1", fruit1_img);
                    break;
                case 2: fruits.addImage("fruit2", fruit2_img);
                    break;
                case 3: fruits.addImage("fruit3", fruit3_img);
                    break;
                case 4: fruits.addImage("fruit4", fruit4_img);
                    break;
                case 5: fruits.addImage("fruit5", fruit5_img);
                    break;
            }
            fruitGroup.add(fruits);
            this.fruitArray = fruitGroup.toArray();
        }

        for(var j = 0; j < this.fruitArray.length; j++) {
            if(this.fruitArray[j].y > displayHeight) {
                fruitGroup.remove(this.fruitArray[j]);
                this.fruitArray[j].destroy();
            }
        }
        print(this.fruitArray);
    }

    end() {
        console.log("Game Ended");
    }
}