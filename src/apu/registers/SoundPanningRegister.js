"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundPanningRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class SoundPanningRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff25, memory);
    }
    get mixChannel1Right() {
        return this.getBit(0);
    }
    get mixChannel2Right() {
        return this.getBit(1);
    }
    get mixChannel3Right() {
        return this.getBit(2);
    }
    get mixChannel4Right() {
        return this.getBit(3);
    }
    get mixChannel1Left() {
        return this.getBit(4);
    }
    get mixChannel2Left() {
        return this.getBit(5);
    }
    get mixChannel3Left() {
        return this.getBit(6);
    }
    get mixChannel4Left() {
        return this.getBit(7);
    }
}
exports.SoundPanningRegister = SoundPanningRegister;
