"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mbc2Cartridge = void 0;
const CartridgeType_1 = require("./CartridgeType");
const Mbc1Cartridge_1 = require("./Mbc1Cartridge");
class Mbc2Cartridge extends Mbc1Cartridge_1.Mbc1Cartridge {
    romBankNumber = 1;
    constructor(gameDataView) {
        super(gameDataView);
        if (this.type === CartridgeType_1.CartridgeType.MBC2_PLUS_BATTERY) {
            this.hasBattery = true;
        }
    }
    _read(address, readMethod) {
        const read = this.readMethods[readMethod];
        if (this.isRomBankZero(address)) {
            return read(address);
        }
        if (this.isRomBankOneThroughF(address)) {
            const maskedAddress = address & 0b11111111111111;
            const actualAddress = ((this.romBankNumber << 14) + maskedAddress) & (this.romSize - 1);
            return read(actualAddress);
        }
        if (this.isRam1(address)) {
            return read(address - 0xa000) & 0b1111;
        }
        const maskedAddress = (address - 0xa000) & 0b111111111;
        return read(maskedAddress) & 0b1111;
    }
    _write(address, value, writeMethod) {
        const ramWrite = this.ramWriteMethods[writeMethod];
        if (this.isRamEnableOrRomBankNumber(address)) {
            const isRamEnable = (address >> 8) & 0b1;
            if (isRamEnable) {
                this.ramEnabled = value === 0xa;
            }
            else {
                this.romBankNumber = value === 0 ? 1 : value & 0b1111;
            }
        }
        else if (this.isRam1(address)) {
            ramWrite(address - 0xa000, value);
        }
        else {
            const maskedAddress = (address - 0xa000) & 0b111111111;
            ramWrite(maskedAddress, value & 0b1111);
        }
    }
    // read
    isRomBankZero(address) {
        return address >= 0 && address <= 0x3fff;
    }
    isRomBankOneThroughF(address) {
        return address >= 0x4000 && address <= 0x7fff;
    }
    isRam1(address) {
        return address >= 0xa000 && address <= 0xa1ff;
    }
    isRam2(address) {
        return address >= 0xa200 && address <= 0xbfff;
    }
    // registers
    isRamEnableOrRomBankNumber(address) {
        return address >= 0 && address <= 0x3fff;
    }
}
exports.Mbc2Cartridge = Mbc2Cartridge;
