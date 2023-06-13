"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundPaletteRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class BackgroundPaletteRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff47, memory, "BackgroundPaletteRegister");
    }
    get color0() {
        return this.value & 0b11;
    }
    get color1() {
        return (this.value >> 2) & 0b11;
    }
    get color2() {
        return (this.value >> 4) & 0b11;
    }
    get color3() {
        return (this.value >> 6) & 0b11;
    }
    get colors() {
        return [this.color0, this.color1, this.color2, this.color3];
    }
}
exports.BackgroundPaletteRegister = BackgroundPaletteRegister;
