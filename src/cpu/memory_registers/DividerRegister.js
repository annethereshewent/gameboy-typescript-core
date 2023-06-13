"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DividerRegister = void 0;
const MemoryRegister_1 = require("./MemoryRegister");
class DividerRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff04, memory);
    }
    set overrideValue(newVal) {
        this.memory.writeByte(this.address, newVal, 'DividerRegister', true);
    }
}
exports.DividerRegister = DividerRegister;
