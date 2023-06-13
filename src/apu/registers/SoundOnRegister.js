"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundOnRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class SoundOnRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff26, memory);
    }
    get isSoundOn() {
        return this.getBit(7);
    }
    get isChannel1On() {
        return this.getBit(0);
    }
    get isChannel2On() {
        return this.getBit(1);
    }
    get isChannel3On() {
        return this.getBit(2);
    }
    get isChannel4On() {
        return this.getBit(3);
    }
    set isChannel4On(newValue) {
        this.setBit(3, newValue & 0b1);
    }
    set isChannel3On(newValue) {
        this.setBit(2, newValue & 0b1);
    }
    set isChannel2On(newValue) {
        this.setBit(1, newValue & 0b1);
    }
    set isChannel1On(newValue) {
        this.setBit(0, newValue & 0b1);
    }
}
exports.SoundOnRegister = SoundOnRegister;
