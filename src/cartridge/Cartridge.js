"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cartridge = void 0;
class Cartridge {
    gameDataView;
    gameBytes;
    constructor(gameDataView) {
        this.gameDataView = gameDataView;
        this.gameBytes = new Uint8Array(gameDataView.buffer);
    }
    readByte(address) {
        return this.gameDataView.getUint8(address);
    }
    readWord(address) {
        return this.gameDataView.getUint16(address, true);
    }
    readSignedByte(address) {
        return this.gameDataView.getInt8(address);
    }
    writeByte(address, value) {
        return;
    }
    writeWord(address, value) {
        return;
    }
    isGameboyColor() {
        const gbcFlag = this.gameDataView.getUint8(0x143);
        return [0x80, 0xc0].includes(gbcFlag);
    }
    /**
     * See below for info on headers and what they return.
     * https://gbdev.io/pandocs/The_Cartridge_Header.html
     */
    get romSize() {
        const romAddress = 0x148;
        const sizeCode = this.gameDataView.getUint8(romAddress);
        const sizes = [
            0x08000,
            0x010000,
            0x020000,
            0x040000,
            0x080000,
            0x100000,
            0x200000,
            0x400000,
            0x800000, // 8mb
        ];
        return sizes[sizeCode];
    }
    get name() {
        const nameStart = 0x134;
        const nameEnd = 0x143;
        return new TextDecoder().decode(this.gameBytes.subarray(nameStart, nameEnd));
    }
    get type() {
        const typeAddress = 0x147;
        return this.gameDataView.getUint8(typeAddress);
    }
    get ramSize() {
        const ramAddress = 0x149;
        const sizeCode = this.gameDataView.getUint8(ramAddress);
        const sizes = [
            0,
            -1,
            0x002000,
            0x008000,
            0x020000,
            0x010000, // 64 kb
        ];
        return sizes[sizeCode];
    }
}
exports.Cartridge = Cartridge;
