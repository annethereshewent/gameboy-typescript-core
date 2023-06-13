"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelDACEnableRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelDACEnableRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff1a, memory);
    }
    get dacEnabled() {
        return this.getBit(7);
    }
}
exports.ChannelDACEnableRegister = ChannelDACEnableRegister;
