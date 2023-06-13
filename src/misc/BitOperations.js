"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetBit = exports.getBit = exports.setBit = void 0;
function setBit(value, pos, bitValue) {
    let result = resetBit(value, pos);
    if (bitValue === 1) {
        result |= (bitValue << pos);
    }
    return result;
}
exports.setBit = setBit;
function getBit(value, pos) {
    return (value >> pos) & 1;
}
exports.getBit = getBit;
function resetBit(value, pos) {
    return value & ~(0b1 << pos);
}
exports.resetBit = resetBit;
