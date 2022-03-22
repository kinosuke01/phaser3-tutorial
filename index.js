// ゲームの設定
var config = {
    // WebGLが使用可能であれば使う
    // 使用不可であればCanvasにフォールバックする
    type: Phaser.AUTO,

    // 画面サイズ
    width: 800,
    height: 600,

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
    this.add.image(400, 300, 'sky');
}

function update() {
}
