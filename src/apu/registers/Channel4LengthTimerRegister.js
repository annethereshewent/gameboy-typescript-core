"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel4LengthTimerRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class Channel4LengthTimerRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff20, memory);
    }
    get lengthTimer() {
        return this.value & 0b111111;
    }
}
exports.Channel4LengthTimerRegister = Channel4LengthTimerRegister;
