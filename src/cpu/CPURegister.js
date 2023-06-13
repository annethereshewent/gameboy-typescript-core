"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPURegister = void 0;
class CPURegister {
    name;
    registerId;
    dataView;
    is16Bit;
    constructor(name, initialValue, id, dataView, is16Bit) {
        this.name = name;
        this.registerId = id;
        this.dataView = dataView;
        this.is16Bit = is16Bit;
        this.value = initialValue;
    }
    get value() {
        if (!this.is16Bit) {
            return this.dataView.getUint8(this.registerId);
        }
        else {
            return this.dataView.getUint16(this.registerId, true);
        }
    }
    get hexValue() {
        return `0x${this.value.toString(16)}`;
    }
    set value(newValue) {
        if (!this.is16Bit) {
            this.dataView.setUint8(this.registerId, newValue);
        }
        else {
            this.dataView.setUint16(this.registerId, newValue, true);
        }
    }
    setBit(pos, bitValue) {
        let result = this.resetBit(pos);
        if (bitValue === 1) {
            result |= (bitValue << pos);
        }
        this.value = result;
    }
    resetBit(pos) {
        return this.value & ~(0b1 << pos);
    }
}
exports.CPURegister = CPURegister;
