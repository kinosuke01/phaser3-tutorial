import * as Phaser from "phaser";
import MyScene from './scenes/MyScene';

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
    scene: MyScene,
};

// geme start
new Phaser.Game(config);
