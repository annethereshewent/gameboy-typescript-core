"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelLengthTimerAndDutyRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelLengthTimerAndDutyRegister extends MemoryRegister_1.MemoryRegister {
    get waveDuty() {
        return (this.value >> 6) & 0b11;
    }
    get initialLengthTimer() {
        return this.value & 0b111111;
    }
}
exports.ChannelLengthTimerAndDutyRegister = ChannelLengthTimerAndDutyRegister;
