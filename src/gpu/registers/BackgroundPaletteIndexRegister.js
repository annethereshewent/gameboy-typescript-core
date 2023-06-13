"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundPaletteIndexRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class BackgroundPaletteIndexRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff68, memory, "BackgroundPaletteIndexRegister");
    }
    get paletteAddress() {
        return this.value & 0b111111;
    }
    set paletteAddress(newVal) {
        const paletteAddress = newVal & 0b111111;
        const actualWrite = (this.getBit(7) << 7) | paletteAddress;
        this.memory.writeByte(this.address, actualWrite);
    }
    get autoIncrement() {
        return this.getBit(7) === 1;
    }
}
exports.BackgroundPaletteIndexRegister = BackgroundPaletteIndexRegister;
