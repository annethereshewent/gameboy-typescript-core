"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joypad = void 0;
const JoypadRegister_1 = require("../cpu/memory_registers/JoypadRegister");
var GamepadButtons;
(function (GamepadButtons) {
    GamepadButtons[GamepadButtons["A"] = 0] = "A";
    GamepadButtons[GamepadButtons["B"] = 1] = "B";
    GamepadButtons[GamepadButtons["X"] = 2] = "X";
    GamepadButtons[GamepadButtons["Y"] = 3] = "Y";
    GamepadButtons[GamepadButtons["LB"] = 4] = "LB";
    GamepadButtons[GamepadButtons["RB"] = 5] = "RB";
    GamepadButtons[GamepadButtons["LT"] = 6] = "LT";
    GamepadButtons[GamepadButtons["RT"] = 7] = "RT";
    GamepadButtons[GamepadButtons["Select"] = 8] = "Select";
    GamepadButtons[GamepadButtons["Start"] = 9] = "Start";
    GamepadButtons[GamepadButtons["L3"] = 10] = "L3";
    GamepadButtons[GamepadButtons["R3"] = 11] = "R3";
    GamepadButtons[GamepadButtons["Up"] = 12] = "Up";
    GamepadButtons[GamepadButtons["Down"] = 13] = "Down";
    GamepadButtons[GamepadButtons["Left"] = 14] = "Left";
    GamepadButtons[GamepadButtons["Right"] = 15] = "Right";
})(GamepadButtons || (GamepadButtons = {}));
class Joypad {
    gamepad;
    constructor(gamepad) {
        this.gamepad = gamepad;
    }
    static isUpKeyPressed = false;
    static isDownKeyPressed = false;
    static isRightKeyPressed = false;
    static isLeftKeyPressed = false;
    static isEnterKeyPressed = false;
    static isShiftKeyPressed = false;
    static isSKeyPressed = false;
    static isAKeyPressed = false;
    static handleInput() {
        const gamepad = navigator.getGamepads()[0];
        const joypad = new Joypad(gamepad);
        JoypadRegister_1.joypadRegister.isPressingLeft = joypad.isPressingLeft();
        JoypadRegister_1.joypadRegister.isPressingRight = joypad.isPressingRight();
        JoypadRegister_1.joypadRegister.isPressingDown = joypad.isPressingDown();
        JoypadRegister_1.joypadRegister.isPressingUp = joypad.isPressingUp();
        JoypadRegister_1.joypadRegister.isPressingA = joypad.isPressingA();
        JoypadRegister_1.joypadRegister.isPressingB = joypad.isPressingB();
        JoypadRegister_1.joypadRegister.isPressingSelect = joypad.isPressingSelect();
        JoypadRegister_1.joypadRegister.isPressingStart = joypad.isPressingStart();
    }
    isPressingLeft() {
        const axes = this.gamepad?.axes[0] || 0;
        return this.gamepad?.buttons[GamepadButtons.Left].pressed || axes < -0.1 || Joypad.isLeftKeyPressed;
    }
    isPressingRight() {
        const axes = this.gamepad?.axes[0] || 0;
        return this.gamepad?.buttons[GamepadButtons.Right]?.pressed || axes > 0.1 || Joypad.isRightKeyPressed;
    }
    isPressingUp() {
        const axes = this.gamepad?.axes[1] || 0;
        return this.gamepad?.buttons[GamepadButtons.Up].pressed || axes < -0.1 || Joypad.isUpKeyPressed;
    }
    isPressingDown() {
        const axes = this.gamepad?.axes[1] || 0;
        return this.gamepad?.buttons[GamepadButtons.Down].pressed || axes > 0.1 || Joypad.isDownKeyPressed;
    }
    isPressingA() {
        return this.gamepad?.buttons[GamepadButtons.A].pressed || Joypad.isSKeyPressed;
    }
    isPressingB() {
        return this.gamepad?.buttons[GamepadButtons.X].pressed || Joypad.isAKeyPressed;
    }
    isPressingStart() {
        return this.gamepad?.buttons[GamepadButtons.Start].pressed || Joypad.isEnterKeyPressed;
    }
    isPressingSelect() {
        return this.gamepad?.buttons[GamepadButtons.Select].pressed || Joypad.isShiftKeyPressed;
    }
}
exports.Joypad = Joypad;
