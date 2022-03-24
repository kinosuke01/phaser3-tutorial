// ゲームの設定
var config = {
    // WebGLが使用可能であれば使う
    // 使用不可であればCanvasにフォールバックする
    type: Phaser.AUTO,

    // 画面サイズ
    width: 800,
    height: 600,

    // アーケード物理プラグイン
    // シーンに属して、物理シミュレーションを管理する
    // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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

var game = new Phaser.Game(config);

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
        { frameWidth: 32, frameHeigh: 48}
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
}

function update() {
}
