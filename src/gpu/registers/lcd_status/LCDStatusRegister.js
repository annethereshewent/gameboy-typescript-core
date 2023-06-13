"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCDStatusRegister = void 0;
const MemoryRegister_1 = require("../../../cpu/memory_registers/MemoryRegister");
class LCDStatusRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff41, memory, "LCDStatusRegister");
        this.value = 0x83;
    }
    get mode() {
        return this.value & 0b11;
    }
    set mode(newMode) {
        const bit0 = newMode & 1;
        const bit1 = (newMode >> 1) & 1;
        this.setBit(0, bit0);
        this.setBit(1, bit1);
    }
    isLineYCompareMatching() {
        return this.getBit(2);
    }
    isHBlankInterruptSelected() {
        return this.getBit(3);
    }
    isVBlankInterruptSelected() {
        return this.getBit(4);
    }
    isOamInterruptSelected() {
        return this.getBit(5);
    }
    isLineYMatchingInerruptSelected() {
        return this.getBit(6);
    }
    set lineYCompareMatching(newValue) {
        this.setBit(2, newValue);
    }
}
exports.LCDStatusRegister = LCDStatusRegister;
