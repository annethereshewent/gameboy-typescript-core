"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel4ControlRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class Channel4ControlRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff23, memory);
    }
    get soundLengthEnable() {
        return this.getBit(6);
    }
    get restartTrigger() {
        return this.getBit(7);
    }
}
exports.Channel4ControlRegister = Channel4ControlRegister;
