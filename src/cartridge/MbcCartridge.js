"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MbcCartridge = void 0;
const SramSaver_1 = require("../misc/SramSaver");
const Cartridge_1 = require("./Cartridge");
const ReadMethod_1 = require("./ReadMethod");
const WriteMethods_1 = require("./WriteMethods");
class MbcCartridge extends Cartridge_1.Cartridge {
    constructor(gameDataView) {
        super(gameDataView);
        this.ramBytes.fill(0xff);
        const ramBytes = SramSaver_1.SramSaver.loadFile(this.name);
        if (ramBytes?.length === this.ramSize) {
            this.ramBuffer = ramBytes.buffer;
            this.ramView = new DataView(ramBytes.buffer);
            this.ramBytes = ramBytes;
        }
    }
    ramBuffer = new ArrayBuffer(this.ramSize);
    ramView = new DataView(this.ramBuffer);
    ramBytes = new Uint8Array(this.ramBuffer);
    sramTimeout = null;
    hasBattery = false;
    readMethods = [
        (address) => this.gameDataView.getUint8(address),
        (address) => this.gameDataView.getInt8(address),
        (address) => this.gameDataView.getUint16(address, true)
    ];
    ramReadMethods = [
        (address) => this.ramView.getUint8(address),
        (address) => this.ramView.getInt8(address),
        (address) => this.ramView.getUint16(address, true)
    ];
    ramWriteMethods = [
        (address, value) => {
            this.ramView.setUint8(address, value);
            if (this.hasBattery) {
                if (this.sramTimeout != null) {
                    clearTimeout(this.sramTimeout);
                }
                this.sramTimeout = setTimeout(() => SramSaver_1.SramSaver.saveFile(this.name, this.ramBytes), 1500);
            }
        },
        (address, value) => {
            this.ramView.setUint16(address, value, true);
            if (this.hasBattery) {
                if (this.sramTimeout != null) {
                    clearTimeout(this.sramTimeout);
                }
                this.sramTimeout = setTimeout(() => SramSaver_1.SramSaver.saveFile(this.name, this.ramBytes), 1500);
            }
        }
    ];
    readByte(address) {
        return this._read(address, ReadMethod_1.ReadMethod.READ_BYTE);
    }
    readSignedByte(address) {
        return this._read(address, ReadMethod_1.ReadMethod.READ_SIGNED_BYTE);
    }
    readWord(address) {
        return this._read(address, ReadMethod_1.ReadMethod.READ_WORD);
    }
    _read(address, readMethod) {
        return -1;
    }
    writeByte(address, value) {
        this._write(address, value, WriteMethods_1.WriteMethod.WRITE_BYTE);
    }
    writeWord(address, value) {
        this._write(address, value, WriteMethods_1.WriteMethod.WRITE_WORD);
    }
    _write(address, value, writeMethod) {
        return;
    }
}
exports.MbcCartridge = MbcCartridge;
