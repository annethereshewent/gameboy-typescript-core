"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAMEntry = exports.OAMTable = void 0;
const BitOperations_1 = require("../../misc/BitOperations");
// see https://gbdev.io/pandocs/OAM.html
const OAM_START = 0xfe00;
const OAM_END = 0xfe9f;
class OAMTable {
    memory;
    entries = [];
    constructor(memory) {
        this.memory = memory;
        for (let i = OAM_START; i < OAM_END; i += 4) {
            this.entries.push(new OAMEntry(i, memory));
        }
    }
}
exports.OAMTable = OAMTable;
class OAMEntry {
    address;
    memory;
    constructor(address, memory) {
        this.address = address;
        this.memory = memory;
    }
    get yPosition() {
        return this.memory.readByte(this.address);
    }
    get xPosition() {
        return this.memory.readByte(this.address + 1);
    }
    get tileIndex() {
        return this.memory.readByte(this.address + 2);
    }
    get attributeFlags() {
        return this.memory.readByte(this.address + 3);
    }
    get paletteNumber() {
        return (0, BitOperations_1.getBit)(this.attributeFlags, 4);
    }
    get isXFlipped() {
        return (0, BitOperations_1.getBit)(this.attributeFlags, 5);
    }
    get isYFlipped() {
        return (0, BitOperations_1.getBit)(this.attributeFlags, 6);
    }
    get bgAndWindowOverObj() {
        return (0, BitOperations_1.getBit)(this.attributeFlags, 7);
    }
    get cgbPaletteNumber() {
        return this.attributeFlags & 0b111;
    }
    get tileVramBankNumber() {
        return (0, BitOperations_1.getBit)(this.attributeFlags, 3);
    }
}
exports.OAMEntry = OAMEntry;
