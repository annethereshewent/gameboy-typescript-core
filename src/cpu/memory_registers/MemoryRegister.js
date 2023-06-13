"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRegister = void 0;
const BitOperations_1 = require("../../misc/BitOperations");
class MemoryRegister {
    address;
    memory;
    type;
    constructor(address, memory, type) {
        this.address = address;
        this.memory = memory;
        this.type = type;
    }
    get value() {
        return this.memory.readByte(this.address);
    }
    set value(newValue) {
        this.memory.writeByte(this.address, newValue, this.type);
    }
    setBit(pos, bitValue) {
        this.value = (0, BitOperations_1.setBit)(this.value, pos, bitValue);
    }
    getBit(pos) {
        return (0, BitOperations_1.getBit)(this.value, pos);
    }
    resetBit(pos) {
        this.value = (0, BitOperations_1.resetBit)(this.value, pos);
    }
}
exports.MemoryRegister = MemoryRegister;
