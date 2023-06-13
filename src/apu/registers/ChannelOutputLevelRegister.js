"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelOutputLevelRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelOutputLevelRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff1c, memory);
    }
    get outputLevelSelection() {
        return (this.value >> 5) & 0b11;
    }
}
exports.ChannelOutputLevelRegister = ChannelOutputLevelRegister;
