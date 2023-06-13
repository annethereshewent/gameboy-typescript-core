"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagsRegister = void 0;
const CPURegister_1 = require("./CPURegister");
const ZERO_FLAG_BYTE_POSITION = 7;
const SUBTRACT_FLAG_BYTE_POSITION = 6;
const HALF_CARRY_FLAG_BYTE_POSITION = 5;
const CARRY_FLAG_BYTE_POSITION = 4;
class FlagsRegister extends CPURegister_1.CPURegister {
    get zero() {
        return ((this.value >> ZERO_FLAG_BYTE_POSITION) & 1) === 1;
    }
    get subtract() {
        return ((this.value >> SUBTRACT_FLAG_BYTE_POSITION) & 1) === 1;
    }
    get halfCarry() {
        return ((this.value >> HALF_CARRY_FLAG_BYTE_POSITION) & 1) === 1;
    }
    get carry() {
        return ((this.value >> CARRY_FLAG_BYTE_POSITION) & 1) === 1;
    }
    set zero(val) {
        if (val) {
            this.value |= 1 << ZERO_FLAG_BYTE_POSITION;
        }
        else {
            this.value &= ~(1 << ZERO_FLAG_BYTE_POSITION);
        }
    }
    set subtract(val) {
        if (val) {
            this.value |= 1 << SUBTRACT_FLAG_BYTE_POSITION;
        }
        else {
            this.value &= ~(1 << SUBTRACT_FLAG_BYTE_POSITION);
        }
    }
    set halfCarry(val) {
        if (val) {
            this.value |= 1 << HALF_CARRY_FLAG_BYTE_POSITION;
        }
        else {
            this.value &= ~(1 << HALF_CARRY_FLAG_BYTE_POSITION);
        }
    }
    set carry(val) {
        if (val) {
            this.value |= 1 << CARRY_FLAG_BYTE_POSITION;
        }
        else {
            this.value &= ~(1 << CARRY_FLAG_BYTE_POSITION);
        }
    }
}
exports.FlagsRegister = FlagsRegister;
