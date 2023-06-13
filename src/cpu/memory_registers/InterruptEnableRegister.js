"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterruptEnableRegister = void 0;
const MemoryRegister_1 = require("./MemoryRegister");
class InterruptEnableRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xffff, memory, "InterruptEnableRegister");
    }
    isVBlankInterruptEnabled() {
        return this.getBit(0);
    }
    isLCDStatInterruptEnabled() {
        return this.getBit(1);
    }
    isTimerInterruptEnabled() {
        return this.getBit(2);
    }
    isSerialInterruptEnabled() {
        return this.getBit(3);
    }
    isJoypadInterruptEnabled() {
        return this.getBit(4);
    }
}
exports.InterruptEnableRegister = InterruptEnableRegister;
