// ゲームの設定
var config = {
    // WebGLが使用可能であれば使う
    // 使用不可であればCanvasにフォールバックする
    type: Phaser.AUTO,

    // 画面サイズ
    width: 800,
    height: 600,

    // Arcade物理システム
    // シーンに属して、物理シミュレーションを管理する
    // 他にImpactPhysicsなどがある
    // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, // 重力加速度の設定
            debug: false,
        },
    },

    // シーンごとに呼ぶ関数を設定
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var player;
var platforms;
var game = new Phaser.Game(config);
var cursors;
var score = 0;
var scoreText;
var stars;
var bombs;

function preload() {
    // 画像読み込み
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    // スプライト読み込み
    // 1枚の画像の一部分を切り取って読み込み
    this.load.spritesheet(
        'dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48}
    );
}

function create() {
    // add.imageで現在のシーンの表示リストに追加
    // 画像の中心の座標を指定する
    // skyの画像サイズは800x600
    this.add.image(400, 300, 'sky');

    // 記述した順に上に表示されていく
    // this.add.image(400, 300, 'star');

    // 静的な物理オブジェクトのグループ
    // 類似したオブジェクトをグループ化することで、1つのユニットとして制御できる
    platforms = this.physics.add.staticGroup();

    // ゲームオブジェクトの追加
    // 元画像のサイズは 400x568
    // 中心座標は 400x568
    // setScale(2)で縦横幅を2倍にすることで、800x1316を400x568の位置に配置となる
    // スケーリングした際は、refreshBodyが必要(なぜ？)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // 100x450に配置されたスプライトを作成
    player = this.physics.add.sprite(100, 450, 'dude');

    // バウンス値。ジャンプ後の着地で若干跳ね返る。
    player.setBounce(0.2);

    // スプライトをゲームディメンション内に閉じ込めるか
    // デフォルト=true
    player.setCollideWorldBounds(true);

    // スプライトごとの重力加速度の設定
    // player.body.setGravityY(300);

    // スプライトと地面の衝突判定
    // 静止体とスプライトが衝突した場合は止まる
    this.physics.add.collider(player, platforms);

    // 左向きのアニメーションを定義
    this.anims.create({
        key: 'left',
        // spriteの0〜3のフレームを使用する
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10, // 1秒あたり10フレームで実行
        repeat: -1,    // -1 = アニメーションループ設定
    });

    // 正面のアニメーションを定義
    this.anims.create({
        key: 'turn',
        frames: [ {key: 'dude', frame: 4}],
        frameRate: 20,
    });

    // 右向きのアニメーションを定義
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1,
    });

    // カーソルオブジェクト
    // これに上下左右のプロパティが設定される
    cursors = this.input.keyboard.createCursorKeys();

    // 星オブジェクトの追加
    stars = this.physics.add.group({
        key: 'star',  // starイメージと紐付け
        repeat: 11,   // 自動で1個できる+11回=12個
        setXY: {x: 12, y: 0, stepX: 70}, // 最初の1個は12x0に配置, 2個目は(12+70)x0に配置...
    });
    // 全部の星に繰り返し処理
    stars.children.iterate(function(child) {
        // 0.4~0.8のランダムなバウンス値をセット
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    })

    // 星オブジェクトと地面の衝突設定
    this.physics.add.collider(stars, platforms);

    // 星とプレイヤーが重なったら、星を非表示にする
    let collectStar = function(player, star) {
        star.disableBody(true, true);

        // スコア追加
        score += 10;
        scoreText.setText('Score: ' + score);

        // 星が0になったら
        if (stars.countActive(true) === 0) {
            // 星を復活
            stars.children.iterate(function(child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            // 爆弾を生成
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // スコアを表示するテキストオブジェクト
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

    // 爆弾
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);

    // プレイヤーと爆弾の衝突時処理
    let hitBomb = function(player, bombs) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // 上が押されている かつ 地面に接しているか
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
