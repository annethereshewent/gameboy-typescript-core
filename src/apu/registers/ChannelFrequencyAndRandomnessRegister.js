"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelFrequencyAndRandomnessRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelFrequencyAndRandomnessRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff22, memory);
    }
    get divisorCode() {
        return this.value & 0b111;
    }
    get lfsrWidth() {
        return this.getBit(3);
    }
    get clockShift() {
        return this.value >> 4;
    }
}
exports.ChannelFrequencyAndRandomnessRegister = ChannelFrequencyAndRandomnessRegister;
