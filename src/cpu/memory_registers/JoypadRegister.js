"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joypadRegister = exports.JoypadRegister = void 0;
const BitOperations_1 = require("../../misc/BitOperations");
class JoypadRegister {
    value = 0xff;
    isPressingDown = false;
    isPressingUp = false;
    isPressingLeft = false;
    isPressingRight = false;
    isPressingA = false;
    isPressingB = false;
    isPressingStart = false;
    isPressingSelect = false;
    get isCheckingDirections() {
        return this.getBit(4) === 0;
    }
    get isCheckingButtons() {
        return this.getBit(5) === 0;
    }
    getInput() {
        if (this.isCheckingDirections) {
            this.setBit(0, this.isPressingRight ? 0 : 1);
            this.setBit(1, this.isPressingLeft ? 0 : 1);
            this.setBit(2, this.isPressingUp ? 0 : 1);
            this.setBit(3, this.isPressingDown ? 0 : 1);
        }
        if (this.isCheckingButtons) {
            this.setBit(0, this.isPressingA ? 0 : 1);
            this.setBit(1, this.isPressingB ? 0 : 1);
            this.setBit(2, this.isPressingSelect ? 0 : 1);
            this.setBit(3, this.isPressingStart ? 0 : 1);
        }
        this.setBit(4, this.isCheckingButtons ? 0 : 1);
        this.setBit(5, this.isCheckingDirections ? 0 : 1);
        return this.value;
    }
    setBit(pos, bitValue) {
        this.value = (0, BitOperations_1.setBit)(this.value, pos, bitValue);
    }
    getBit(pos) {
        return (0, BitOperations_1.getBit)(this.value, pos);
    }
}
exports.JoypadRegister = JoypadRegister;
exports.joypadRegister = new JoypadRegister();
