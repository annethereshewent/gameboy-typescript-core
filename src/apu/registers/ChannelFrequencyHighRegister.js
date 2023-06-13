"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelFrequencyHighRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelFrequencyHighRegister extends MemoryRegister_1.MemoryRegister {
    get frequencyHighBits() {
        return this.value & 0b111;
    }
    get soundLengthEnable() {
        return this.getBit(6);
    }
    get restartTrigger() {
        return this.getBit(7);
    }
    set restartTrigger(newValue) {
        this.setBit(7, newValue & 0b1);
    }
}
exports.ChannelFrequencyHighRegister = ChannelFrequencyHighRegister;
