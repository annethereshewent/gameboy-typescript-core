"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagsRegisterPair = void 0;
const CPURegister_1 = require("./CPURegister");
class FlagsRegisterPair extends CPURegister_1.CPURegister {
    set value(newVal) {
        // clear the first four bits after setting the new value, they're never used in F
        const clearBits = 0b1111111111110000;
        this.dataView.setUint16(this.registerId, newVal & clearBits, true);
    }
    get value() {
        return this.dataView.getUint16(this.registerId, true);
    }
    get hexValue() {
        return `0x${this.value.toString(16)}`;
    }
}
exports.FlagsRegisterPair = FlagsRegisterPair;
