"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelSweepRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelSweepRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff10, memory);
    }
    get sweepShift() {
        return this.value & 0b111;
    }
    get sweepDirection() {
        return this.getBit(3);
    }
    get sweepPace() {
        return (this.value >> 4) & 0b111;
    }
}
exports.ChannelSweepRegister = ChannelSweepRegister;
