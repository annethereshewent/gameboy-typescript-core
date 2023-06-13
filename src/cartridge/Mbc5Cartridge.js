"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mbc5Cartridge = void 0;
const CartridgeType_1 = require("./CartridgeType");
const MbcCartridge_1 = require("./MbcCartridge");
class Mbc5Cartridge extends MbcCartridge_1.MbcCartridge {
    romBankNumberLower = 0;
    romBankNumberHigher = 0;
    ramBankNumber = 0;
    ramEnabled = false;
    constructor(gameDataView) {
        super(gameDataView);
        if (this.type === CartridgeType_1.CartridgeType.MBC5_PLUS_RAM_PLUS_BATTERY) {
            this.hasBattery = true;
        }
    }
    _read(address, readMethod) {
        const read = this.readMethods[readMethod];
        const ramRead = this.ramReadMethods[readMethod];
        if (this.isRomBankZero(address)) {
            return read(address);
        }
        if (this.isRomBankZeroThrough1ff(address)) {
            const maskedAddress = address & 0b11111111111111;
            const romBankNumber = (this.romBankNumberHigher << 8) + this.romBankNumberLower;
            const actualAddress = ((romBankNumber << 14) + maskedAddress) & (this.romSize - 1);
            return read(actualAddress);
        }
        if (this.isRam(address)) {
            if (!this.ramEnabled) {
                return 0xff;
            }
            const maskedAddress = (address - 0xa000) & 0b1111111111111;
            const realAddress = ((this.ramBankNumber << 13) + maskedAddress);
            return ramRead(realAddress);
        }
        throw Error("invalid address specified");
    }
    _write(address, value, writeMethod) {
        const ramWrite = this.ramWriteMethods[writeMethod];
        if (this.isRamEnable(address)) {
            const lowerBits = value & 0b1111;
            this.ramEnabled = lowerBits === 0xa;
        }
        else if (this.isRomBankNumberLowerBits(address)) {
            this.romBankNumberLower = value & 0b11111111;
        }
        else if (this.isRomBankNumberUpperBit(address)) {
            this.romBankNumberHigher = value & 0b1;
        }
        else if (this.isRamBankNumber(address)) {
            this.ramBankNumber = value & 0xf;
        }
        else if (this.isRam(address) && this.ramEnabled) {
            const maskedAddress = (address - 0xa000) & 0b1111111111111;
            const realAddress = (this.ramBankNumber << 13) + maskedAddress;
            ramWrite(realAddress, value);
        }
    }
    // memory addresses
    isRomBankZero(address) {
        return address >= 0 && address <= 0x3fff;
    }
    isRomBankZeroThrough1ff(address) {
        return address >= 0x4000 && address <= 0x7fff;
    }
    isRam(address) {
        return address >= 0xa000 && address <= 0xbfff;
    }
    // registers (write only)
    isRamEnable(address) {
        return address >= 0 && address <= 0x1fff;
    }
    isRomBankNumberLowerBits(address) {
        return address >= 0x2000 && address <= 0x2fff;
    }
    isRomBankNumberUpperBit(address) {
        return address >= 0x3000 && address <= 0x3fff;
    }
    isRamBankNumber(address) {
        return address >= 0x4000 && address <= 0x5fff;
    }
}
exports.Mbc5Cartridge = Mbc5Cartridge;
