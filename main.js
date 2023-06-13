define("cartridge/Cartridge", ["require", "exports"], function (require, exports) {
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
});
define("cartridge/CartridgeType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CartridgeType = void 0;
    /**
     * per https://gbdev.io/pandocs/The_Cartridge_Header.html
     */
    var CartridgeType;
    (function (CartridgeType) {
        CartridgeType[CartridgeType["ROM"] = 0] = "ROM";
        CartridgeType[CartridgeType["MBC1"] = 1] = "MBC1";
        CartridgeType[CartridgeType["MBC1_PLUS_RAM"] = 2] = "MBC1_PLUS_RAM";
        CartridgeType[CartridgeType["MBC1_PLUS_RAM_PLUS_BATTERY"] = 3] = "MBC1_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC2"] = 5] = "MBC2";
        CartridgeType[CartridgeType["MBC2_PLUS_BATTERY"] = 6] = "MBC2_PLUS_BATTERY";
        CartridgeType[CartridgeType["ROM_PLUS_RAM"] = 8] = "ROM_PLUS_RAM";
        CartridgeType[CartridgeType["ROM_PLUS_RAM_PLUS_BATTERY"] = 9] = "ROM_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MM01"] = 11] = "MM01";
        CartridgeType[CartridgeType["MM01_PLUS_RAM"] = 12] = "MM01_PLUS_RAM";
        CartridgeType[CartridgeType["MMO1_PLUS_RAM_PLUS_BATTERY"] = 13] = "MMO1_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC3_PLUS_TIMER_PLUS_BATTERY"] = 15] = "MBC3_PLUS_TIMER_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY"] = 16] = "MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC3"] = 17] = "MBC3";
        CartridgeType[CartridgeType["MBC3_PLUS_RAM"] = 18] = "MBC3_PLUS_RAM";
        CartridgeType[CartridgeType["MBC3_PLUS_RAM_PLUS_BATTERY"] = 19] = "MBC3_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC5"] = 25] = "MBC5";
        CartridgeType[CartridgeType["MBC5_PLUS_RAM"] = 26] = "MBC5_PLUS_RAM";
        CartridgeType[CartridgeType["MBC5_PLUS_RAM_PLUS_BATTERY"] = 27] = "MBC5_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC5_PLUS_RUMBLE"] = 28] = "MBC5_PLUS_RUMBLE";
        CartridgeType[CartridgeType["MBC5_PLUS_RUMBLE_PLUS_RAM"] = 29] = "MBC5_PLUS_RUMBLE_PLUS_RAM";
        CartridgeType[CartridgeType["MBC5_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY"] = 30] = "MBC5_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["MBC6"] = 32] = "MBC6";
        CartridgeType[CartridgeType["MBC7_PLUS_SENSOR_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY"] = 34] = "MBC7_PLUS_SENSOR_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY";
        CartridgeType[CartridgeType["POCKET_CAMERA"] = 252] = "POCKET_CAMERA";
        CartridgeType[CartridgeType["BANDAI_TAMA5"] = 253] = "BANDAI_TAMA5";
        CartridgeType[CartridgeType["HuC3"] = 254] = "HuC3";
        CartridgeType[CartridgeType["HuC1_PLUS_RAM_PLUS_BATTERY"] = 255] = "HuC1_PLUS_RAM_PLUS_BATTERY";
    })(CartridgeType || (exports.CartridgeType = CartridgeType = {}));
});
define("misc/SramSaver", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SramSaver = void 0;
    class SramSaver {
        static saveFile(name, sram) {
            const jsonArray = Array.from(sram);
            localStorage.setItem(`${name}.sav`, JSON.stringify(jsonArray));
        }
        static loadFile(name) {
            const json = localStorage.getItem(`${name}.sav`);
            if (json != null) {
                const jsonArray = JSON.parse(json);
                return new Uint8Array(jsonArray);
            }
            return null;
        }
    }
    exports.SramSaver = SramSaver;
});
define("cartridge/ReadMethod", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReadMethod = void 0;
    var ReadMethod;
    (function (ReadMethod) {
        ReadMethod[ReadMethod["READ_BYTE"] = 0] = "READ_BYTE";
        ReadMethod[ReadMethod["READ_SIGNED_BYTE"] = 1] = "READ_SIGNED_BYTE";
        ReadMethod[ReadMethod["READ_WORD"] = 2] = "READ_WORD";
    })(ReadMethod || (exports.ReadMethod = ReadMethod = {}));
});
define("cartridge/WriteMethods", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WriteMethod = void 0;
    var WriteMethod;
    (function (WriteMethod) {
        WriteMethod[WriteMethod["WRITE_BYTE"] = 0] = "WRITE_BYTE";
        WriteMethod[WriteMethod["WRITE_WORD"] = 1] = "WRITE_WORD";
    })(WriteMethod || (exports.WriteMethod = WriteMethod = {}));
});
define("cartridge/MbcCartridge", ["require", "exports", "misc/SramSaver", "cartridge/Cartridge", "cartridge/ReadMethod", "cartridge/WriteMethods"], function (require, exports, SramSaver_1, Cartridge_1, ReadMethod_1, WriteMethods_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MbcCartridge = void 0;
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
});
define("cartridge/Mbc1Cartridge", ["require", "exports", "cartridge/CartridgeType", "cartridge/MbcCartridge"], function (require, exports, CartridgeType_1, MbcCartridge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mbc1Cartridge = void 0;
    // see https://gbdev.io/pandocs/MBC1.html for most of the details on these
    class Mbc1Cartridge extends MbcCartridge_1.MbcCartridge {
        constructor(gameDataView) {
            super(gameDataView);
            if (this.type === CartridgeType_1.CartridgeType.MBC1_PLUS_RAM_PLUS_BATTERY) {
                this.hasBattery = true;
            }
        }
        ramEnabled = false;
        mode = 0;
        romBankNumber = 1;
        ramBankNumber = 0;
        resetRam() {
            this.ramBytes.fill(0, 0, this.ramBytes.length - 1);
        }
        _read(address, readMethod) {
            if (address >= 0 && address <= 0x3fff) {
                return this.readFromBankZero(address, readMethod);
            }
            if (address >= 0x4000 && address <= 0x7fff) {
                return this.readFromBanksOneThrough7f(address, readMethod);
            }
            return this.readFromRam(address, readMethod);
        }
        readFromRam(address, readMethod) {
            if (!this.ramEnabled) {
                return 0xff;
            }
            const maskedAddress = (address - 0xa000) & 0b1111111111111;
            const ramRead = this.ramReadMethods[readMethod];
            if (this.mode === 0) {
                return ramRead(maskedAddress);
            }
            const actualAddress = (this.ramBankNumber << 13) + maskedAddress;
            return ramRead(actualAddress);
        }
        readFromBankZero(address, readMethod) {
            const read = this.readMethods[readMethod];
            const maskedAddress = address & 0b11111111111111;
            if (this.mode === 0) {
                return read(maskedAddress);
            }
            const actualAddress = ((this.ramBankNumber << 19) + maskedAddress) & (this.romSize - 1);
            return read(actualAddress);
        }
        readFromBanksOneThrough7f(address, readMethod) {
            const read = this.readMethods[readMethod];
            const bankNumber = (this.ramBankNumber << 5) + this.romBankNumber;
            const maskedAddress = address & 0b11111111111111;
            const actualAddress = ((bankNumber << 14) + maskedAddress) & (this.romSize - 1);
            return read(actualAddress);
        }
        _write(address, value, writeMethod) {
            if (this.isRamEnableRegister(address)) {
                this.ramEnabled = value === 0xa;
            }
            else if (this.isRomBankNumberRegister(address)) {
                this.romBankNumber = value === 0 ? 1 : value & 0b11111;
            }
            else if (this.isRamBankNumberRegister(address)) {
                this.ramBankNumber = value & 0b11;
            }
            else if (this.isBankingModeRegister(address)) {
                this.mode = value & 0b1;
            }
            else if (this.isRamAddress(address) && this.ramEnabled) {
                const maskedAddress = (address - 0xa000) & 0b1111111111111;
                const ramWrite = this.ramWriteMethods[writeMethod];
                if (this.mode === 0) {
                    ramWrite(maskedAddress, value);
                }
                else {
                    const actualAddress = (this.ramBankNumber << 13) + maskedAddress;
                    ramWrite(actualAddress, value);
                }
            }
        }
        isRamEnableRegister(address) {
            return address >= 0 && address <= 0x1fff;
        }
        isRomBankNumberRegister(address) {
            return address >= 0x2000 && address <= 0x3fff;
        }
        isRamBankNumberRegister(address) {
            return address >= 0x4000 && address <= 0x5fff;
        }
        isBankingModeRegister(address) {
            return address >= 0x6000 && address <= 0x7fff;
        }
        isRamAddress(address) {
            return address >= 0xa000 && address <= 0xbfff;
        }
    }
    exports.Mbc1Cartridge = Mbc1Cartridge;
});
define("cartridge/Mbc2Cartridge", ["require", "exports", "cartridge/CartridgeType", "cartridge/Mbc1Cartridge"], function (require, exports, CartridgeType_2, Mbc1Cartridge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mbc2Cartridge = void 0;
    class Mbc2Cartridge extends Mbc1Cartridge_1.Mbc1Cartridge {
        romBankNumber = 1;
        constructor(gameDataView) {
            super(gameDataView);
            if (this.type === CartridgeType_2.CartridgeType.MBC2_PLUS_BATTERY) {
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
});
define("misc/BitOperations", ["require", "exports"], function (require, exports) {
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
});
define("cartridge/Mbc3Cartridge", ["require", "exports", "misc/BitOperations", "cartridge/CartridgeType", "cartridge/MbcCartridge"], function (require, exports, BitOperations_1, CartridgeType_3, MbcCartridge_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mbc3Cartridge = void 0;
    var RtcType;
    (function (RtcType) {
        RtcType[RtcType["Unlatched"] = 0] = "Unlatched";
        RtcType[RtcType["Latched"] = 1] = "Latched";
    })(RtcType || (RtcType = {}));
    class Mbc3Cartridge extends MbcCartridge_2.MbcCartridge {
        constructor(gameDataView) {
            super(gameDataView);
            if (this.type === CartridgeType_3.CartridgeType.MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY) {
                this.updateClock();
                setInterval(() => {
                    this.updateClock();
                }, 1000);
            }
            if ([CartridgeType_3.CartridgeType.MBC3_PLUS_RAM_PLUS_BATTERY, CartridgeType_3.CartridgeType.MBC3_PLUS_TIMER_PLUS_BATTERY, CartridgeType_3.CartridgeType.MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY].includes(this.type)) {
                this.hasBattery = true;
            }
        }
        mode = 0;
        ramAndTimerEnable = false;
        romBankNumber = 1;
        ramBankNumberOrRtcRegister = 0;
        sramTimeout = null;
        // in the case of the RTC registers, the 0th index are the
        // normal unlatched values that will continuously count down
        // the 1st index denotes latched registers
        secondsRegister = [0, 0];
        minutesRegister = [0, 0];
        hoursRegister = [0, 0];
        lowerDaysRegister = [0, 0];
        upperDaysRegister = [0, 0];
        latchClockRegister = -1;
        clockIsLatched = false;
        updateClock() {
            const date = new Date();
            this.secondsRegister[RtcType.Unlatched] = date.getSeconds();
            this.minutesRegister[RtcType.Unlatched] = date.getMinutes();
            this.hoursRegister[RtcType.Unlatched] = date.getHours();
            this.lowerDaysRegister[RtcType.Unlatched] = this.getDays();
            this.upperDaysRegister[RtcType.Unlatched] = 0;
        }
        getDays() {
            const date = new Date();
            return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
        }
        _read(address, readMethod) {
            const read = this.readMethods[readMethod];
            const ramRead = this.ramReadMethods[readMethod];
            if (this.isRomBankZero(address)) {
                return read(address);
            }
            if (this.isRomBankOneThru7f(address)) {
                const maskedAddress = address & 0b11111111111111;
                const actualAddress = (this.romBankNumber << 14) | maskedAddress;
                return read(actualAddress);
            }
            if (!this.ramAndTimerEnable) {
                return 0xff;
            }
            if (this.ramBankNumberOrRtcRegister <= 3) {
                const maskedAddress = (address - 0xa000) & 0b1111111111111;
                const realAddress = ((this.ramBankNumberOrRtcRegister << 13) | maskedAddress);
                return ramRead(realAddress);
            }
            else {
                return this.readFromRtcRegister();
            }
        }
        copyRTCToLatchedRegisters() {
            this.secondsRegister[RtcType.Latched] = this.secondsRegister[RtcType.Unlatched];
            this.minutesRegister[RtcType.Latched] = this.minutesRegister[RtcType.Unlatched];
            this.hoursRegister[RtcType.Latched] = this.minutesRegister[RtcType.Unlatched];
            this.lowerDaysRegister[RtcType.Latched] = this.lowerDaysRegister[RtcType.Unlatched];
            this.upperDaysRegister[RtcType.Latched] = this.upperDaysRegister[RtcType.Unlatched];
        }
        _write(address, value, writeMethod) {
            const sramWrite = this.ramWriteMethods[writeMethod];
            if (this.isRamAndTimerEnableAddress(address)) {
                const lowerBits = value & 0b1111;
                this.ramAndTimerEnable = lowerBits === 0xa;
            }
            else if (this.isRomBankNumber(address)) {
                this.romBankNumber = value & 0b1111111;
                if (this.romBankNumber === 0) {
                    this.romBankNumber = 1;
                }
            }
            else if (this.isRamBankNumberOrRtcRegisterSelect(address)) {
                this.ramBankNumberOrRtcRegister = value;
            }
            else if (this.isLatchClockAddress(address)) {
                if (this.latchClockRegister === 0 && value === 1) {
                    this.clockIsLatched = !this.clockIsLatched;
                    if (this.clockIsLatched) {
                        this.copyRTCToLatchedRegisters();
                    }
                }
                this.latchClockRegister = value;
            }
            else if (this.isRamOrRtcRegisterAddress(address)) {
                if (this.ramBankNumberOrRtcRegister <= 3) {
                    const maskedAddress = (address - 0xa000) & 0b1111111111111;
                    const realAddress = (this.ramBankNumberOrRtcRegister << 13) + maskedAddress;
                    sramWrite(realAddress, value);
                }
                else {
                    this.updateRtcRegister(value);
                }
            }
        }
        readFromRtcRegister() {
            const registerIndex = RtcType.Unlatched;
            switch (this.ramBankNumberOrRtcRegister) {
                case 0x8:
                    return this.secondsRegister[registerIndex];
                case 0x9:
                    return this.minutesRegister[registerIndex];
                case 0xa:
                    return this.hoursRegister[registerIndex];
                case 0xb:
                    return this.lowerDaysRegister[registerIndex];
                case 0xc:
                    return this.upperDaysRegister[registerIndex];
                default:
                    throw new Error(`invalid value specified:0x${this.ramBankNumberOrRtcRegister.toString(16)}`);
            }
        }
        updateRtcRegister(value) {
            const index = RtcType.Unlatched;
            this.upperDaysRegister[index] = (0, BitOperations_1.setBit)(this.upperDaysRegister[index], 6, 1);
            switch (this.ramBankNumberOrRtcRegister) {
                case 0x8:
                    this.secondsRegister[index] = value % 60;
                    break;
                case 0x9:
                    this.minutesRegister[index] = value % 60;
                    break;
                case 0xa:
                    this.hoursRegister[index] = value % 60;
                    break;
                case 0xb:
                    const upperBit = (0, BitOperations_1.getBit)(value, 8);
                    this.lowerDaysRegister[index] = value & 0b11111111;
                    this.upperDaysRegister[index] = (0, BitOperations_1.setBit)(this.upperDaysRegister[index], 0, upperBit);
                    if (value > 0x1ff) {
                        // overflow happens
                        this.upperDaysRegister[index] = (0, BitOperations_1.setBit)(this.upperDaysRegister[index], 7, 1);
                    }
                    break;
                case 0xc:
                    this.upperDaysRegister[index] = value & 0xff;
                    break;
                default:
                    throw new Error("invalid value specified");
            }
            this.upperDaysRegister[index] = (0, BitOperations_1.setBit)(this.upperDaysRegister[index], 6, 0);
        }
        // read addresses
        isRomBankZero(address) {
            return address >= 0 && address <= 0x3fff;
        }
        isRomBankOneThru7f(address) {
            return address >= 0x4000 && address <= 0x7fff;
        }
        // write addresses
        isRamAndTimerEnableAddress(address) {
            return address >= 0 && address <= 0x1fff;
        }
        isRomBankNumber(address) {
            return address >= 0x2000 && address <= 0x3fff;
        }
        isRamBankNumberOrRtcRegisterSelect(address) {
            return address >= 0x4000 && address <= 0x5fff;
        }
        isLatchClockAddress(address) {
            return address >= 0x6000 && address <= 0x7fff;
        }
        isRamOrRtcRegisterAddress(address) {
            return address >= 0xa000 && address <= 0xbfff;
        }
    }
    exports.Mbc3Cartridge = Mbc3Cartridge;
});
define("cartridge/Mbc5Cartridge", ["require", "exports", "cartridge/CartridgeType", "cartridge/MbcCartridge"], function (require, exports, CartridgeType_4, MbcCartridge_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mbc5Cartridge = void 0;
    class Mbc5Cartridge extends MbcCartridge_3.MbcCartridge {
        romBankNumberLower = 0;
        romBankNumberHigher = 0;
        ramBankNumber = 0;
        ramEnabled = false;
        constructor(gameDataView) {
            super(gameDataView);
            if (this.type === CartridgeType_4.CartridgeType.MBC5_PLUS_RAM_PLUS_BATTERY) {
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
});
define("cpu/memory_registers/MemoryRegister", ["require", "exports", "misc/BitOperations"], function (require, exports, BitOperations_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MemoryRegister = void 0;
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
            this.value = (0, BitOperations_2.setBit)(this.value, pos, bitValue);
        }
        getBit(pos) {
            return (0, BitOperations_2.getBit)(this.value, pos);
        }
        resetBit(pos) {
            this.value = (0, BitOperations_2.resetBit)(this.value, pos);
        }
    }
    exports.MemoryRegister = MemoryRegister;
});
define("gpu/registers/BackgroundPaletteIndexRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BackgroundPaletteIndexRegister = void 0;
    class BackgroundPaletteIndexRegister extends MemoryRegister_1.MemoryRegister {
        constructor(memory) {
            super(0xff68, memory, "BackgroundPaletteIndexRegister");
        }
        get paletteAddress() {
            return this.value & 0b111111;
        }
        set paletteAddress(newVal) {
            const paletteAddress = newVal & 0b111111;
            const actualWrite = (this.getBit(7) << 7) | paletteAddress;
            this.memory.writeByte(this.address, actualWrite);
        }
        get autoIncrement() {
            return this.getBit(7) === 1;
        }
    }
    exports.BackgroundPaletteIndexRegister = BackgroundPaletteIndexRegister;
});
define("gpu/registers/ObjectPaletteIndexRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectPaletteIndexRegister = void 0;
    class ObjectPaletteIndexRegister extends MemoryRegister_2.MemoryRegister {
        constructor(memory) {
            super(0xff6a, memory);
        }
        get paletteAddress() {
            return this.value & 0b111111;
        }
        set paletteAddress(newVal) {
            const paletteAddress = newVal & 0b111111;
            const actualWrite = (this.getBit(7) << 7) | paletteAddress;
            this.memory.writeByte(this.address, actualWrite);
        }
        get autoIncrement() {
            return (this.value >> 7) & 1;
        }
    }
    exports.ObjectPaletteIndexRegister = ObjectPaletteIndexRegister;
});
define("cpu/memory_registers/JoypadRegister", ["require", "exports", "misc/BitOperations"], function (require, exports, BitOperations_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.joypadRegister = exports.JoypadRegister = void 0;
    class JoypadRegister {
        value = 0xff;
        isPressingDown = false;
        isPressingUp = false;
        isPressingLeft = false;
        isPressingRight = false;
        isPressingA = false;
        isPressingB = false;
        isPressingStart = false;
        isPressingSelect = false;
        get isCheckingDirections() {
            return this.getBit(4) === 0;
        }
        get isCheckingButtons() {
            return this.getBit(5) === 0;
        }
        getInput() {
            if (this.isCheckingDirections) {
                this.setBit(0, this.isPressingRight ? 0 : 1);
                this.setBit(1, this.isPressingLeft ? 0 : 1);
                this.setBit(2, this.isPressingUp ? 0 : 1);
                this.setBit(3, this.isPressingDown ? 0 : 1);
            }
            if (this.isCheckingButtons) {
                this.setBit(0, this.isPressingA ? 0 : 1);
                this.setBit(1, this.isPressingB ? 0 : 1);
                this.setBit(2, this.isPressingSelect ? 0 : 1);
                this.setBit(3, this.isPressingStart ? 0 : 1);
            }
            this.setBit(4, this.isCheckingButtons ? 0 : 1);
            this.setBit(5, this.isCheckingDirections ? 0 : 1);
            return this.value;
        }
        setBit(pos, bitValue) {
            this.value = (0, BitOperations_3.setBit)(this.value, pos, bitValue);
        }
        getBit(pos) {
            return (0, BitOperations_3.getBit)(this.value, pos);
        }
    }
    exports.JoypadRegister = JoypadRegister;
    exports.joypadRegister = new JoypadRegister();
});
define("cpu/Memory", ["require", "exports", "cartridge/Cartridge", "cartridge/CartridgeType", "cartridge/Mbc1Cartridge", "cartridge/Mbc2Cartridge", "cartridge/Mbc3Cartridge", "cartridge/Mbc5Cartridge", "gpu/registers/BackgroundPaletteIndexRegister", "gpu/registers/ObjectPaletteIndexRegister", "misc/BitOperations", "cpu/memory_registers/JoypadRegister"], function (require, exports, Cartridge_2, CartridgeType_5, Mbc1Cartridge_2, Mbc2Cartridge_1, Mbc3Cartridge_1, Mbc5Cartridge_1, BackgroundPaletteIndexRegister_1, ObjectPaletteIndexRegister_1, BitOperations_4, JoypadRegister_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Memory = void 0;
    const JOYPAD_REGISTER_ADDRESS = 0xff00;
    const DMA_TRANSFER_ADDRESS = 0xff46;
    const DIVIDER_REGISTER_ADDRESS = 0xff04;
    const CARTRIDGE_TYPE_ADDRESS = 0x147;
    const HDMA_TRANSFER_ADDRESS = 0xff55;
    var TransferType;
    (function (TransferType) {
        TransferType[TransferType["GeneralPurpose"] = 0] = "GeneralPurpose";
        TransferType[TransferType["Hblank"] = 1] = "Hblank";
    })(TransferType || (TransferType = {}));
    class Memory {
        memoryBuffer = new ArrayBuffer(0x10000);
        memoryView = new DataView(this.memoryBuffer);
        memoryBytes = new Uint8Array(this.memoryBuffer);
        static BgpdRegisterAddress = 0xff69;
        static ObpdRegisterAddress = 0xff6b;
        backgroundPaletteIndexRegister = new BackgroundPaletteIndexRegister_1.BackgroundPaletteIndexRegister(this);
        objectPaletteIndexRegister = new ObjectPaletteIndexRegister_1.ObjectPaletteIndexRegister(this);
        initialHdmaSourceAddress = 0;
        initialHdmaDestinationAddress = 0;
        currentHdmaSourceAddress = -1;
        currentHdmaDestinationAddress = -1;
        currentTransferLength = -1;
        vramBank1Buffer = new ArrayBuffer(0x2000);
        vramView = new DataView(this.vramBank1Buffer);
        vramBytes = new Uint8Array(this.vramBank1Buffer);
        backgroundPaletteRam = new ArrayBuffer(0x40);
        backgroundPaletteView = new DataView(this.backgroundPaletteRam);
        backgroundPaletteBytes = new Uint8Array(this.backgroundPaletteRam);
        objectPaletteRam = new ArrayBuffer(0x40);
        objectPaletteView = new DataView(this.objectPaletteRam);
        objectPaletteBytes = new Uint8Array(this.objectPaletteRam);
        cartridge;
        isGBC;
        wramBankBuffers = [];
        wramBankViews = [];
        wramBankBytes = [];
        // create the wram banks
        constructor() {
            for (let i = 1; i < 8; i++) {
                const arrayBuffer = new ArrayBuffer(0x1000);
                this.wramBankBuffers[i] = arrayBuffer;
                this.wramBankViews[i] = new DataView(arrayBuffer);
                this.wramBankBytes[i] = new Uint8Array(arrayBuffer);
            }
        }
        loadCartridge(gameDataView) {
            const cartridgeType = gameDataView.getUint8(CARTRIDGE_TYPE_ADDRESS);
            switch (cartridgeType) {
                case CartridgeType_5.CartridgeType.ROM:
                    this.cartridge = new Cartridge_2.Cartridge(gameDataView);
                    break;
                case CartridgeType_5.CartridgeType.MBC1:
                case CartridgeType_5.CartridgeType.MBC1_PLUS_RAM:
                case CartridgeType_5.CartridgeType.MBC1_PLUS_RAM_PLUS_BATTERY:
                    this.cartridge = new Mbc1Cartridge_2.Mbc1Cartridge(gameDataView);
                    break;
                case CartridgeType_5.CartridgeType.MBC2:
                case CartridgeType_5.CartridgeType.MBC2_PLUS_BATTERY:
                    this.cartridge = new Mbc2Cartridge_1.Mbc2Cartridge(gameDataView);
                    break;
                case CartridgeType_5.CartridgeType.MBC3:
                case CartridgeType_5.CartridgeType.MBC3_PLUS_RAM:
                case CartridgeType_5.CartridgeType.MBC3_PLUS_RAM_PLUS_BATTERY:
                case CartridgeType_5.CartridgeType.MBC3_PLUS_TIMER_PLUS_BATTERY:
                case CartridgeType_5.CartridgeType.MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY:
                    this.cartridge = new Mbc3Cartridge_1.Mbc3Cartridge(gameDataView);
                    break;
                case CartridgeType_5.CartridgeType.MBC5:
                case CartridgeType_5.CartridgeType.MBC5_PLUS_RAM:
                case CartridgeType_5.CartridgeType.MBC5_PLUS_RAM_PLUS_BATTERY:
                    this.cartridge = new Mbc5Cartridge_1.Mbc5Cartridge(gameDataView);
                    break;
                default:
                    throw new Error(`Cartridge type not supported: ${cartridgeType}`);
            }
            this.isGBC = this.cartridge.isGameboyColor();
            return this.isGBC;
        }
        get wramBank() {
            const val = this.readByte(0xff70);
            return val === 0 ? 1 : val & 0b111;
        }
        set wramBank(newVal) {
            const actualVal = (newVal & 0b111) === 0 ? 1 : newVal;
            this.writeByte(0xff70, actualVal & 0b111);
        }
        reset() {
            this.memoryBytes.fill(0, 0, this.memoryBytes.length - 1);
            this.vramBytes.fill(0, 0, this.vramBytes.length - 1);
            this.backgroundPaletteBytes.fill(0, 0, this.backgroundPaletteBytes.length - 1);
            this.objectPaletteBytes.fill(0, 0, this.objectPaletteBytes.length - 1);
        }
        readByte(address, vramBankNumber) {
            const vramBank = vramBankNumber != null ? vramBankNumber : this.vramBank;
            if (this.cartridge == null) {
                throw new Error("game ROM not loaded into memory!");
            }
            if (this.isAccessingCartridge(address)) {
                return this.cartridge.readByte(address);
            }
            if (address === Memory.BgpdRegisterAddress) {
                return this.backgroundPaletteView.getUint8(this.backgroundPaletteIndexRegister.paletteAddress);
            }
            if (address === Memory.ObpdRegisterAddress) {
                return this.objectPaletteView.getUint8(this.objectPaletteIndexRegister.paletteAddress);
            }
            if (address === JOYPAD_REGISTER_ADDRESS) {
                return JoypadRegister_1.joypadRegister.getInput();
            }
            if (this.isVram(address) && vramBank === 1) {
                return this.vramView.getUint8(address - 0x8000);
            }
            if (this.isWramBanks(address)) {
                return this.wramBankViews[this.wramBank].getUint8(address - 0xd000);
            }
            return this.memoryView.getUint8(address);
        }
        get vramBank() {
            return this.memoryView.getUint8(0xff4f) & 0b1;
        }
        readSignedByte(address) {
            if (this.cartridge == null) {
                throw new Error("game ROM not loaded into memory!");
            }
            if (this.isAccessingCartridge(address)) {
                return this.cartridge.readSignedByte(address);
            }
            if (this.isVram(address) && this.vramBank === 1) {
                return this.vramView.getInt8(address - 0x8000);
            }
            if (this.isWramBanks(address)) {
                return this.wramBankViews[this.wramBank].getInt8(address - 0xd000);
            }
            return this.memoryView.getInt8(address);
        }
        readWord(address) {
            if (this.cartridge == null) {
                throw new Error("game ROM not loaded into memory!");
            }
            if (this.isAccessingCartridge(address)) {
                return this.cartridge.readWord(address);
            }
            if (this.isVram(address) && this.vramBank === 1) {
                return this.vramView.getUint16(address - 0x8000, true);
            }
            if (this.isWramBanks(address)) {
                return this.wramBankViews[this.wramBank].getUint16(address - 0xd000, true);
            }
            return this.memoryView.getUint16(address, true);
        }
        writeByte(address, value, caller, canOverrideDivReg = false) {
            if (this.isAccessingCartridge(address)) {
                this.cartridge?.writeByte(address, value);
                return;
            }
            if (address === JOYPAD_REGISTER_ADDRESS) {
                JoypadRegister_1.joypadRegister.value = value;
                return;
            }
            if (address === DIVIDER_REGISTER_ADDRESS && !canOverrideDivReg) {
                this.memoryView.setUint8(address, 0);
                return;
            }
            if (address === Memory.BgpdRegisterAddress) {
                this.backgroundPaletteView.setUint8(this.backgroundPaletteIndexRegister.paletteAddress, value);
                if (this.backgroundPaletteIndexRegister.autoIncrement) {
                    this.backgroundPaletteIndexRegister.paletteAddress++;
                }
                return;
            }
            if (address === Memory.ObpdRegisterAddress) {
                this.objectPaletteView.setUint8(this.objectPaletteIndexRegister.paletteAddress, value);
                if (this.objectPaletteIndexRegister.autoIncrement) {
                    this.objectPaletteIndexRegister.paletteAddress++;
                }
                return;
            }
            if (this.isVram(address) && this.vramBank === 1) {
                this.vramView.setUint8(address - 0x8000, value);
                return;
            }
            if (this.isWramBanks(address)) {
                this.wramBankViews[this.wramBank].setUint8(address - 0xd000, value);
                return;
            }
            this.memoryView.setUint8(address, value);
            if (address === DMA_TRANSFER_ADDRESS) {
                this.doDmaTransfer(value);
            }
            if (address === HDMA_TRANSFER_ADDRESS) {
                this.doHdmaTransfer(value);
            }
        }
        writeWord(address, value) {
            if (this.isAccessingCartridge(address)) {
                this.cartridge?.writeWord(address, value);
                return;
            }
            if (this.isVram(address) && this.isGBC && this.vramBank === 1) {
                this.vramView.setUint16(address - 0x8000, value, true);
                return;
            }
            if (this.isWramBanks(address)) {
                this.wramBankViews[this.wramBank].setUint16(address - 0xd000, value, true);
                return;
            }
            this.memoryView.setUint16(address, value, true);
        }
        isAccessingCartridge(address) {
            return address <= 0x7FFF || (address >= 0xA000 && address <= 0xBFFF);
        }
        isVram(address) {
            return address >= 0x8000 && address <= 0x9fff;
        }
        isWramBanks(address) {
            return address >= 0xd000 && address <= 0xdfff;
        }
        // see http://www.codeslinger.co.uk/pages/projects/gameboy/dma.html
        doDmaTransfer(value) {
            const address = value << 8;
            for (let i = 0; i < 0xa0; i++) {
                this.writeByte(0xFE00 + i, this.readByte(address + i));
            }
        }
        // see https://gbdev.io/pandocs/CGB_Registers.html
        doHdmaTransfer(value) {
            const transferLength = ((value & 0b1111111) + 1) * 0x10;
            const transferType = (0, BitOperations_4.getBit)(value, 7);
            const destinationStartAddress = this.hdmaDestinationAddress;
            const sourceStartAddress = this.hdmaSourceAddress;
            if (transferType === TransferType.GeneralPurpose) {
                this.doGeneralPurposeHdma(sourceStartAddress, destinationStartAddress, transferLength);
            }
            else {
                this.currentHdmaDestinationAddress = -1;
                this.currentHdmaSourceAddress = -1;
                this.initialHdmaSourceAddress = sourceStartAddress;
                this.initialHdmaDestinationAddress = destinationStartAddress;
                this.currentTransferLength = transferLength;
            }
        }
        get hdmaDestinationAddress() {
            const upperByte = this.readByte(0xff53) & 0b11111;
            const lowerByte = this.readByte(0xff54) & 0b11110000;
            return ((upperByte << 8) + lowerByte);
        }
        set hdmaDestinationAddress(newAddress) {
            const upperByte = (newAddress >> 8) & 0b11111;
            const lowerByte = newAddress & 0b11110000;
            this.writeByte(0xff53, upperByte);
            this.writeByte(0xff54, lowerByte);
        }
        get hdmaSourceAddress() {
            const upperByte = this.readByte(0xff51);
            const lowerByte = this.readByte(0xff52) & 0b11110000;
            return ((upperByte << 8) + lowerByte);
        }
        set hdmaSourceAddress(newAddress) {
            const upperByte = (newAddress >> 8);
            const lowerByte = newAddress & 0b11110000;
            this.writeByte(0xff51, upperByte);
            this.writeByte(0xff52, lowerByte);
        }
        doGeneralPurposeHdma(sourceStartAddress, destinationStartAddress, transferLength) {
            const actualDestinationStartAddress = destinationStartAddress | 0x8000;
            for (let i = 0; i < transferLength; i++) {
                this.writeByte(actualDestinationStartAddress + i, this.readByte(sourceStartAddress + i));
            }
            // transfer completed
            this.writeByte(0xff55, 0xff);
            this.hdmaDestinationAddress += transferLength;
            this.hdmaSourceAddress += transferLength;
        }
        doHblankHdmaTransfer() {
            if (this.currentTransferLength === 0) {
                return;
            }
            if (this.currentHdmaDestinationAddress === -1) {
                this.currentHdmaDestinationAddress = this.initialHdmaDestinationAddress;
            }
            if (this.currentHdmaSourceAddress === -1) {
                this.currentHdmaSourceAddress = this.initialHdmaSourceAddress;
            }
            const actualDestinationStart = this.currentHdmaDestinationAddress | 0x8000;
            for (let i = 0; i < 0x10; i++) {
                this.writeByte(actualDestinationStart + i, this.readByte(this.currentHdmaSourceAddress + i));
            }
            this.hdmaDestinationAddress += 0x10;
            this.hdmaSourceAddress += 0x10;
            this.currentTransferLength -= 0x10;
            this.currentHdmaDestinationAddress = this.hdmaDestinationAddress;
            this.currentHdmaSourceAddress = this.hdmaSourceAddress;
        }
    }
    exports.Memory = Memory;
});
define("apu/AudioBufferPlayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AudioBufferPlayer = void 0;
    class AudioBufferPlayer {
        audioContext;
        audioBuffer;
        audioData;
        readPointer = new Uint32Array(new SharedArrayBuffer(4));
        writePointer = new Uint32Array(new SharedArrayBuffer(4));
        samples = new Float32Array(1024);
        sampleIndex = 0;
        audioPlayerNode;
        constructor(audioContext) {
            this.audioContext = audioContext;
            this.audioBuffer = new SharedArrayBuffer(this.audioContext.sampleRate / 20 * Float32Array.BYTES_PER_ELEMENT);
            this.audioData = new Float32Array(this.audioBuffer);
            this.addAudioWorklet();
        }
        async addAudioWorklet() {
            await this.audioContext.audioWorklet.addModule("AudioProcessor.js");
            this.audioPlayerNode = new AudioWorkletNode(this.audioContext, "audio-processor", {
                processorOptions: {
                    audioData: this.audioData,
                    readPointer: this.readPointer,
                    writePointer: this.writePointer
                }
            });
            this.audioPlayerNode.connect(this.audioContext.destination);
        }
        writeSample(sample) {
            this.samples[this.sampleIndex] = sample;
            this.sampleIndex++;
            // either leftSamples or rightSamples would do here
            if (this.sampleIndex === this.samples.length) {
                this.push(this.samples);
                this.sampleIndex = 0;
            }
        }
        /**
         *
         * credit to https://github.com/roblouie/gameboy-emulator for these methods
         *
         */
        push(elements) {
            const readPosition = Atomics.load(this.readPointer, 0);
            const writePosition = Atomics.load(this.writePointer, 0);
            const availableToWrite = this._availableWrite(readPosition, writePosition);
            if (availableToWrite === 0) {
                return 0;
            }
            const howManyToWrite = Math.min(availableToWrite, elements.length);
            const sizeUpToEndOfArray = Math.min(this.audioData.length - writePosition, howManyToWrite);
            const sizeFromStartOfArrayOrZero = howManyToWrite - sizeUpToEndOfArray;
            this.copy(elements, 0, this.audioData, writePosition, sizeUpToEndOfArray);
            this.copy(elements, sizeUpToEndOfArray, this.audioData, 0, sizeFromStartOfArrayOrZero);
            const writePointerPositionAfterWrite = (writePosition + howManyToWrite) % this.audioData.length;
            Atomics.store(this.writePointer, 0, writePointerPositionAfterWrite);
            return howManyToWrite;
        }
        availableWrite() {
            const readPosition = Atomics.load(this.readPointer, 0);
            const writePosition = Atomics.load(this.writePointer, 0);
            return this._availableWrite(readPosition, writePosition);
        }
        _availableWrite(readPosition, writePosition) {
            let distanceToWrite = readPosition - writePosition - 1;
            if (writePosition >= readPosition) {
                distanceToWrite += this.audioData.length;
            }
            return distanceToWrite;
        }
        copy(input, offsetInput, output, offsetOutput, size) {
            for (let i = 0; i < size; i++) {
                output[offsetOutput + i] = input[offsetInput + i];
            }
        }
    }
    exports.AudioBufferPlayer = AudioBufferPlayer;
});
define("apu/registers/ChannelFrequencyHighRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelFrequencyHighRegister = void 0;
    class ChannelFrequencyHighRegister extends MemoryRegister_3.MemoryRegister {
        get frequencyHighBits() {
            return this.value & 0b111;
        }
        get soundLengthEnable() {
            return this.getBit(6);
        }
        get restartTrigger() {
            return this.getBit(7);
        }
        set restartTrigger(newValue) {
            this.setBit(7, newValue & 0b1);
        }
    }
    exports.ChannelFrequencyHighRegister = ChannelFrequencyHighRegister;
});
define("apu/registers/ChannelLengthTimerAndDutyRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelLengthTimerAndDutyRegister = void 0;
    class ChannelLengthTimerAndDutyRegister extends MemoryRegister_4.MemoryRegister {
        get waveDuty() {
            return (this.value >> 6) & 0b11;
        }
        get initialLengthTimer() {
            return this.value & 0b111111;
        }
    }
    exports.ChannelLengthTimerAndDutyRegister = ChannelLengthTimerAndDutyRegister;
});
define("apu/registers/ChannelSweepRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelSweepRegister = void 0;
    class ChannelSweepRegister extends MemoryRegister_5.MemoryRegister {
        constructor(memory) {
            super(0xff10, memory);
        }
        get sweepShift() {
            return this.value & 0b111;
        }
        get sweepDirection() {
            return this.getBit(3);
        }
        get sweepPace() {
            return (this.value >> 4) & 0b111;
        }
    }
    exports.ChannelSweepRegister = ChannelSweepRegister;
});
define("apu/registers/ChannelVolumeAndEnvelopeRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelVolumeAndEnvelopeRegister = void 0;
    class ChannelVolumeAndEnvelopeRegister extends MemoryRegister_6.MemoryRegister {
        get sweepPace() {
            return this.value & 0b111;
        }
        get envelopeDirection() {
            return this.getBit(3);
        }
        get initialVolume() {
            return this.value >> 4;
        }
    }
    exports.ChannelVolumeAndEnvelopeRegister = ChannelVolumeAndEnvelopeRegister;
});
define("apu/registers/MasterVolumeAndVinPanningRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MasterVolumeAndVinPanningRegister = void 0;
    class MasterVolumeAndVinPanningRegister extends MemoryRegister_7.MemoryRegister {
        constructor(memory) {
            super(0xff24, memory);
        }
        get rightVolume() {
            return (this.value & 0b111) + 1;
        }
        get mixVinIntoRightOutput() {
            return this.getBit(3);
        }
        get leftVolume() {
            return ((this.value >> 4) & 0b111) + 1;
        }
        get mixVinIntoLeftOutput() {
            return this.getBit(7);
        }
    }
    exports.MasterVolumeAndVinPanningRegister = MasterVolumeAndVinPanningRegister;
});
define("apu/registers/SoundOnRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SoundOnRegister = void 0;
    class SoundOnRegister extends MemoryRegister_8.MemoryRegister {
        constructor(memory) {
            super(0xff26, memory);
        }
        get isSoundOn() {
            return this.getBit(7);
        }
        get isChannel1On() {
            return this.getBit(0);
        }
        get isChannel2On() {
            return this.getBit(1);
        }
        get isChannel3On() {
            return this.getBit(2);
        }
        get isChannel4On() {
            return this.getBit(3);
        }
        set isChannel4On(newValue) {
            this.setBit(3, newValue & 0b1);
        }
        set isChannel3On(newValue) {
            this.setBit(2, newValue & 0b1);
        }
        set isChannel2On(newValue) {
            this.setBit(1, newValue & 0b1);
        }
        set isChannel1On(newValue) {
            this.setBit(0, newValue & 0b1);
        }
    }
    exports.SoundOnRegister = SoundOnRegister;
});
define("apu/registers/SoundPanningRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SoundPanningRegister = void 0;
    class SoundPanningRegister extends MemoryRegister_9.MemoryRegister {
        constructor(memory) {
            super(0xff25, memory);
        }
        get mixChannel1Right() {
            return this.getBit(0);
        }
        get mixChannel2Right() {
            return this.getBit(1);
        }
        get mixChannel3Right() {
            return this.getBit(2);
        }
        get mixChannel4Right() {
            return this.getBit(3);
        }
        get mixChannel1Left() {
            return this.getBit(4);
        }
        get mixChannel2Left() {
            return this.getBit(5);
        }
        get mixChannel3Left() {
            return this.getBit(6);
        }
        get mixChannel4Left() {
            return this.getBit(7);
        }
    }
    exports.SoundPanningRegister = SoundPanningRegister;
});
define("apu/channels/Channel2", ["require", "exports", "cpu/memory_registers/MemoryRegister", "apu/registers/ChannelFrequencyHighRegister", "apu/registers/ChannelLengthTimerAndDutyRegister", "apu/registers/ChannelVolumeAndEnvelopeRegister", "apu/registers/MasterVolumeAndVinPanningRegister", "apu/registers/SoundOnRegister", "apu/registers/SoundPanningRegister"], function (require, exports, MemoryRegister_10, ChannelFrequencyHighRegister_1, ChannelLengthTimerAndDutyRegister_1, ChannelVolumeAndEnvelopeRegister_1, MasterVolumeAndVinPanningRegister_1, SoundOnRegister_1, SoundPanningRegister_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Channel2 = void 0;
    class Channel2 {
        // per https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
        dutyTable = [
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0] // 75%
        ];
        // protected dutyTable = [
        //   [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
        //   [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
        //   [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
        //   [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
        // ]
        memory;
        channelFrequencyLowRegister;
        channelFrequencyHighRegister;
        channelLengthTimerAndDutyRegister;
        channelVolumeAndEnvelopeRegister;
        soundPanningRegister;
        soundOnRegister;
        masterVolumeAndVinPanningRegister;
        volume = 0;
        periodTimer = 0;
        lengthTimer = 0;
        frequencyTimer = 0;
        waveDutyPosition = 0;
        constructor(memory) {
            this.memory = memory;
            this.channelLengthTimerAndDutyRegister = new ChannelLengthTimerAndDutyRegister_1.ChannelLengthTimerAndDutyRegister(0xff16, this.memory);
            this.channelVolumeAndEnvelopeRegister = new ChannelVolumeAndEnvelopeRegister_1.ChannelVolumeAndEnvelopeRegister(0xff17, this.memory);
            this.channelFrequencyLowRegister = new MemoryRegister_10.MemoryRegister(0xff18, this.memory);
            this.channelFrequencyHighRegister = new ChannelFrequencyHighRegister_1.ChannelFrequencyHighRegister(0xff19, this.memory);
            this.soundOnRegister = new SoundOnRegister_1.SoundOnRegister(this.memory);
            this.soundPanningRegister = new SoundPanningRegister_1.SoundPanningRegister(this.memory);
            this.masterVolumeAndVinPanningRegister = new MasterVolumeAndVinPanningRegister_1.MasterVolumeAndVinPanningRegister(this.memory);
        }
        tick(cycles) {
            this.frequencyTimer -= cycles;
            if (this.channelFrequencyHighRegister.restartTrigger) {
                this.restartSound();
                this.channelFrequencyHighRegister.restartTrigger = 0;
            }
            if (this.frequencyTimer <= 0) {
                this.frequencyTimer = this.getFrequencyTimer();
                this.waveDutyPosition = (this.waveDutyPosition + 1) % 8;
            }
        }
        restartSound() {
            this.soundOnRegister.isChannel2On = 1;
            this.periodTimer = this.channelVolumeAndEnvelopeRegister.sweepPace;
            this.volume = this.channelVolumeAndEnvelopeRegister.initialVolume;
            this.frequencyTimer = this.getFrequencyTimer();
            this.lengthTimer = 64 - this.channelLengthTimerAndDutyRegister.initialLengthTimer;
        }
        getSample() {
            const amplitude = this.dutyTable[this.channelLengthTimerAndDutyRegister.waveDuty][this.waveDutyPosition];
            const sampleWithVolume = this.volume !== 0 && this.soundOnRegister.isChannel2On ? amplitude * this.volume : 0.0;
            return (sampleWithVolume / 7.5) - 1;
        }
        clockLength() {
            if (this.channelFrequencyHighRegister.soundLengthEnable) {
                this.lengthTimer--;
                if (this.lengthTimer === 0) {
                    this.soundOnRegister.isChannel2On = 0;
                }
            }
        }
        clockVolume() {
            const { sweepPace, envelopeDirection } = this.channelVolumeAndEnvelopeRegister;
            if (sweepPace !== 0) {
                if (this.periodTimer !== 0) {
                    this.periodTimer--;
                }
                if (this.periodTimer === 0) {
                    this.periodTimer = sweepPace;
                    if (envelopeDirection === 0 && this.volume > 0) {
                        this.volume--;
                    }
                    else if (envelopeDirection === 1 && this.volume < 0xf) {
                        this.volume++;
                    }
                }
            }
        }
        getFrequencyTimer() {
            return (2048 - this.getFrequency()) * 4;
        }
        getFrequency() {
            return this.channelFrequencyLowRegister.value | (this.channelFrequencyHighRegister.frequencyHighBits << 8);
        }
    }
    exports.Channel2 = Channel2;
});
define("apu/channels/Channel1", ["require", "exports", "cpu/memory_registers/MemoryRegister", "apu/registers/ChannelFrequencyHighRegister", "apu/registers/ChannelLengthTimerAndDutyRegister", "apu/registers/ChannelSweepRegister", "apu/registers/ChannelVolumeAndEnvelopeRegister", "apu/channels/Channel2"], function (require, exports, MemoryRegister_11, ChannelFrequencyHighRegister_2, ChannelLengthTimerAndDutyRegister_2, ChannelSweepRegister_1, ChannelVolumeAndEnvelopeRegister_2, Channel2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Channel1 = void 0;
    /**
     * Channel1 is essentially the same as
     * Channel2, except with a sweep function
     * added
     */
    class Channel1 extends Channel2_1.Channel2 {
        sweepEnabled = false;
        sweepTimer = 0;
        shadowFrequency = 0;
        channelSweepRegister;
        constructor(memory) {
            super(memory);
            this.channelSweepRegister = new ChannelSweepRegister_1.ChannelSweepRegister(memory);
            this.channelLengthTimerAndDutyRegister = new ChannelLengthTimerAndDutyRegister_2.ChannelLengthTimerAndDutyRegister(0xff11, this.memory);
            this.channelVolumeAndEnvelopeRegister = new ChannelVolumeAndEnvelopeRegister_2.ChannelVolumeAndEnvelopeRegister(0xff12, this.memory);
            this.channelFrequencyLowRegister = new MemoryRegister_11.MemoryRegister(0xff13, this.memory);
            this.channelFrequencyHighRegister = new ChannelFrequencyHighRegister_2.ChannelFrequencyHighRegister(0xff14, this.memory);
        }
        restartSound() {
            this.soundOnRegister.isChannel2On = 1;
            this.periodTimer = this.channelVolumeAndEnvelopeRegister.sweepPace;
            this.volume = this.channelVolumeAndEnvelopeRegister.initialVolume;
            this.frequencyTimer = this.getFrequencyTimer();
            this.lengthTimer = 64 - this.channelLengthTimerAndDutyRegister.initialLengthTimer;
            this.sweepTimer = this.channelSweepRegister.sweepPace !== 0 ? this.channelSweepRegister.sweepPace : 8;
            if (this.channelSweepRegister.sweepPace > 0 || this.channelSweepRegister.sweepShift > 0) {
                this.sweepEnabled = true;
            }
            this.shadowFrequency = this.getFrequency();
        }
        calculateFrequency() {
            let newFrequency = this.shadowFrequency >> this.channelSweepRegister.sweepShift;
            if (this.channelSweepRegister.sweepDirection === 1) {
                newFrequency = this.shadowFrequency + newFrequency;
            }
            else {
                newFrequency = this.shadowFrequency - newFrequency;
            }
            if (newFrequency > 2047) {
                this.soundOnRegister.isChannel1On = 0;
            }
            return newFrequency;
        }
        clockSweep() {
            if (this.sweepTimer > 0) {
                this.sweepTimer--;
            }
            if (this.sweepTimer === 0) {
                this.sweepTimer = this.channelSweepRegister.sweepPace !== 0 ? this.channelSweepRegister.sweepPace : 8;
                if (this.sweepEnabled && this.sweepTimer > 0) {
                    const newFrequency = this.calculateFrequency();
                    if (newFrequency < 2047 && this.sweepTimer > 0) {
                        this.frequencyTimer = newFrequency;
                        this.shadowFrequency = newFrequency;
                    }
                }
            }
        }
    }
    exports.Channel1 = Channel1;
});
define("apu/registers/ChannelDACEnableRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelDACEnableRegister = void 0;
    class ChannelDACEnableRegister extends MemoryRegister_12.MemoryRegister {
        constructor(memory) {
            super(0xff1a, memory);
        }
        get dacEnabled() {
            return this.getBit(7);
        }
    }
    exports.ChannelDACEnableRegister = ChannelDACEnableRegister;
});
define("apu/registers/ChannelOutputLevelRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelOutputLevelRegister = void 0;
    class ChannelOutputLevelRegister extends MemoryRegister_13.MemoryRegister {
        constructor(memory) {
            super(0xff1c, memory);
        }
        get outputLevelSelection() {
            return (this.value >> 5) & 0b11;
        }
    }
    exports.ChannelOutputLevelRegister = ChannelOutputLevelRegister;
});
define("apu/channels/Channel3", ["require", "exports", "cpu/memory_registers/MemoryRegister", "apu/registers/ChannelDACEnableRegister", "apu/registers/ChannelFrequencyHighRegister", "apu/registers/ChannelOutputLevelRegister", "apu/registers/SoundOnRegister"], function (require, exports, MemoryRegister_14, ChannelDACEnableRegister_1, ChannelFrequencyHighRegister_3, ChannelOutputLevelRegister_1, SoundOnRegister_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Channel3 = void 0;
    class Channel3 {
        memory;
        channelDACEnableRegister;
        channelFrequencyLowRegister;
        channelFrequencyHighRegister;
        channelLengthTimerRegister;
        channelOutputLevelRegister;
        soundOnRegister;
        sampleStartAddress = 0xff30;
        frequencyTimer = 0;
        samplePosition = 0;
        lengthTimer = 0;
        // see https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
        volumeShifts = [4, 0, 1, 2];
        constructor(memory) {
            this.memory = memory;
            this.channelDACEnableRegister = new ChannelDACEnableRegister_1.ChannelDACEnableRegister(this.memory);
            this.channelLengthTimerRegister = new MemoryRegister_14.MemoryRegister(0xff1b, this.memory);
            this.channelOutputLevelRegister = new ChannelOutputLevelRegister_1.ChannelOutputLevelRegister(this.memory);
            this.channelFrequencyLowRegister = new MemoryRegister_14.MemoryRegister(0xff1d, this.memory);
            this.channelFrequencyHighRegister = new ChannelFrequencyHighRegister_3.ChannelFrequencyHighRegister(0xff1e, this.memory);
            this.soundOnRegister = new SoundOnRegister_2.SoundOnRegister(this.memory);
        }
        tick(cycles) {
            this.frequencyTimer -= cycles;
            if (this.channelFrequencyHighRegister.restartTrigger) {
                this.restartSound();
                this.channelFrequencyHighRegister.restartTrigger = 0;
            }
            if (this.frequencyTimer <= 0) {
                this.frequencyTimer = this.getFrequencyTimer();
                this.samplePosition = (this.samplePosition + 1) % 32;
            }
        }
        clockLength() {
            if (this.channelFrequencyHighRegister.soundLengthEnable) {
                this.lengthTimer--;
                if (this.lengthTimer === 0) {
                    this.soundOnRegister.isChannel3On = 0;
                }
            }
        }
        getSample() {
            const memoryIndex = Math.floor(this.samplePosition / 2);
            const isUpper = this.samplePosition % 2 === 0;
            const byte = this.memory.readByte(this.sampleStartAddress + memoryIndex);
            const sample = isUpper ? byte >> 4 : byte & 0b1111;
            const volumeAdjustedSample = sample >> this.volumeShifts[this.channelOutputLevelRegister.outputLevelSelection];
            if (this.soundOnRegister.isChannel3On && this.channelDACEnableRegister.dacEnabled) {
                return (volumeAdjustedSample / 7.5) - 1.0;
            }
            else {
                return 0;
            }
        }
        restartSound() {
            this.soundOnRegister.isChannel3On = 1;
            this.frequencyTimer = this.getFrequencyTimer();
            this.samplePosition = 0;
            this.lengthTimer = 256 - this.channelLengthTimerRegister.value;
        }
        getFrequencyTimer() {
            return (2048 - this.getFrequency()) * 2;
        }
        getFrequency() {
            return this.channelFrequencyLowRegister.value | (this.channelFrequencyHighRegister.frequencyHighBits << 8);
        }
    }
    exports.Channel3 = Channel3;
});
define("apu/registers/Channel4ControlRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Channel4ControlRegister = void 0;
    class Channel4ControlRegister extends MemoryRegister_15.MemoryRegister {
        constructor(memory) {
            super(0xff23, memory);
        }
        get soundLengthEnable() {
            return this.getBit(6);
        }
        get restartTrigger() {
            return this.getBit(7);
        }
    }
    exports.Channel4ControlRegister = Channel4ControlRegister;
});
define("apu/registers/Channel4LengthTimerRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Channel4LengthTimerRegister = void 0;
    class Channel4LengthTimerRegister extends MemoryRegister_16.MemoryRegister {
        constructor(memory) {
            super(0xff20, memory);
        }
        get lengthTimer() {
            return this.value & 0b111111;
        }
    }
    exports.Channel4LengthTimerRegister = Channel4LengthTimerRegister;
});
define("apu/registers/ChannelFrequencyAndRandomnessRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelFrequencyAndRandomnessRegister = void 0;
    class ChannelFrequencyAndRandomnessRegister extends MemoryRegister_17.MemoryRegister {
        constructor(memory) {
            super(0xff22, memory);
        }
        get divisorCode() {
            return this.value & 0b111;
        }
        get lfsrWidth() {
            return this.getBit(3);
        }
        get clockShift() {
            return this.value >> 4;
        }
    }
    exports.ChannelFrequencyAndRandomnessRegister = ChannelFrequencyAndRandomnessRegister;
});
define("apu/channels/Channel4", ["require", "exports", "misc/BitOperations", "apu/registers/Channel4ControlRegister", "apu/registers/Channel4LengthTimerRegister", "apu/registers/ChannelFrequencyAndRandomnessRegister", "apu/registers/ChannelVolumeAndEnvelopeRegister", "apu/registers/SoundOnRegister"], function (require, exports, BitOperations_5, Channel4ControlRegister_1, Channel4LengthTimerRegister_1, ChannelFrequencyAndRandomnessRegister_1, ChannelVolumeAndEnvelopeRegister_3, SoundOnRegister_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Channel4 = void 0;
    class Channel4 {
        channel4LengthTimerRegister;
        channelVolumeAndEnvelopeRegister;
        channelFrequencyAndRandomnessRegister;
        soundOnRegister;
        channel4ControlRegister;
        memory;
        divisors = [8, 16, 32, 48, 64, 80, 96, 112];
        frequencyTimer = 0;
        lengthTimer = 0;
        volume = 0;
        linearFeedbackShift = 0;
        periodTimer = 0;
        constructor(memory) {
            this.memory = memory;
            this.channel4LengthTimerRegister = new Channel4LengthTimerRegister_1.Channel4LengthTimerRegister(this.memory);
            this.channelVolumeAndEnvelopeRegister = new ChannelVolumeAndEnvelopeRegister_3.ChannelVolumeAndEnvelopeRegister(0xff21, this.memory);
            this.channelFrequencyAndRandomnessRegister = new ChannelFrequencyAndRandomnessRegister_1.ChannelFrequencyAndRandomnessRegister(this.memory);
            this.channel4ControlRegister = new Channel4ControlRegister_1.Channel4ControlRegister(this.memory);
            this.soundOnRegister = new SoundOnRegister_3.SoundOnRegister(this.memory);
        }
        tick(cycles) {
            if (this.channel4ControlRegister.restartTrigger) {
                this.restartSound();
            }
            this.frequencyTimer -= cycles;
            if (this.frequencyTimer === 0) {
                this.frequencyTimer = this.getFrequencyTimer();
                const xorResult = (0, BitOperations_5.getBit)(this.linearFeedbackShift, 0) ^ (0, BitOperations_5.getBit)(this.linearFeedbackShift, 1);
                this.linearFeedbackShift = (this.linearFeedbackShift >> 1) | (xorResult << 14);
                if (this.channelFrequencyAndRandomnessRegister.lfsrWidth === 1) {
                    this.linearFeedbackShift = (0, BitOperations_5.setBit)(this.linearFeedbackShift, 6, xorResult);
                }
            }
        }
        clockLength() {
            if (this.channel4ControlRegister.soundLengthEnable) {
                this.lengthTimer--;
                if (this.lengthTimer === 0) {
                    this.soundOnRegister.isChannel4On = 0;
                }
            }
        }
        clockVolume() {
            const { sweepPace, envelopeDirection } = this.channelVolumeAndEnvelopeRegister;
            if (sweepPace !== 0) {
                if (this.periodTimer !== 0) {
                    this.periodTimer--;
                }
                if (this.periodTimer === 0) {
                    this.periodTimer = sweepPace;
                    if (envelopeDirection === 0 && this.volume > 0) {
                        this.volume--;
                    }
                    else if (envelopeDirection === 1 && this.volume < 0xf) {
                        this.volume++;
                    }
                }
            }
        }
        getSample() {
            const sampleWithVolume = (~this.linearFeedbackShift & 0b1) * this.volume;
            if (this.soundOnRegister.isChannel4On) {
                return (sampleWithVolume / 7.5) - 1;
            }
            else {
                return 0;
            }
        }
        restartSound() {
            this.soundOnRegister.isChannel4On = 1;
            this.frequencyTimer = this.getFrequencyTimer();
            this.linearFeedbackShift = 0b111111111111111;
        }
        getFrequencyTimer() {
            const divisor = this.divisors[this.channelFrequencyAndRandomnessRegister.divisorCode];
            return divisor << this.channelFrequencyAndRandomnessRegister.clockShift;
        }
    }
    exports.Channel4 = Channel4;
});
define("apu/APU", ["require", "exports", "apu/AudioBufferPlayer", "apu/channels/Channel1", "apu/channels/Channel2", "apu/channels/Channel3", "apu/channels/Channel4"], function (require, exports, AudioBufferPlayer_1, Channel1_1, Channel2_2, Channel3_1, Channel4_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.APU = void 0;
    class APU {
        memory;
        channel1;
        channel2;
        channel3;
        channel4;
        // https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
        frameSequencerCyclesPerStep = 8192;
        frameSequencerStep = 0;
        audioContext = new AudioContext({ sampleRate: 44100 });
        cpuUperatingHertz = 4194304;
        cyclesPerSample = this.cpuUperatingHertz / 44100;
        sampleCycles = 0;
        frameSequencerCycles = 0;
        audioBufferPlayer;
        constructor(memory) {
            this.memory = memory;
            this.channel1 = new Channel1_1.Channel1(memory);
            this.channel2 = new Channel2_2.Channel2(memory);
            this.channel3 = new Channel3_1.Channel3(memory);
            this.channel4 = new Channel4_1.Channel4(memory);
            this.audioBufferPlayer = new AudioBufferPlayer_1.AudioBufferPlayer(this.audioContext);
        }
        tick(cycles) {
            this.sampleCycles += cycles;
            this.frameSequencerCycles += cycles;
            this.channel1.tick(cycles);
            this.channel2.tick(cycles);
            this.channel3.tick(cycles);
            this.channel4.tick(cycles);
            if (this.frameSequencerCycles >= this.frameSequencerCyclesPerStep) {
                this.advanceFrameSequencer();
                this.frameSequencerCycles -= this.frameSequencerCyclesPerStep;
            }
            if (this.sampleCycles >= this.cyclesPerSample) {
                this.sampleAudio();
                this.sampleCycles -= this.cyclesPerSample;
            }
        }
        // https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
        // Step   Length Ctr  Vol Env     Sweep
        // ---------------------------------------
        // 0      Clock       -           -
        // 1      -           -           -
        // 2      Clock       -           Clock
        // 3      -           -           -
        // 4      Clock       -           -
        // 5      -           -           -
        // 6      Clock       -           Clock
        // 7      -           Clock       -
        // ---------------------------------------
        // Rate   256 Hz      64 Hz       128 Hz
        advanceFrameSequencer() {
            switch (this.frameSequencerStep) {
                case 0:
                    this.clockLength();
                    break;
                case 2:
                    this.clockLength();
                    this.clockSweep();
                    break;
                case 4:
                    this.clockLength();
                    break;
                case 6:
                    this.clockLength();
                    this.clockSweep();
                    break;
                case 7:
                    this.clockVolume();
                    break;
            }
            this.frameSequencerStep = (this.frameSequencerStep + 1) % 8;
        }
        sampleAudio() {
            const sample = (this.channel1.getSample() + this.channel2.getSample() + this.channel3.getSample() + this.channel4.getSample()) / 4;
            this.audioBufferPlayer.writeSample(sample);
        }
        clockLength() {
            this.channel1.clockLength();
            this.channel2.clockLength();
            this.channel3.clockLength();
            this.channel4.clockLength();
        }
        clockSweep() {
            this.channel1.clockSweep();
        }
        clockVolume() {
            this.channel1.clockVolume();
            this.channel2.clockVolume();
            this.channel4.clockVolume();
        }
    }
    exports.APU = APU;
});
define("cpu/memory_registers/InterruptRequestRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InterruptRequestRegister = void 0;
    class InterruptRequestRegister extends MemoryRegister_18.MemoryRegister {
        constructor(memory) {
            super(0xff0f, memory, "InterruptRequestRegister");
        }
        vBlankInterruptRequest() {
            return this.getBit(0);
        }
        lcdStatInterruptRequest() {
            return this.getBit(1);
        }
        timerInterruptRequest() {
            return this.getBit(2);
        }
        serialInterruptRequest() {
            return this.getBit(3);
        }
        joypadInterruptRequest() {
            return this.getBit(4);
        }
        clearVBlankRequest() {
            this.resetBit(0);
        }
        clearLcdStatRequest() {
            this.resetBit(1);
        }
        clearTimerRequest() {
            this.resetBit(2);
        }
        clearSerialRequest() {
            this.resetBit(3);
        }
        clearJoypadRequest() {
            this.resetBit(4);
        }
        triggerVBlankRequest() {
            this.setBit(0, 1);
        }
        triggerLcdStatRequest() {
            this.setBit(1, 1);
        }
        triggerTimerRequest() {
            this.setBit(2, 1);
        }
        triggerSerialRequest() {
            this.setBit(3, 1);
        }
        triggerJoypadRequest() {
            this.setBit(4, 1);
        }
    }
    exports.InterruptRequestRegister = InterruptRequestRegister;
});
define("gpu/registers/BackgroundPaletteRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BackgroundPaletteRegister = void 0;
    class BackgroundPaletteRegister extends MemoryRegister_19.MemoryRegister {
        constructor(memory) {
            super(0xff47, memory, "BackgroundPaletteRegister");
        }
        get color0() {
            return this.value & 0b11;
        }
        get color1() {
            return (this.value >> 2) & 0b11;
        }
        get color2() {
            return (this.value >> 4) & 0b11;
        }
        get color3() {
            return (this.value >> 6) & 0b11;
        }
        get colors() {
            return [this.color0, this.color1, this.color2, this.color3];
        }
    }
    exports.BackgroundPaletteRegister = BackgroundPaletteRegister;
});
define("gpu/registers/LCDControlRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LCDControlRegister = void 0;
    class LCDControlRegister extends MemoryRegister_20.MemoryRegister {
        constructor(memory) {
            super(0xff40, memory, "LCDControlRegister");
        }
        // GB mode only
        isBackgroundOn() {
            return this.getBit(0) === 1;
        }
        // GBC mode only
        doesBgHavePriority() {
            return this.getBit(0) === 1;
        }
        isObjOn() {
            return this.getBit(1) === 1;
        }
        objSize() {
            return this.getBit(2) === 0 ? 8 : 16;
        }
        bgTileMapArea() {
            return this.getBit(3) === 0 ? 0x9800 : 0x9c00;
        }
        bgAndWindowTileDataArea() {
            return this.getBit(4) === 0 ? 0x8800 : 0x8000;
        }
        isWindowOn() {
            return this.getBit(5) === 1;
        }
        windowTileMapArea() {
            return this.getBit(6) === 0 ? 0x9800 : 0x9c00;
        }
        isLCDControllerOn() {
            return this.getBit(7) === 1;
        }
    }
    exports.LCDControlRegister = LCDControlRegister;
});
define("gpu/registers/ObjectPaletteRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectPaletteRegister = void 0;
    class ObjectPaletteRegister extends MemoryRegister_21.MemoryRegister {
        get color0() {
            return this.value & 0b11;
        }
        get color1() {
            return (this.value >> 2) & 0b11;
        }
        get color2() {
            return (this.value >> 4) & 0b11;
        }
        get color3() {
            return (this.value >> 6) & 0b11;
        }
        get colors() {
            return [this.color0, this.color1, this.color2, this.color3];
        }
    }
    exports.ObjectPaletteRegister = ObjectPaletteRegister;
});
define("gpu/registers/lcd_status/LCDMode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LCDMode = void 0;
    var LCDMode;
    (function (LCDMode) {
        LCDMode[LCDMode["HBlank"] = 0] = "HBlank";
        LCDMode[LCDMode["VBlank"] = 1] = "VBlank";
        LCDMode[LCDMode["SearchingOAM"] = 2] = "SearchingOAM";
        LCDMode[LCDMode["TransferringToLCD"] = 3] = "TransferringToLCD";
    })(LCDMode || (exports.LCDMode = LCDMode = {}));
});
define("gpu/registers/lcd_status/LCDStatusRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LCDStatusRegister = void 0;
    class LCDStatusRegister extends MemoryRegister_22.MemoryRegister {
        constructor(memory) {
            super(0xff41, memory, "LCDStatusRegister");
            this.value = 0x83;
        }
        get mode() {
            return this.value & 0b11;
        }
        set mode(newMode) {
            const bit0 = newMode & 1;
            const bit1 = (newMode >> 1) & 1;
            this.setBit(0, bit0);
            this.setBit(1, bit1);
        }
        isLineYCompareMatching() {
            return this.getBit(2);
        }
        isHBlankInterruptSelected() {
            return this.getBit(3);
        }
        isVBlankInterruptSelected() {
            return this.getBit(4);
        }
        isOamInterruptSelected() {
            return this.getBit(5);
        }
        isLineYMatchingInerruptSelected() {
            return this.getBit(6);
        }
        set lineYCompareMatching(newValue) {
            this.setBit(2, newValue);
        }
    }
    exports.LCDStatusRegister = LCDStatusRegister;
});
define("gpu/registers/GPURegisters", ["require", "exports", "gpu/registers/BackgroundPaletteRegister", "cpu/memory_registers/MemoryRegister", "gpu/registers/LCDControlRegister", "gpu/registers/ObjectPaletteRegister", "gpu/registers/lcd_status/LCDStatusRegister", "gpu/registers/BackgroundPaletteIndexRegister", "gpu/registers/ObjectPaletteIndexRegister"], function (require, exports, BackgroundPaletteRegister_1, MemoryRegister_23, LCDControlRegister_1, ObjectPaletteRegister_1, LCDStatusRegister_1, BackgroundPaletteIndexRegister_2, ObjectPaletteIndexRegister_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GPURegisters = void 0;
    class GPURegisters {
        memory;
        lcdStatusRegister;
        lineYRegister;
        lcdControlRegister;
        scrollYRegister;
        scrollXRegister;
        lineYCompareRegister;
        windowYRegister;
        windowXRegister;
        backgroundPaletteRegister;
        objectPaletteRegister0;
        objectPaletteRegister1;
        backgroundPaletteIndexRegister;
        objectPaletteIndexRegister;
        constructor(memory) {
            this.memory = memory;
            this.lcdStatusRegister = new LCDStatusRegister_1.LCDStatusRegister(memory);
            this.lineYRegister = new MemoryRegister_23.MemoryRegister(0xff44, memory, "lineYRegister");
            this.lcdControlRegister = new LCDControlRegister_1.LCDControlRegister(memory);
            this.scrollYRegister = new MemoryRegister_23.MemoryRegister(0xff42, memory, "scrollYRegister");
            this.scrollXRegister = new MemoryRegister_23.MemoryRegister(0xff43, memory, "scrollXRegister");
            this.lineYCompareRegister = new MemoryRegister_23.MemoryRegister(0xff45, memory, "lineYCompareRegister");
            this.windowYRegister = new MemoryRegister_23.MemoryRegister(0xff4a, memory, "windowYRegister");
            this.windowXRegister = new MemoryRegister_23.MemoryRegister(0xff4b, memory, "windowXRegister");
            this.backgroundPaletteRegister = new BackgroundPaletteRegister_1.BackgroundPaletteRegister(memory);
            this.objectPaletteRegister0 = new ObjectPaletteRegister_1.ObjectPaletteRegister(0xff48, memory, "objetPaletteRegister0");
            this.objectPaletteRegister1 = new ObjectPaletteRegister_1.ObjectPaletteRegister(0xff49, memory, "objectPaletteRegister1");
            this.backgroundPaletteIndexRegister = new BackgroundPaletteIndexRegister_2.BackgroundPaletteIndexRegister(memory);
            this.objectPaletteIndexRegister = new ObjectPaletteIndexRegister_2.ObjectPaletteIndexRegister(memory);
            // default value according to docs
            this.lcdControlRegister.value = 0x83;
            this.lineYRegister.value = 0x91;
        }
    }
    exports.GPURegisters = GPURegisters;
});
define("gpu/registers/OAMTable", ["require", "exports", "misc/BitOperations"], function (require, exports, BitOperations_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OAMEntry = exports.OAMTable = void 0;
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
            return (0, BitOperations_6.getBit)(this.attributeFlags, 4);
        }
        get isXFlipped() {
            return (0, BitOperations_6.getBit)(this.attributeFlags, 5);
        }
        get isYFlipped() {
            return (0, BitOperations_6.getBit)(this.attributeFlags, 6);
        }
        get bgAndWindowOverObj() {
            return (0, BitOperations_6.getBit)(this.attributeFlags, 7);
        }
        get cgbPaletteNumber() {
            return this.attributeFlags & 0b111;
        }
        get tileVramBankNumber() {
            return (0, BitOperations_6.getBit)(this.attributeFlags, 3);
        }
    }
    exports.OAMEntry = OAMEntry;
});
define("gpu/GPU", ["require", "exports", "cpu/Memory", "cpu/memory_registers/InterruptRequestRegister", "misc/BitOperations", "gpu/registers/GPURegisters", "gpu/registers/OAMTable", "gpu/registers/lcd_status/LCDMode"], function (require, exports, Memory_1, InterruptRequestRegister_1, BitOperations_7, GPURegisters_1, OAMTable_1, LCDMode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GPU = void 0;
    // see http://imrannazar.com/GameBoy-Emulation-in-JavaScript:-GPU-Timings
    const CYCLES_IN_HBLANK = 204;
    const CYCLES_IN_OAM = 80;
    const CYCLES_IN_VRAM = 172;
    const CYCLES_PER_SCANLINE = CYCLES_IN_HBLANK + CYCLES_IN_OAM + CYCLES_IN_VRAM;
    const CYCLES_IN_VBLANK = 4560;
    const SCANLINES_PER_FRAME = 144;
    const COLOR_GRAYSCALE = [
        // white
        { red: 255, green: 255, blue: 255 },
        // light grey
        { red: 192, green: 192, blue: 192 },
        // gray
        { red: 96, green: 96, blue: 96 },
        // black
        { red: 0, green: 0, blue: 0 },
    ];
    // const COLOR_INVERTED = [
    //   // black
    //   { red: 0, green: 0, blue: 0 },
    //   // gray
    //   { red: 96, green: 96, blue: 96 },
    //   // light grey
    //   { red: 192, green: 192, blue: 192 },
    //   // white
    //   { red: 255, green: 255, blue: 255 },
    // ]
    // const COLOR_ORIGINAL = [
    //   // lightest green
    //   { red: 155, green: 188, blue: 15 },
    //   // light green
    //   { red: 139, green: 172, blue: 15 },
    //   // green
    //   { red: 48, green: 98, blue: 48 },
    //   // dark green
    //   { red: 15, green: 56, blue: 15 },
    // ]
    class GPU {
        static screenWidth = 160;
        static screenHeight = 144;
        static offscreenHeight = 154;
        static CyclesPerFrame = (CYCLES_PER_SCANLINE * SCANLINES_PER_FRAME) + CYCLES_IN_VBLANK;
        windowPixelsDrawn = [];
        backgroundPixelsDrawn = [];
        backgroundPixelPriorities = [];
        cycles = 0;
        internalWindowLineCounter = 0;
        isGBC = false;
        colors = COLOR_GRAYSCALE;
        memory;
        registers;
        screen = new ImageData(GPU.screenWidth, GPU.screenHeight);
        oamTable;
        constructor(memory) {
            this.memory = memory;
            this.registers = new GPURegisters_1.GPURegisters(memory);
            this.oamTable = new OAMTable_1.OAMTable(memory);
            this.registers.lineYRegister.value = 0x91;
        }
        tick(cycles) {
            const interruptRequestRegister = new InterruptRequestRegister_1.InterruptRequestRegister(this.memory);
            if (!this.registers.lcdControlRegister.isLCDControllerOn()) {
                this.registers.lcdStatusRegister.mode = LCDMode_1.LCDMode.HBlank;
                this.registers.lineYRegister.value = 0x91;
                this.cycles = 0;
                return;
            }
            this.cycles += cycles;
            switch (this.registers.lcdStatusRegister.mode) {
                case LCDMode_1.LCDMode.HBlank:
                    if (this.cycles >= CYCLES_IN_HBLANK) {
                        // do an HDMA transfer if active
                        if (this.isGBC && this.isHDMATransferActive()) {
                            this.memory.doHblankHdmaTransfer();
                        }
                        this.drawLine();
                        this.registers.lineYRegister.value++;
                        if (this.registers.lineYRegister.value === GPU.screenHeight) {
                            this.registers.lcdStatusRegister.mode = LCDMode_1.LCDMode.VBlank;
                            interruptRequestRegister.triggerVBlankRequest();
                        }
                        else {
                            this.registers.lcdStatusRegister.mode = LCDMode_1.LCDMode.SearchingOAM;
                        }
                        this.cycles -= CYCLES_IN_HBLANK;
                    }
                    break;
                case LCDMode_1.LCDMode.VBlank:
                    if (this.cycles >= CYCLES_PER_SCANLINE) {
                        this.registers.lcdStatusRegister.lineYCompareMatching = this.registers.lineYCompareRegister.value === this.registers.lineYRegister.value ? 1 : 0;
                        if (this.registers.lcdStatusRegister.isLineYCompareMatching() && this.registers.lcdStatusRegister.isLineYMatchingInerruptSelected()) {
                            interruptRequestRegister.triggerLcdStatRequest();
                        }
                        this.registers.lineYRegister.value++;
                        if (this.registers.lineYRegister.value === GPU.offscreenHeight) {
                            this.registers.lcdStatusRegister.mode = LCDMode_1.LCDMode.SearchingOAM;
                            this.registers.lineYRegister.value = 0;
                            this.internalWindowLineCounter = 0;
                        }
                        this.cycles -= CYCLES_PER_SCANLINE;
                    }
                    break;
                case LCDMode_1.LCDMode.SearchingOAM:
                    if (this.cycles >= CYCLES_IN_OAM) {
                        this.registers.lcdStatusRegister.mode = LCDMode_1.LCDMode.TransferringToLCD;
                        this.cycles -= CYCLES_IN_OAM;
                    }
                    break;
                case LCDMode_1.LCDMode.TransferringToLCD:
                    if (this.cycles >= CYCLES_IN_VRAM) {
                        const { lcdStatusRegister } = this.registers;
                        if (lcdStatusRegister.isHBlankInterruptSelected() || lcdStatusRegister.isVBlankInterruptSelected() || lcdStatusRegister.isOamInterruptSelected()) {
                            interruptRequestRegister.triggerLcdStatRequest();
                        }
                        this.registers.lcdStatusRegister.lineYCompareMatching = this.registers.lineYCompareRegister.value === this.registers.lineYRegister.value ? 1 : 0;
                        if (this.registers.lcdStatusRegister.isLineYCompareMatching() && this.registers.lcdStatusRegister.isLineYMatchingInerruptSelected()) {
                            interruptRequestRegister.triggerLcdStatRequest();
                        }
                        this.registers.lcdStatusRegister.mode = LCDMode_1.LCDMode.HBlank;
                        this.cycles -= CYCLES_IN_VRAM;
                    }
                    break;
            }
        }
        isHDMATransferActive() {
            const value = this.memory.readByte(0xff55);
            return (0, BitOperations_7.getBit)(value, 7) === 1 && value !== 0xff;
        }
        drawLine() {
            const { lcdControlRegister } = this.registers;
            this.backgroundPixelsDrawn = [];
            this.windowPixelsDrawn = [];
            if (!this.isGBC) {
                // still need to draw a background line (except it's white)
                // if the LCD control is off for the background
                this.drawBackgroundLine();
                if (lcdControlRegister.isWindowOn()) {
                    this.drawWindowLine();
                }
                if (lcdControlRegister.isObjOn()) {
                    this.drawSpriteLine();
                }
            }
            else {
                this.backgroundPixelPriorities = [];
                this.drawBackgroundLineGBC();
                if (lcdControlRegister.isWindowOn()) {
                    this.drawWindowLineGBC();
                }
                if (lcdControlRegister.isObjOn()) {
                    this.drawSpriteLineGBC();
                }
            }
        }
        drawBackgroundLineGBC() {
            const { lineYRegister, lcdControlRegister, scrollXRegister, scrollYRegister, backgroundPaletteIndexRegister } = this.registers;
            const tileDataAddress = lcdControlRegister.bgAndWindowTileDataArea();
            const offset = tileDataAddress === 0x8800 ? 128 : 0;
            const memoryRead = (address) => tileDataAddress === 0x8800 ? this.memory.readSignedByte(address) : this.memory.readByte(address);
            for (let x = 0; x < GPU.screenWidth; x++) {
                const scrolledX = (scrollXRegister.value + x) & 0xff;
                const scrolledY = (scrollYRegister.value + lineYRegister.value) & 0xff;
                const tileMapIndex = (Math.floor(scrolledY / 8) * 32) + Math.floor(scrolledX / 8);
                const xPosInTile = scrolledX % 8;
                let yPosInTile = scrolledY % 8;
                const tileByteIndex = memoryRead(lcdControlRegister.bgTileMapArea() + tileMapIndex) + offset;
                // https://gbdev.io/pandocs/Tile_Maps.html see CGB section for details
                const tileByteAttributes = this.memory.readByte(lcdControlRegister.bgTileMapArea() + tileMapIndex, 1);
                const backgroundPaletteNumber = tileByteAttributes & 0b111;
                const tileVramBankNumber = (0, BitOperations_7.getBit)(tileByteAttributes, 3);
                const xFlip = (0, BitOperations_7.getBit)(tileByteAttributes, 5);
                const yFlip = (0, BitOperations_7.getBit)(tileByteAttributes, 6);
                const bgToOamPriority = (0, BitOperations_7.getBit)(tileByteAttributes, 7);
                const colorsPerPalette = 4;
                const bytesPerColor = 2;
                const backgroundPaletteStartAddress = backgroundPaletteNumber * colorsPerPalette * bytesPerColor;
                const paletteColors = this.getPaletteColors(backgroundPaletteStartAddress, Memory_1.Memory.BgpdRegisterAddress, backgroundPaletteIndexRegister);
                if (yFlip) {
                    yPosInTile = 7 - yPosInTile;
                }
                const tileBytePosition = yPosInTile * 2;
                const tileLineAddress = tileDataAddress + (tileByteIndex * 16) + tileBytePosition;
                const lowerByte = this.memory.readByte(tileLineAddress, tileVramBankNumber);
                const upperByte = this.memory.readByte(tileLineAddress + 1, tileVramBankNumber);
                const bitIndex = xFlip ? xPosInTile : 7 - xPosInTile;
                const lowerBit = (0, BitOperations_7.getBit)(lowerByte, bitIndex);
                const upperBit = (0, BitOperations_7.getBit)(upperByte, bitIndex) << 1;
                const paletteIndex = lowerBit + upperBit;
                const color = paletteColors[paletteIndex];
                this.backgroundPixelsDrawn.push(paletteIndex !== 0);
                this.backgroundPixelPriorities.push(bgToOamPriority);
                this.drawPixel(x, lineYRegister.value, color.red, color.green, color.blue);
            }
        }
        drawWindowLineGBC() {
            const { lineYRegister, lcdControlRegister, windowXRegister, windowYRegister, backgroundPaletteIndexRegister } = this.registers;
            // no need to render anything if we're not at a line where the window starts or window is off screen
            if (lineYRegister.value < windowYRegister.value || windowXRegister.value > GPU.screenWidth + 7) {
                return;
            }
            const windowDataAddress = lcdControlRegister.bgAndWindowTileDataArea();
            const memoryRead = (address) => windowDataAddress === 0x8800 ? this.memory.readSignedByte(address) : this.memory.readByte(address);
            let x = 0;
            // per gameboy docs, windowXRegister value always starts at 7, so we want to adjust for that
            let adjustedWindowX = windowXRegister.value - 7;
            const offset = windowDataAddress === 0x8800 ? 128 : 0;
            const tileMapAddress = lcdControlRegister.windowTileMapArea();
            const yPos = this.internalWindowLineCounter;
            while (x < GPU.screenWidth) {
                // this.memory.vramBank = 0
                if (x < adjustedWindowX) {
                    this.windowPixelsDrawn.push(false);
                    x++;
                    continue;
                }
                const xPos = x - adjustedWindowX;
                const tileMapIndex = (Math.floor(xPos / 8)) + (Math.floor(yPos / 8) * 32);
                const tileByteIndex = memoryRead(tileMapAddress + tileMapIndex) + offset;
                // this.memory.vramBank = 1
                const tileByteAttributes = this.memory.readByte(tileMapAddress + tileMapIndex, 1);
                const backgroundPaletteNumber = tileByteAttributes & 0b111;
                const tileVramBankNumber = (0, BitOperations_7.getBit)(tileByteAttributes, 3);
                const xFlip = (0, BitOperations_7.getBit)(tileByteAttributes, 5);
                const yFlip = (0, BitOperations_7.getBit)(tileByteAttributes, 6);
                const bgToOamPriority = (0, BitOperations_7.getBit)(tileByteAttributes, 7);
                let yPosInTile = yPos % 8;
                if (yFlip) {
                    yPosInTile = 7 - yPosInTile;
                }
                // 2 bytes are needed to represent one line in a tile
                const tileBytePosition = yPosInTile * 2;
                const colorsPerPalette = 4;
                const bytesPerColor = 2;
                const backgroundPaletteStartAddress = backgroundPaletteNumber * colorsPerPalette * bytesPerColor;
                const paletteColors = this.getPaletteColors(backgroundPaletteStartAddress, Memory_1.Memory.BgpdRegisterAddress, backgroundPaletteIndexRegister);
                // 2 bytes are needed to represent one line in a tile, 8 lines total means 16 bytes to represent one tile.
                const tileLineAddress = windowDataAddress + (tileByteIndex * 16) + tileBytePosition;
                // this.memory.vramBank = tileVramBankNumber
                const lowerByte = this.memory.readByte(tileLineAddress, tileVramBankNumber);
                const upperByte = this.memory.readByte(tileLineAddress + 1, tileVramBankNumber);
                for (let i = 7; i >= 0; i--) {
                    const bitPos = xFlip ? 7 - i : i;
                    const lowerBit = (0, BitOperations_7.getBit)(lowerByte, bitPos);
                    const upperBit = (0, BitOperations_7.getBit)(upperByte, bitPos) << 1;
                    const paletteIndex = lowerBit + upperBit;
                    const color = paletteColors[paletteIndex];
                    this.windowPixelsDrawn.push(paletteIndex !== 0);
                    this.backgroundPixelPriorities[x] = bgToOamPriority;
                    this.drawPixel(x, lineYRegister.value, color.red, color.green, color.blue);
                    x++;
                }
            }
            this.internalWindowLineCounter++;
        }
        getPaletteColors(paletteStartAddress, pdAddress, register) {
            const paletteColors = [];
            let i = 0;
            while (paletteColors.length < 4) {
                register.paletteAddress = paletteStartAddress + i;
                const lowerByte = this.memory.readByte(pdAddress);
                i++;
                register.paletteAddress = paletteStartAddress + i;
                const upperByte = this.memory.readByte(pdAddress);
                // get the RGB values from the upper and lower bytes
                // example:
                // 11001111 -> lower byte
                // 11101011 -> upper byte
                // r would be 01111
                // g would be 11110
                // b would be 11101
                let red = lowerByte & 0b11111;
                let green = (lowerByte >> 5) + ((upperByte & 0b11) << 3);
                let blue = (upperByte >> 2) & 0b11111;
                // this converts from rgb555 to rgb888, which html uses
                red = (red << 3) | (red >> 2);
                green = (green << 3) | (green >> 2);
                blue = (blue << 3) | (blue >> 2);
                paletteColors.push({ red, green, blue });
                i++;
            }
            return paletteColors;
        }
        drawSpriteLineGBC() {
            const { lineYRegister, lcdControlRegister, objectPaletteIndexRegister } = this.registers;
            const tileMapStartAddress = 0x8000;
            const maxNumberSprites = 10;
            let numSprites = 0;
            const spritePixelsDrawn = [];
            for (const sprite of this.oamTable.entries) {
                // this.memory.vramBank = 0
                if (numSprites === maxNumberSprites) {
                    break;
                }
                const yPos = sprite.yPosition - 16;
                const xPos = sprite.xPosition - 8;
                let yPosInTile = lineYRegister.value - yPos;
                if (sprite.isYFlipped) {
                    yPosInTile = lcdControlRegister.objSize() - 1 - yPosInTile;
                }
                if (yPosInTile < 0 || yPosInTile >= lcdControlRegister.objSize()) {
                    continue;
                }
                const tileIndex = lcdControlRegister.objSize() === 16 ? (0, BitOperations_7.resetBit)(sprite.tileIndex, 0) : sprite.tileIndex;
                const tileBytePosition = tileIndex * 16;
                const tileYBytePosition = yPosInTile * 2;
                const tileAddress = tileBytePosition + tileYBytePosition + tileMapStartAddress;
                const spritePaletteNumber = sprite.cgbPaletteNumber;
                const colorsPerPalette = 4;
                const bytesPerColor = 2;
                const spritePaletteStartAddress = spritePaletteNumber * colorsPerPalette * bytesPerColor;
                const paletteColors = this.getPaletteColors(spritePaletteStartAddress, Memory_1.Memory.ObpdRegisterAddress, objectPaletteIndexRegister);
                // this.memory.vramBank = sprite.tileVramBankNumber
                const lowerByte = this.memory.readByte(tileAddress, sprite.tileVramBankNumber);
                const upperByte = this.memory.readByte(tileAddress + 1, sprite.tileVramBankNumber);
                for (let i = 0; i < 8; i++) {
                    const bitPos = sprite.isXFlipped ? i : 7 - i;
                    const lowerBit = (0, BitOperations_7.getBit)(lowerByte, bitPos);
                    const upperBit = (0, BitOperations_7.getBit)(upperByte, bitPos) << 1;
                    const paletteIndex = lowerBit + upperBit;
                    // paletteIndex 0 is always transparent; ignore any pixels that are off screen
                    // otherwise they will wrap around to the right side of the screen
                    if (paletteIndex === 0 || (xPos + i) < 0) {
                        continue;
                    }
                    const color = paletteColors[paletteIndex];
                    const backgroundVisible = this.backgroundPixelsDrawn[xPos + i];
                    const windowVisible = this.windowPixelsDrawn[xPos + i];
                    const isPixelBehindBackground = !this.spriteHasPriority(sprite, this.backgroundPixelPriorities[xPos + i]) && (windowVisible || backgroundVisible);
                    if (!(isPixelBehindBackground) && !spritePixelsDrawn[xPos + i]) {
                        spritePixelsDrawn[xPos + i] = true;
                        this.drawPixel(xPos + i, lineYRegister.value, color.red, color.green, color.blue);
                    }
                }
                numSprites++;
            }
        }
        drawSpriteLine() {
            const { lineYRegister, lcdControlRegister } = this.registers;
            const tileMapStartAddress = 0x8000;
            const sortedSprites = this.oamTable.entries
                .filter((sprite) => {
                const yPos = sprite.yPosition - 16;
                if (sprite.xPosition === 0 || sprite.yPosition === 0 || sprite.xPosition > GPU.screenWidth + 8 || sprite.yPosition > GPU.screenHeight + 16) {
                    return false;
                }
                let yPosInTile = lineYRegister.value - yPos;
                if (sprite.isYFlipped) {
                    yPosInTile = lcdControlRegister.objSize() - 1 - yPosInTile;
                }
                return yPosInTile >= 0 && yPosInTile < lcdControlRegister.objSize();
            })
                .slice(0, 10) // per docs https://gbdev.io/pandocs/OAM.html, only 10 sprites can be visible per scan line
                .reverse() // this is to get any elements with the same xPosition as others to the beginning of the array, so we can prioritize it when sorting
                .sort((a, b) => b.xPosition - a.xPosition);
            for (const sprite of sortedSprites) {
                // per the docs above, sprite.xPoition is the actual position + 16, sprite.yPosition is the actual position + 8
                // so to get the actual position, subtract either 16 or 8
                const yPos = sprite.yPosition - 16;
                const xPos = sprite.xPosition - 8;
                let yPosInTile = lineYRegister.value - yPos;
                if (sprite.isYFlipped) {
                    yPosInTile = lcdControlRegister.objSize() - 1 - yPosInTile;
                }
                // 8x16 tiles do not use the first bit of the tile index, per the docs
                const tileIndex = lcdControlRegister.objSize() === 16 ? (0, BitOperations_7.resetBit)(sprite.tileIndex, 0) : sprite.tileIndex;
                const tileBytePosition = tileIndex * 16;
                const tileYBytePosition = yPosInTile * 2;
                const tileAddress = tileBytePosition + tileYBytePosition + tileMapStartAddress;
                const lowerByte = this.memory.readByte(tileAddress);
                const upperByte = this.memory.readByte(tileAddress + 1);
                const paletteColors = sprite.paletteNumber === 0 ? this.registers.objectPaletteRegister0.colors : this.registers.objectPaletteRegister1.colors;
                for (let i = 0; i < 8; i++) {
                    const bitPos = sprite.isXFlipped ? i : 7 - i;
                    const lowerBit = (0, BitOperations_7.getBit)(lowerByte, bitPos);
                    const upperBit = (0, BitOperations_7.getBit)(upperByte, bitPos) << 1;
                    const paletteIndex = lowerBit + upperBit;
                    // paletteIndex 0 is always transparent; ignore any pixels that are off screen
                    // otherwise they will wrap around to the right side of the screen
                    if (paletteIndex === 0 || (xPos + i) < 0) {
                        continue;
                    }
                    const colorIndex = paletteColors[paletteIndex];
                    const color = this.colors[colorIndex];
                    const backgroundVisible = this.backgroundPixelsDrawn[xPos + i];
                    const windowVisible = this.windowPixelsDrawn[xPos + i];
                    if (!(sprite.bgAndWindowOverObj && (windowVisible || backgroundVisible))) {
                        this.drawPixel(xPos + i, lineYRegister.value, color.red, color.green, color.blue);
                    }
                }
            }
        }
        drawBackgroundLine() {
            const { lineYRegister, lcdControlRegister, scrollXRegister, scrollYRegister } = this.registers;
            const tileDataAddress = lcdControlRegister.bgAndWindowTileDataArea();
            const offset = tileDataAddress === 0x8800 ? 128 : 0;
            const memoryRead = (address) => tileDataAddress === 0x8800 ? this.memory.readSignedByte(address) : this.memory.readByte(address);
            const paletteColors = this.registers.backgroundPaletteRegister.colors;
            for (let x = 0; x < GPU.screenWidth; x++) {
                if (!lcdControlRegister.isBackgroundOn()) {
                    const colorIndex = paletteColors[0];
                    const color = this.colors[colorIndex];
                    this.drawPixel(x, lineYRegister.value, color.red, color.green, color.blue);
                }
                else {
                    const scrolledX = (scrollXRegister.value + x) & 0xff;
                    const scrolledY = (scrollYRegister.value + lineYRegister.value) & 0xff;
                    const tileMapIndex = (Math.floor(scrolledY / 8) * 32 + Math.floor(scrolledX / 8));
                    const yPosInTile = scrolledY % 8;
                    const xPosInTile = scrolledX % 8;
                    const tileBytePosition = yPosInTile * 2;
                    // we need to multiply by 16 since it takes 16 bytes to represent one tile.
                    // you need two bytes to represent one row of a tile. 16 bytes total for all 8 rows.
                    const tileByteIndex = memoryRead(lcdControlRegister.bgTileMapArea() + tileMapIndex) + offset;
                    const tileLineAddress = tileDataAddress + (tileByteIndex * 16) + tileBytePosition;
                    const lowerByte = this.memory.readByte(tileLineAddress);
                    const upperByte = this.memory.readByte(tileLineAddress + 1);
                    const bitIndex = 7 - xPosInTile;
                    const lowerBit = (0, BitOperations_7.getBit)(lowerByte, bitIndex);
                    const upperBit = (0, BitOperations_7.getBit)(upperByte, bitIndex) << 1;
                    const paletteIndex = lowerBit + upperBit;
                    const colorIndex = paletteColors[paletteIndex];
                    const color = this.colors[colorIndex];
                    this.backgroundPixelsDrawn.push(paletteIndex !== 0);
                    this.drawPixel(x, lineYRegister.value, color.red, color.green, color.blue);
                }
            }
        }
        drawWindowLine() {
            const { lineYRegister, lcdControlRegister, windowXRegister, windowYRegister } = this.registers;
            // no need to render anything if we're not at a line where the window starts or window is off screen
            if (lineYRegister.value < windowYRegister.value || windowXRegister.value > GPU.screenWidth + 7) {
                return;
            }
            const windowDataAddress = lcdControlRegister.bgAndWindowTileDataArea();
            const memoryRead = (address) => windowDataAddress === 0x8800 ? this.memory.readSignedByte(address) : this.memory.readByte(address);
            const paletteColors = this.registers.backgroundPaletteRegister.colors;
            let x = 0;
            // per gameboy docs, windowXRegister value always starts at 7, so we want to adjust for that
            let adjustedWindowX = windowXRegister.value - 7;
            const offset = windowDataAddress === 0x8800 ? 128 : 0;
            const tileMapAddress = lcdControlRegister.windowTileMapArea();
            const yPos = this.internalWindowLineCounter;
            while (x < GPU.screenWidth) {
                if (x < adjustedWindowX) {
                    this.windowPixelsDrawn.push(false);
                    x++;
                    continue;
                }
                const xPos = x - adjustedWindowX;
                const tileMapIndex = (Math.floor(xPos / 8)) + (Math.floor(yPos / 8) * 32);
                const yPosInTile = yPos % 8;
                // 2 bytes are needed to represent one line in a tile
                const tileBytePosition = yPosInTile * 2;
                const tileByteIndex = memoryRead(tileMapAddress + tileMapIndex) + offset;
                // 2 bytes are needed to represent one line in a tile, 8 lines total means 16 bytes to represent one tile.
                const tileLineAddress = windowDataAddress + (tileByteIndex * 16) + tileBytePosition;
                const lowerByte = this.memory.readByte(tileLineAddress);
                const upperByte = this.memory.readByte(tileLineAddress + 1);
                for (let i = 7; i >= 0; i--) {
                    const lowerBit = (0, BitOperations_7.getBit)(lowerByte, i);
                    const upperBit = (0, BitOperations_7.getBit)(upperByte, i) << 1;
                    const paletteIndex = lowerBit + upperBit;
                    const colorIndex = paletteColors[paletteIndex];
                    const color = this.colors[colorIndex];
                    this.windowPixelsDrawn.push(paletteIndex !== 0);
                    this.drawPixel(x, lineYRegister.value, color.red, color.green, color.blue);
                    x++;
                }
            }
            this.internalWindowLineCounter++;
        }
        spriteHasPriority(sprite, bgToOamPriority) {
            const { bgAndWindowOverObj } = sprite;
            const { lcdControlRegister } = this.registers;
            if (!lcdControlRegister.doesBgHavePriority() || (!bgAndWindowOverObj && !bgToOamPriority)) {
                return true;
            }
            return false;
        }
        drawPixel(x, y, r, g, b, alpha = 0xff) {
            const pos = (x * 4) + (y * this.screen.width * 4);
            this.screen.data[pos] = r;
            this.screen.data[pos + 1] = g;
            this.screen.data[pos + 2] = b;
            this.screen.data[pos + 3] = alpha;
        }
    }
    exports.GPU = GPU;
});
define("cpu/memory_registers/InterruptEnableRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InterruptEnableRegister = void 0;
    class InterruptEnableRegister extends MemoryRegister_24.MemoryRegister {
        constructor(memory) {
            super(0xffff, memory, "InterruptEnableRegister");
        }
        isVBlankInterruptEnabled() {
            return this.getBit(0);
        }
        isLCDStatInterruptEnabled() {
            return this.getBit(1);
        }
        isTimerInterruptEnabled() {
            return this.getBit(2);
        }
        isSerialInterruptEnabled() {
            return this.getBit(3);
        }
        isJoypadInterruptEnabled() {
            return this.getBit(4);
        }
    }
    exports.InterruptEnableRegister = InterruptEnableRegister;
});
define("cpu/CPURegister", ["require", "exports"], function (require, exports) {
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
});
define("cpu/CPUFlagRegister", ["require", "exports", "cpu/CPURegister"], function (require, exports, CPURegister_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlagsRegister = void 0;
    const ZERO_FLAG_BYTE_POSITION = 7;
    const SUBTRACT_FLAG_BYTE_POSITION = 6;
    const HALF_CARRY_FLAG_BYTE_POSITION = 5;
    const CARRY_FLAG_BYTE_POSITION = 4;
    class FlagsRegister extends CPURegister_1.CPURegister {
        get zero() {
            return ((this.value >> ZERO_FLAG_BYTE_POSITION) & 1) === 1;
        }
        get subtract() {
            return ((this.value >> SUBTRACT_FLAG_BYTE_POSITION) & 1) === 1;
        }
        get halfCarry() {
            return ((this.value >> HALF_CARRY_FLAG_BYTE_POSITION) & 1) === 1;
        }
        get carry() {
            return ((this.value >> CARRY_FLAG_BYTE_POSITION) & 1) === 1;
        }
        set zero(val) {
            if (val) {
                this.value |= 1 << ZERO_FLAG_BYTE_POSITION;
            }
            else {
                this.value &= ~(1 << ZERO_FLAG_BYTE_POSITION);
            }
        }
        set subtract(val) {
            if (val) {
                this.value |= 1 << SUBTRACT_FLAG_BYTE_POSITION;
            }
            else {
                this.value &= ~(1 << SUBTRACT_FLAG_BYTE_POSITION);
            }
        }
        set halfCarry(val) {
            if (val) {
                this.value |= 1 << HALF_CARRY_FLAG_BYTE_POSITION;
            }
            else {
                this.value &= ~(1 << HALF_CARRY_FLAG_BYTE_POSITION);
            }
        }
        set carry(val) {
            if (val) {
                this.value |= 1 << CARRY_FLAG_BYTE_POSITION;
            }
            else {
                this.value &= ~(1 << CARRY_FLAG_BYTE_POSITION);
            }
        }
    }
    exports.FlagsRegister = FlagsRegister;
});
define("cpu/FlagsRegisterPair", ["require", "exports", "cpu/CPURegister"], function (require, exports, CPURegister_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlagsRegisterPair = void 0;
    class FlagsRegisterPair extends CPURegister_2.CPURegister {
        set value(newVal) {
            // clear the first four bits after setting the new value, they're never used in F
            const clearBits = 0b1111111111110000;
            this.dataView.setUint16(this.registerId, newVal & clearBits, true);
        }
        get value() {
            return this.dataView.getUint16(this.registerId, true);
        }
        get hexValue() {
            return `0x${this.value.toString(16)}`;
        }
    }
    exports.FlagsRegisterPair = FlagsRegisterPair;
});
define("cpu/memory_registers/TimerControlRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimerControlRegister = void 0;
    class TimerControlRegister extends MemoryRegister_25.MemoryRegister {
        constructor(memory) {
            super(0xff07, memory);
        }
        isTimerEnabled() {
            return this.getBit(2);
        }
        getClockFrequency() {
            const mode = this.value & 0b11; // check the first two bits
            let clockMode = 0;
            switch (mode) {
                case 0:
                    clockMode = 1024;
                    break;
                case 1:
                    clockMode = 16;
                    break;
                case 2:
                    clockMode = 64;
                    break;
                case 3:
                    clockMode = 256;
                    break;
            }
            return clockMode;
        }
    }
    exports.TimerControlRegister = TimerControlRegister;
});
define("cpu/memory_registers/DividerRegister", ["require", "exports", "cpu/memory_registers/MemoryRegister"], function (require, exports, MemoryRegister_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DividerRegister = void 0;
    class DividerRegister extends MemoryRegister_26.MemoryRegister {
        constructor(memory) {
            super(0xff04, memory);
        }
        set overrideValue(newVal) {
            this.memory.writeByte(this.address, newVal, 'DividerRegister', true);
        }
    }
    exports.DividerRegister = DividerRegister;
});
define("cpu/CPURegisters", ["require", "exports", "cpu/memory_registers/InterruptEnableRegister", "cpu/memory_registers/InterruptRequestRegister", "cpu/CPURegister", "cpu/CPUFlagRegister", "cpu/FlagsRegisterPair", "cpu/memory_registers/MemoryRegister", "cpu/memory_registers/TimerControlRegister", "cpu/memory_registers/DividerRegister"], function (require, exports, InterruptEnableRegister_1, InterruptRequestRegister_2, CPURegister_3, CPUFlagRegister_1, FlagsRegisterPair_1, MemoryRegister_27, TimerControlRegister_1, DividerRegister_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CPURegisters = void 0;
    class CPURegisters {
        A;
        B;
        C;
        D;
        E;
        F;
        H;
        L;
        AF;
        BC;
        DE;
        HL;
        SP;
        PC;
        interruptEnableRegister;
        interruptRequestRegister;
        dividerRegister;
        timerCounterRegister;
        timerModuloRegister;
        timerControlRegister;
        memory;
        registerDataView;
        cpu;
        constructor(memory, cpu) {
            this.cpu = cpu;
            this.registerDataView = new DataView(new ArrayBuffer(12));
            this.A = new CPURegister_3.CPURegister("A", 0, 1, this.registerDataView, false);
            this.B = new CPURegister_3.CPURegister("B", 0, 3, this.registerDataView, false);
            this.C = new CPURegister_3.CPURegister("C", 0, 2, this.registerDataView, false);
            this.D = new CPURegister_3.CPURegister("D", 0, 5, this.registerDataView, false);
            this.E = new CPURegister_3.CPURegister("E", 0, 4, this.registerDataView, false);
            this.F = new CPUFlagRegister_1.FlagsRegister("F", 0, 0, this.registerDataView, false);
            this.H = new CPURegister_3.CPURegister("H", 0, 7, this.registerDataView, false);
            this.L = new CPURegister_3.CPURegister("L", 0, 6, this.registerDataView, false);
            // see http://bgb.bircd.org/pandocs.htm#powerupsequence for info on initial register values
            this.AF = new FlagsRegisterPair_1.FlagsRegisterPair("AF", 0x11b0, 0, this.registerDataView, true);
            this.BC = new CPURegister_3.CPURegister("BC", 0x13, 2, this.registerDataView, true);
            this.DE = new CPURegister_3.CPURegister("DE", 0xd8, 4, this.registerDataView, true);
            this.HL = new CPURegister_3.CPURegister("HL", 0x14d, 6, this.registerDataView, true);
            // stack pointer starts at the top of the stack memory, which is at 0xfffe
            this.SP = new CPURegister_3.CPURegister("SP", 0xfffe, 8, this.registerDataView, true);
            // first 255 (0xFF) instructions in memory are reserved for the gameboy
            this.PC = new CPURegister_3.CPURegister("PC", 0x100, 10, this.registerDataView, true);
            this.memory = memory;
            // memory registers
            this.interruptEnableRegister = new InterruptEnableRegister_1.InterruptEnableRegister(memory);
            this.interruptRequestRegister = new InterruptRequestRegister_2.InterruptRequestRegister(memory);
            this.dividerRegister = new DividerRegister_1.DividerRegister(memory);
            this.timerCounterRegister = new MemoryRegister_27.MemoryRegister(0xff05, memory);
            this.timerModuloRegister = new MemoryRegister_27.MemoryRegister(0xff06, memory);
            this.timerControlRegister = new TimerControlRegister_1.TimerControlRegister(memory);
        }
        initialize() {
            this.AF.value = 0x1180;
            this.BC.value = 0x0;
            this.DE.value = 0xff56;
            this.HL.value = 0xd;
            this.SP.value = 0xfffe;
            this.PC.value = 0x100;
        }
        add(target, source) {
            target.value = this._add(target.value, source.value);
        }
        _add(a, b) {
            const newValue = (a + b) & 0xff;
            this.F.subtract = false;
            this.F.zero = newValue === 0;
            this.F.halfCarry = (newValue & 0x0f) < (a & 0x0f);
            this.F.carry = newValue < a;
            return newValue;
        }
        _subtract(a, b) {
            const newValue = (a - b) & 0xff;
            this.F.subtract = true;
            this.F.zero = newValue === 0;
            this.F.halfCarry = (newValue & 0x0f) > (a & 0x0f);
            this.F.carry = newValue > a;
            return newValue;
        }
        addImmediate(target) {
            const value = this.memory.readByte(this.PC.value);
            this.PC.value++;
            target.value = this._add(target.value, value);
        }
        addImmediateSigned(target) {
            if (!target.is16Bit) {
                throw new Error(`invalid register selected: ${target.name}. Must be a 16 bit register`);
            }
            const signedByte = this.memory.readSignedByte(this.PC.value);
            this.PC.value++;
            const distanceFromWrappingBit3 = 0xf - (this.SP.value & 0x000f);
            const distanceFromWrappingBit7 = 0xff - (this.SP.value & 0x00ff);
            this.F.carry = (signedByte & 0xff) > distanceFromWrappingBit7;
            this.F.halfCarry = (signedByte & 0x0f) > distanceFromWrappingBit3;
            this.F.zero = false;
            this.F.subtract = false;
            this.SP.value += signedByte;
        }
        addFromRegisterAddr(target, source) {
            const value = this.memory.readByte(source.value);
            target.value = this._add(target.value, value);
        }
        _addWithCarry(a, b) {
            const carry = this.F.carry ? 1 : 0;
            const result = (a + b + carry) & 0xff;
            this.F.carry = a + b + carry > 0xff;
            this.F.subtract = false;
            this.F.halfCarry = ((a & 0x0f) + (b & 0x0f) + carry) > 0x0f;
            this.F.zero = result === 0;
            return result;
        }
        addWithCarry(source) {
            this.A.value = this._addWithCarry(this.A.value, source.value);
        }
        addWithCarryImmediate() {
            this.A.value = this._addWithCarry(this.A.value, this.memory.readByte(this.PC.value));
            this.PC.value++;
        }
        loadHLStackPointer() {
            const toAdd = this.memory.readSignedByte(this.PC.value);
            this.PC.value++;
            const distanceFromWrappingBit3 = 0xf - (this.SP.value & 0x000f);
            const distanceFromWrappingBit7 = 0xff - (this.SP.value & 0x00ff);
            this.F.halfCarry = (toAdd & 0x0f) > distanceFromWrappingBit3;
            this.F.carry = (toAdd & 0xff) > distanceFromWrappingBit7;
            this.F.zero = false;
            this.F.subtract = false;
            this.HL.value = this.SP.value + toAdd;
        }
        addWithCarryFromMemory(source) {
            const value = this.memory.readByte(source.value);
            this.A.value = this._addWithCarry(this.A.value, value);
        }
        complementCarryFlag() {
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.F.carry = !this.F.carry;
        }
        setCarryFlag() {
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.F.carry = true;
        }
        readByte(target) {
            target.value = this.memory.readByte(this.PC.value);
            this.PC.value++;
        }
        loadFromBase(target) {
            this.cpu.cycle(4);
            const baseAddress = this.memory.readByte(this.PC.value);
            this.PC.value++;
            target.value = this.memory.readByte(0xff00 + baseAddress);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        loadFrom16bitAddr(target) {
            this.cpu.cycle(4);
            this.cpu.cycle(4);
            const memoryAddress = this.memory.readWord(this.PC.value);
            this.PC.value += 2;
            target.value = this.memory.readByte(memoryAddress);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        loadByte(target, source) {
            if (!source.is16Bit) {
                throw new Error(`Register is not 16 bit: ${source.name}`);
            }
            target.value = this.memory.readByte(source.value);
        }
        loadByte8Bit(target, source) {
            if (source.is16Bit) {
                throw new Error(`Register is not 8 bit: ${source.name}`);
            }
            target.value = this.memory.readByte(0xff00 + source.value);
        }
        loadByteAndIncrementSource(target, source) {
            target.value = this.memory.readByte(source.value);
            source.value++;
        }
        loadByteAndDecrementSource(target, source) {
            target.value = this.memory.readByte(source.value);
            source.value--;
        }
        loadWord(target) {
            if (target.is16Bit) {
                target.value = this.memory.readWord(this.PC.value);
                this.PC.value += 2;
            }
            else {
                throw new Error(`invalid register selected: ${target.name}. must be a 16 bit register.`);
            }
        }
        jump() {
            this.PC.value = this.memory.readWord(this.PC.value);
        }
        jumpToRegisterAddr() {
            this.PC.value = this.HL.value;
        }
        jumpIfNotZero() {
            if (!this.F.zero) {
                this.PC.value = this.memory.readWord(this.PC.value);
            }
            else {
                this.PC.value += 2;
            }
        }
        jumpIfZero() {
            if (this.F.zero) {
                this.PC.value = this.memory.readWord(this.PC.value);
            }
            else {
                this.PC.value += 2;
            }
        }
        jumpIfNotCarry() {
            if (!this.F.carry) {
                this.PC.value = this.memory.readWord(this.PC.value);
            }
            else {
                this.PC.value += 2;
            }
        }
        jumpIfCarry() {
            if (this.F.carry) {
                this.PC.value = this.memory.readWord(this.PC.value);
            }
            else {
                this.PC.value += 2;
            }
        }
        relativeJump() {
            const jumpDistance = this.memory.readSignedByte(this.PC.value);
            this.PC.value++;
            this.PC.value += jumpDistance;
        }
        relativeJumpIfZero() {
            if (this.F.zero) {
                const jumpDistance = this.memory.readSignedByte(this.PC.value);
                this.PC.value++;
                this.PC.value += jumpDistance;
            }
            else {
                this.PC.value++;
            }
        }
        relativeJumpIfNotZero() {
            if (!this.F.zero) {
                const jumpDistance = this.memory.readSignedByte(this.PC.value);
                this.PC.value++;
                this.PC.value += jumpDistance;
            }
            else {
                this.PC.value++;
            }
        }
        relativeJumpIfCarry() {
            if (this.F.carry) {
                const jumpDistance = this.memory.readSignedByte(this.PC.value);
                this.PC.value++;
                this.PC.value += jumpDistance;
            }
            else {
                this.PC.value++;
            }
        }
        relativeJumpIfNotCarry() {
            if (!this.F.carry) {
                const jumpDistance = this.memory.readSignedByte(this.PC.value);
                this.PC.value++;
                this.PC.value += jumpDistance;
            }
            else {
                this.PC.value++;
            }
        }
        writeToMemory8Bit(source) {
            this.cpu.cycle(4);
            const baseAddress = this.memory.readByte(this.PC.value);
            this.PC.value++;
            this.memory.writeByte(0xff00 + baseAddress, source.value, "writeToMemory8Bit");
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        writeToMemory16bit(source) {
            this.cpu.cycle(4);
            this.cpu.cycle(4);
            const memoryAddress = this.memory.readWord(this.PC.value);
            this.PC.value += 2;
            this.memory.writeByte(memoryAddress, source.value, "writeToMemory16bit");
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        writeStackPointerToMemory() {
            const memoryAddress = this.memory.readWord(this.PC.value);
            this.PC.value += 2;
            this.memory.writeWord(memoryAddress, this.SP.value);
        }
        writeToMemoryRegisterAddr(target, source) {
            if (target.is16Bit) {
                this.memory.writeByte(target.value, source.value, "writeToMemoryRegisterAddr");
            }
            else {
                throw new Error(`invalid register selected: ${target.name}; need a 16 bit register.`);
            }
        }
        writeToMemoryRegisterAddr8bit(target, source) {
            if (!target.is16Bit) {
                this.memory.writeByte(0xff00 + target.value, source.value, "writeToMemoryRegisterAddr8Bit");
            }
            else {
                throw new Error(`invalid register selected: ${target.name} need an 8 bit register.`);
            }
        }
        writeByteIntoRegisterAddress(target) {
            if (target.is16Bit) {
                this.cpu.cycle(4);
                this.memory.writeByte(target.value, this.memory.readByte(this.PC.value), "writeByteIntoRegisterAddr");
                this.PC.value++;
                this.cpu.cycle(4);
                this.cpu.cycle(4);
            }
            else {
                throw new Error(`invalid register selected: ${target.name}; need a 16 bit register.`);
            }
        }
        subtract(source) {
            this.A.value = this._subtract(this.A.value, source.value);
        }
        subtractImmediate() {
            this.A.value = this._subtract(this.A.value, this.memory.readByte(this.PC.value));
            this.PC.value++;
        }
        _subtractWithCarry(a, b) {
            const carry = this.F.carry ? 1 : 0;
            const result = (a - b - carry) & 0xff;
            this.F.subtract = true;
            this.F.carry = a - b - carry < 0;
            this.F.halfCarry = (a & 0xf) - (b & 0xf) - carry < 0;
            this.F.zero = result === 0;
            return result;
        }
        subtractWithCarry(source) {
            this.A.value = this._subtractWithCarry(this.A.value, source.value);
        }
        subtractWithCarryFromMemory(source) {
            const value = this.memory.readByte(source.value);
            this.A.value = this._subtractWithCarry(this.A.value, value);
        }
        subtractWithCarryImmediate() {
            const value = this.memory.readByte(this.PC.value);
            this.PC.value++;
            this.A.value = this._subtractWithCarry(this.A.value, value);
        }
        compare(source) {
            // do subtract operation but don't store the value. the flags changing are what's important
            this._subtract(this.A.value, source.value);
        }
        compareImmediate() {
            this._subtract(this.A.value, this.memory.readByte(this.PC.value));
            this.PC.value++;
        }
        compareFromRegisterAddr(source) {
            const compareTo = this.memory.readByte(source.value);
            this._subtract(this.A.value, compareTo);
        }
        subtractFromMemory(source) {
            const value = this.memory.readByte(source.value);
            this.A.value = this._subtract(this.A.value, value);
        }
        load(target, source) {
            target.value = source.value;
        }
        _or(a, b) {
            const newValue = (a | b) & 0xff;
            this.F.carry = false;
            this.F.zero = newValue === 0;
            this.F.halfCarry = false;
            this.F.subtract = false;
            return newValue;
        }
        or(source) {
            this.A.value = this._or(this.A.value, source.value);
        }
        orFromMemory(source) {
            this.A.value = this._or(this.A.value, this.memory.readByte(source.value));
        }
        orImmediate() {
            this.A.value = this._or(this.A.value, this.memory.readByte(this.PC.value));
            this.PC.value++;
        }
        _and(a, b) {
            const returnVal = (a & b) & 0xff;
            this.F.carry = false;
            this.F.halfCarry = true;
            this.F.subtract = false;
            this.F.zero = returnVal === 0;
            return returnVal;
        }
        and(source) {
            this.A.value = this._and(this.A.value, source.value);
        }
        andFromMemory(source) {
            this.A.value = this._and(this.A.value, this.memory.readByte(source.value));
        }
        andImmediate() {
            this.A.value = this._and(this.A.value, this.memory.readByte(this.PC.value));
            this.PC.value++;
        }
        _xor(a, b) {
            const returnVal = (a ^ b) & 0xff;
            this.F.carry = false;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.F.zero = returnVal === 0;
            return returnVal;
        }
        xor(source) {
            this.A.value = this._xor(this.A.value, source.value);
        }
        xorImmediate() {
            this.A.value = this._xor(this.A.value, this.memory.readByte(this.PC.value));
            this.PC.value++;
        }
        xorFromMemory(source) {
            this.A.value = this._xor(this.A.value, this.memory.readByte(source.value));
        }
        increment(target) {
            const newValue = (target.value + 1) & 0xff;
            this.F.subtract = false;
            this.F.zero = newValue === 0;
            this.F.halfCarry = (newValue & 0x0f) < (target.value & 0x0f);
            target.value = newValue;
        }
        decrement(target) {
            const newValue = (target.value - 1) & 0xff;
            this.F.subtract = true;
            this.F.zero = newValue === 0;
            this.F.halfCarry = (newValue & 0x0f) > (target.value & 0x0f);
            target.value = newValue;
        }
        add16Bit(target, source) {
            if (!target.is16Bit || !source.is16Bit) {
                throw new Error(`Invalid registers: ${target.name} and ${source.name}`);
            }
            const newValue = (target.value + source.value) & 0xffff;
            this.F.subtract = false;
            this.F.halfCarry = (newValue & 0xfff) < (target.value & 0xfff);
            this.F.carry = newValue < target.value;
            target.value = newValue;
        }
        rotateLeft() {
            const bit7 = this.A.value >> 7;
            this.F.carry = bit7 === 1;
            this.F.halfCarry = false;
            this.F.zero = false;
            this.F.subtract = false;
            this.A.value = (this.A.value << 1) + bit7;
        }
        rotateLeftCarry() {
            const carry = this.F.carry ? 1 : 0;
            const bit7 = this.A.value >> 7;
            const result = ((this.A.value << 1) + carry) & 0xff;
            this.F.carry = bit7 === 1;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.F.zero = false;
            this.A.value = result;
        }
        rotateRegisterLeft(target) {
            this.cpu.cycle(4);
            const bit7 = (target.value >> 7) & 1;
            target.value = (target.value << 1) + bit7;
            this.F.zero = target.value === 0;
            this.F.carry = bit7 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.cpu.cycle(4);
        }
        rotateRegisterLeftCarry(target) {
            this.cpu.cycle(4);
            const bit7 = target.value >> 7;
            const carry = this.F.carry ? 1 : 0;
            const result = ((target.value << 1) + carry) & 0xff;
            this.F.carry = bit7 === 1;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.F.zero = result === 0;
            target.value = result;
            this.cpu.cycle(4);
        }
        rotateAtRegisterAddrLeftCarry() {
            this.cpu.cycle(4);
            const byte = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit7 = byte >> 7;
            const result = ((byte << 1) + (this.F.carry ? 1 : 0)) & 0xff;
            this.F.carry = bit7 === 1;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.F.zero = result === 0;
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        rotateRegisterRight(target) {
            this.cpu.cycle(4);
            const bit0 = target.value & 1;
            target.value = (target.value >> 1) + (bit0 << 7);
            this.F.zero = target.value === 0;
            this.F.carry = bit0 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.cpu.cycle(4);
        }
        rotateRegisterRightCarry(target) {
            this.cpu.cycle(4);
            const bit0 = target.value & 1;
            const carry = this.F.carry ? 1 : 0;
            target.value = ((target.value >> 1) & 0xff) + (carry << 7);
            this.F.carry = bit0 === 1;
            this.F.zero = target.value === 0;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.cpu.cycle(4);
        }
        rotateAtRegisterAddrRightCarry() {
            this.cpu.cycle(4);
            const byte = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit0 = byte & 1;
            const newValue = (byte >> 1) + ((this.F.carry ? 1 : 0) << 7);
            this.F.carry = bit0 === 1;
            this.F.zero = newValue === 0;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.memory.writeByte(this.HL.value, newValue);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        rotateValueAtRegisterAddrLeft() {
            this.cpu.cycle(4);
            const byte = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit7 = (byte >> 7) & 1;
            const newValue = (byte << 1) + bit7;
            this.F.zero = newValue === 0;
            this.F.carry = bit7 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.memory.writeByte(this.HL.value, newValue);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        rotateValueAtRegisterAddrRight() {
            this.cpu.cycle(4);
            const byte = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit0 = byte & 1;
            const newValue = (byte >> 1) + (bit0 << 7);
            this.F.zero = newValue === 0;
            this.F.carry = bit0 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.memory.writeByte(this.HL.value, newValue);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        rotateRight() {
            const bit0 = this.A.value & 1;
            this.F.carry = bit0 === 1;
            this.F.halfCarry = false;
            this.F.zero = false;
            this.F.subtract = false;
            this.A.value = (this.A.value >> 1) + (bit0 << 7);
        }
        rotateRightCarry() {
            const bit0 = this.A.value & 1;
            const carry = this.F.carry ? 1 : 0;
            this.F.carry = bit0 === 1;
            this.F.zero = false;
            this.F.halfCarry = false;
            this.F.subtract = false;
            this.A.value = (this.A.value >> 1) + (carry << 7);
        }
        writeToMemoryRegisterAddrAndIncrementTarget(target, source) {
            this.memory.writeByte(target.value, source.value, "writeToMemoryRegisterAddrAndIncrementTarget");
            target.value++;
        }
        writeToMemoryRegisterAddrAndDecrementTarget(target, source) {
            this.memory.writeByte(target.value, source.value, "writeToMemoryRegisterAddrAndDecrementTarget");
            target.value--;
        }
        decimalAdjustAccumulator() {
            const { A, F } = this;
            const onesPlaceCorrector = F.subtract ? -0x06 : 0x06;
            const tensPlaceCorrector = F.subtract ? -0x60 : 0x60;
            const isAdditionBcdHalfCarry = !F.subtract && (A.value & 0x0f) > 9;
            const isAdditionBcdCarry = !F.subtract && A.value > 0x99;
            if (F.halfCarry || isAdditionBcdHalfCarry) {
                A.value += onesPlaceCorrector;
            }
            if (F.carry || isAdditionBcdCarry) {
                A.value += tensPlaceCorrector;
                F.carry = true;
            }
            F.zero = A.value === 0;
            F.halfCarry = false;
        }
        complementAccumulator() {
            this.A.value = ~this.A.value;
            this.F.subtract = true;
            this.F.halfCarry = true;
        }
        incrementMemoryValAtRegisterAddr(target) {
            const oldValue = this.memory.readByte(target.value);
            const newValue = (oldValue + 1) & 0xff;
            this.cpu.cycle(4);
            this.F.subtract = false;
            this.F.zero = newValue === 0;
            this.F.halfCarry = (newValue & 0x0f) < (oldValue & 0x0f);
            this.memory.writeByte(target.value, newValue, "incrementMemoryValAtRegisterAddr");
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        decrementMemoryValAtRegisterAddr(target) {
            const oldValue = this.memory.readByte(target.value);
            const newValue = (oldValue - 1) & 0xff;
            this.cpu.cycle(4);
            this.F.subtract = true;
            this.F.zero = newValue === 0;
            this.F.halfCarry = (newValue & 0x0f) > (oldValue & 0x0f);
            this.memory.writeByte(target.value, newValue, "decrementMemoryValAtRegisterAddr");
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        callFunction() {
            const address = this.memory.readWord(this.PC.value);
            this.PC.value += 2;
            this.pushToStack(this.PC.value);
            this.PC.value = address;
        }
        callFunctionIfNotZero() {
            if (!this.F.zero) {
                this.callFunction();
            }
            else {
                this.PC.value += 2;
            }
        }
        callFunctionIfZero() {
            if (this.F.zero) {
                this.callFunction();
            }
            else {
                this.PC.value += 2;
            }
        }
        callFunctionIfNotCarry() {
            if (!this.F.carry) {
                this.callFunction();
            }
            else {
                this.PC.value += 2;
            }
        }
        callFunctionIfCarry() {
            if (this.F.carry) {
                this.callFunction();
            }
            else {
                this.PC.value += 2;
            }
        }
        returnFromFunction() {
            this.PC.value = this.popFromStack();
        }
        returnFromFunctionIfNotZero() {
            if (!this.F.zero) {
                this.returnFromFunction();
            }
        }
        returnFromFunctionIfZero() {
            if (this.F.zero) {
                this.returnFromFunction();
            }
        }
        returnFromFunctionIfCarry() {
            if (this.F.carry) {
                this.returnFromFunction();
            }
        }
        returnFromFunctionIfNotCarry() {
            if (!this.F.carry) {
                this.returnFromFunction();
            }
        }
        popFromStack() {
            const returnVal = this.memory.readWord(this.SP.value);
            this.SP.value += 2;
            return returnVal;
        }
        restart(address) {
            this.pushToStack(this.PC.value);
            this.PC.value = address;
        }
        pushToStack(value) {
            this.SP.value -= 2;
            this.memory.writeWord(this.SP.value, value);
        }
        popToRegister(target) {
            target.value = this.popFromStack();
        }
        pushFromRegister(source) {
            this.pushToStack(source.value);
        }
        swap(target) {
            this.cpu.cycle(4);
            const lowerNibble = target.value & 0b1111;
            const upperNibble = target.value >> 4;
            target.value = (lowerNibble << 4) + upperNibble;
            this.F.zero = target.value === 0;
            this.F.carry = false;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.cpu.cycle(4);
        }
        swapAtRegisterAddr() {
            this.cpu.cycle(4);
            let byte = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const lowerNibble = byte & 0b1111;
            const upperNibble = byte >> 4;
            const result = (lowerNibble << 4) + upperNibble;
            this.F.zero = result === 0;
            this.F.carry = false;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        testBit(bitPos, target) {
            this.cpu.cycle(4);
            const bit = (target.value >> bitPos) & 1;
            this.F.zero = bit === 0;
            this.F.halfCarry = true;
            this.F.subtract = false;
            this.cpu.cycle(4);
        }
        testBitAtRegisterAddr(bitPos) {
            this.cpu.cycle(4);
            const byteToTest = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit = (byteToTest >> bitPos) & 1;
            this.F.zero = bit === 0;
            this.F.halfCarry = true;
            this.F.subtract = false;
            this.cpu.cycle(4);
        }
        resetBit(bitPos, target) {
            this.cpu.cycle(4);
            target.value = target.value & ~(0b1 << bitPos);
            this.cpu.cycle(4);
        }
        resetBitAtRegisterAddr(bitPos) {
            this.cpu.cycle(4);
            let result = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            result = result & ~(0b1 << bitPos);
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        shiftLeft(target) {
            this.cpu.cycle(4);
            const bit7 = (target.value >> 7) & 1;
            target.value = (target.value << 1) & 0xff;
            this.F.carry = bit7 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.F.zero = target.value === 0;
            this.cpu.cycle(4);
        }
        shiftLeftAtRegisterAddr() {
            this.cpu.cycle(4);
            let result = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit7 = (result >> 7) & 1;
            result = (result << 1) & 0xff;
            this.F.carry = bit7 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.F.zero = result === 0;
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        shiftRight(target) {
            this.cpu.cycle(4);
            const bit7 = target.value >> 7;
            const bit0 = target.value & 1;
            target.value = (target.value >> 1) & 0xff;
            target.setBit(7, bit7);
            this.F.carry = bit0 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.F.zero = target.value === 0;
            this.cpu.cycle(4);
        }
        shiftRightCarry(target) {
            this.cpu.cycle(4);
            const bit0 = target.value & 1;
            target.value = (target.value >> 1) & 0xff;
            this.F.carry = bit0 === 1;
            this.F.zero = target.value === 0;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.cpu.cycle(4);
        }
        shiftRightCarryAtRegisterAddr() {
            this.cpu.cycle(4);
            let result = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit0 = result & 1;
            result = (result >> 1) & 0xff;
            // reset bit 7
            // TODO: move all bit operation methods to own class
            result = result & ~(0b1 << 7);
            this.F.carry = bit0 === 1;
            this.F.zero = result === 0;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        shiftRightAtRegisterAddr() {
            this.cpu.cycle(4);
            let result = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            const bit7 = result >> 7;
            const bit0 = result & 1;
            result = (result >> 1) & 0xff;
            result |= bit7 << 7;
            this.F.carry = bit0 === 1;
            this.F.subtract = false;
            this.F.halfCarry = false;
            this.F.zero = result === 0;
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        setBitAtRegisterAddress(bitPos) {
            this.cpu.cycle(4);
            let result = this.memory.readByte(this.HL.value);
            this.cpu.cycle(4);
            result |= 1 << bitPos;
            this.memory.writeByte(this.HL.value, result);
            this.cpu.cycle(4);
            this.cpu.cycle(4);
        }
        outputState() {
            console.log('register state:');
            console.log({
                AF: this.AF.hexValue,
                BC: this.BC.hexValue,
                DE: this.DE.hexValue,
                HL: this.HL.hexValue,
                PC: this.PC.hexValue,
                SP: this.SP.hexValue
            });
        }
    }
    exports.CPURegisters = CPURegisters;
});
define("cpu/Instruction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("cpu/setCbMap", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCbMap = void 0;
    function setCbMap() {
        this.cbMap.set(0x0, {
            name: "RLC B",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.B);
            }
        });
        this.cbMap.set(0x1, {
            name: "RLC C",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.C);
            }
        });
        this.cbMap.set(0x2, {
            name: "RLC D",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.D);
            }
        });
        this.cbMap.set(0x3, {
            name: "RLC E",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.E);
            }
        });
        this.cbMap.set(0x4, {
            name: "RLC H",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.H);
            }
        });
        this.cbMap.set(0x5, {
            name: "RLC L",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.L);
            }
        });
        this.cbMap.set(0x6, {
            name: "RLC (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateValueAtRegisterAddrLeft();
            }
        });
        this.cbMap.set(0x7, {
            name: "RLC A",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeft(this.registers.A);
            }
        });
        this.cbMap.set(0x8, {
            name: "RRC B",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.B);
            }
        });
        this.cbMap.set(0x9, {
            name: "RRC C",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.C);
            }
        });
        this.cbMap.set(0xa, {
            name: "RRC D",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.D);
            }
        });
        this.cbMap.set(0xb, {
            name: "RRC E",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.E);
            }
        });
        this.cbMap.set(0xc, {
            name: "RRC H",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.H);
            }
        });
        this.cbMap.set(0xd, {
            name: "RRC L",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.L);
            }
        });
        this.cbMap.set(0xe, {
            name: "RRC (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateValueAtRegisterAddrRight();
            }
        });
        this.cbMap.set(0xf, {
            name: "RRC A",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRight(this.registers.A);
            }
        });
        this.cbMap.set(0x10, {
            name: "RL B",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.B);
            }
        });
        this.cbMap.set(0x11, {
            name: "RL C",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.C);
            }
        });
        this.cbMap.set(0x12, {
            name: "RL D",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.D);
            }
        });
        this.cbMap.set(0x13, {
            name: "RL E",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.E);
            }
        });
        this.cbMap.set(0x14, {
            name: "RL H",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.H);
            }
        });
        this.cbMap.set(0x15, {
            name: "RL L",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.L);
            }
        });
        this.cbMap.set(0x16, {
            name: "RL (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateAtRegisterAddrLeftCarry();
            }
        });
        this.cbMap.set(0x17, {
            name: "RL A",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterLeftCarry(this.registers.A);
            }
        });
        this.cbMap.set(0x18, {
            name: "RR B",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.B);
            }
        });
        this.cbMap.set(0x19, {
            name: "RR C",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.C);
            }
        });
        this.cbMap.set(0x1a, {
            name: "RR D",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.D);
            }
        });
        this.cbMap.set(0x1b, {
            name: "RR E",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.E);
            }
        });
        this.cbMap.set(0x1c, {
            name: "RR H",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.H);
            }
        });
        this.cbMap.set(0x1d, {
            name: "RR L",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.L);
            }
        });
        this.cbMap.set(0x1e, {
            name: "RR (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateAtRegisterAddrRightCarry();
            }
        });
        this.cbMap.set(0x1f, {
            name: "RR A",
            cycleTime: 0,
            operation: () => {
                this.registers.rotateRegisterRightCarry(this.registers.A);
            }
        });
        this.cbMap.set(0x20, {
            name: "SLA B",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.B);
            }
        });
        this.cbMap.set(0x21, {
            name: "SLA C",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.C);
            }
        });
        this.cbMap.set(0x22, {
            name: "SLA D",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.D);
            }
        });
        this.cbMap.set(0x23, {
            name: "SLA E",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.E);
            }
        });
        this.cbMap.set(0x24, {
            name: "SLA H",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.H);
            }
        });
        this.cbMap.set(0x25, {
            name: "SLA L",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.L);
            }
        });
        this.cbMap.set(0x26, {
            name: "SLA (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeftAtRegisterAddr();
            }
        });
        this.cbMap.set(0x27, {
            name: "SLA A",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftLeft(this.registers.A);
            }
        });
        this.cbMap.set(0x28, {
            name: "SRA B",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.B);
            }
        });
        this.cbMap.set(0x29, {
            name: "SRA C",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.C);
            }
        });
        this.cbMap.set(0x2a, {
            name: "SRA D",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.D);
            }
        });
        this.cbMap.set(0x2b, {
            name: "SRA E",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.E);
            }
        });
        this.cbMap.set(0x2c, {
            name: "SRA H",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.H);
            }
        });
        this.cbMap.set(0x2d, {
            name: "SRA L",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.L);
            }
        });
        this.cbMap.set(0x2e, {
            name: "SRA (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightAtRegisterAddr();
            }
        });
        this.cbMap.set(0x2f, {
            name: "SRA A",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRight(this.registers.A);
            }
        });
        this.cbMap.set(0x30, {
            name: "SWAP B",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.B);
            }
        });
        this.cbMap.set(0x31, {
            name: "SWAP C",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.C);
            }
        });
        this.cbMap.set(0x32, {
            name: "SWAP D",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.D);
            }
        });
        this.cbMap.set(0x33, {
            name: "SWAP E",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.E);
            }
        });
        this.cbMap.set(0x34, {
            name: "SWAP H",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.H);
            }
        });
        this.cbMap.set(0x35, {
            name: "SWAP L",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.L);
            }
        });
        this.cbMap.set(0x36, {
            name: "SWAP (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.swapAtRegisterAddr();
            }
        });
        this.cbMap.set(0x37, {
            name: "SWAP A",
            cycleTime: 0,
            operation: () => {
                this.registers.swap(this.registers.A);
            }
        });
        this.cbMap.set(0x38, {
            name: "SRL B",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.B);
            }
        });
        this.cbMap.set(0x39, {
            name: "SRL C",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.C);
            }
        });
        this.cbMap.set(0x3a, {
            name: "SRL D",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.D);
            }
        });
        this.cbMap.set(0x3b, {
            name: "SRL E",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.E);
            }
        });
        this.cbMap.set(0x3c, {
            name: "SRL H",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.H);
            }
        });
        this.cbMap.set(0x3d, {
            name: "SRL L",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.L);
            }
        });
        this.cbMap.set(0x3e, {
            name: "SRL (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarryAtRegisterAddr();
            }
        });
        this.cbMap.set(0x3f, {
            name: "SRL A",
            cycleTime: 0,
            operation: () => {
                this.registers.shiftRightCarry(this.registers.A);
            }
        });
        this.cbMap.set(0x40, {
            name: "BIT 0, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.B);
            }
        });
        this.cbMap.set(0x41, {
            name: "BIT 0, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.C);
            }
        });
        this.cbMap.set(0x42, {
            name: "BIT 0, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.D);
            }
        });
        this.cbMap.set(0x43, {
            name: "BIT 0, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.E);
            }
        });
        this.cbMap.set(0x44, {
            name: "BIT 0, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.H);
            }
        });
        this.cbMap.set(0x45, {
            name: "BIT 0, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.L);
            }
        });
        this.cbMap.set(0x46, {
            name: "BIT 0, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(0);
            }
        });
        this.cbMap.set(0x47, {
            name: "BIT 0, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(0, this.registers.A);
            }
        });
        this.cbMap.set(0x48, {
            name: "BIT 1, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.B);
            }
        });
        this.cbMap.set(0x49, {
            name: "BIT 1, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.C);
            }
        });
        this.cbMap.set(0x4a, {
            name: "BIT 1, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.D);
            }
        });
        this.cbMap.set(0x4b, {
            name: "BIT 1, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.E);
            }
        });
        this.cbMap.set(0x4c, {
            name: "BIT 1, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.H);
            }
        });
        this.cbMap.set(0x4d, {
            name: "BIT 1, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.L);
            }
        });
        this.cbMap.set(0x4e, {
            name: "BIT 1, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(1);
            }
        });
        this.cbMap.set(0x4f, {
            name: "BIT 1, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(1, this.registers.A);
            }
        });
        this.cbMap.set(0x50, {
            name: "BIT 2, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.B);
            }
        });
        this.cbMap.set(0x51, {
            name: "BIT 2, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.C);
            }
        });
        this.cbMap.set(0x52, {
            name: "BIT 2, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.D);
            }
        });
        this.cbMap.set(0x53, {
            name: "BIT 2, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.E);
            }
        });
        this.cbMap.set(0x54, {
            name: "BIT 2, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.H);
            }
        });
        this.cbMap.set(0x55, {
            name: "BIT 2, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.L);
            }
        });
        this.cbMap.set(0x56, {
            name: "BIT 2, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(2);
            }
        });
        this.cbMap.set(0x57, {
            name: "BIT 2, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(2, this.registers.A);
            }
        });
        this.cbMap.set(0x58, {
            name: "BIT 3, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.B);
            }
        });
        this.cbMap.set(0x59, {
            name: "BIT 3, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.C);
            }
        });
        this.cbMap.set(0x5a, {
            name: "BIT 3, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.D);
            }
        });
        this.cbMap.set(0x5b, {
            name: "BIT 3, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.E);
            }
        });
        this.cbMap.set(0x5c, {
            name: "BIT 3, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.H);
            }
        });
        this.cbMap.set(0x5d, {
            name: "BIT 3, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.L);
            }
        });
        this.cbMap.set(0x5e, {
            name: "BIT 3, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(3);
            }
        });
        this.cbMap.set(0x5f, {
            name: "BIT 3, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(3, this.registers.A);
            }
        });
        this.cbMap.set(0x60, {
            name: "BIT 4, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.B);
            }
        });
        this.cbMap.set(0x61, {
            name: "BIT 4, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.C);
            }
        });
        this.cbMap.set(0x62, {
            name: "BIT 4, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.D);
            }
        });
        this.cbMap.set(0x63, {
            name: "BIT 4, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.E);
            }
        });
        this.cbMap.set(0x64, {
            name: "BIT 4, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.H);
            }
        });
        this.cbMap.set(0x65, {
            name: "BIT 4, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.L);
            }
        });
        this.cbMap.set(0x66, {
            name: "BIT 4, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(4);
            }
        });
        this.cbMap.set(0x67, {
            name: "BIT 4, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(4, this.registers.A);
            }
        });
        this.cbMap.set(0x68, {
            name: "BIT 5, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.B);
            }
        });
        this.cbMap.set(0x69, {
            name: "BIT 5, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.C);
            }
        });
        this.cbMap.set(0x6a, {
            name: "BIT 5, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.D);
            }
        });
        this.cbMap.set(0x6b, {
            name: "BIT 5, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.E);
            }
        });
        this.cbMap.set(0x6c, {
            name: "BIT 5, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.H);
            }
        });
        this.cbMap.set(0x6d, {
            name: "BIT 5, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.L);
            }
        });
        this.cbMap.set(0x6e, {
            name: "BIT 5, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(5);
            }
        });
        this.cbMap.set(0x6f, {
            name: "BIT 5, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(5, this.registers.A);
            }
        });
        this.cbMap.set(0x70, {
            name: "BIT 6, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.B);
            }
        });
        this.cbMap.set(0x71, {
            name: "BIT 6, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.C);
            }
        });
        this.cbMap.set(0x72, {
            name: "BIT 6, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.D);
            }
        });
        this.cbMap.set(0x73, {
            name: "BIT 6, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.E);
            }
        });
        this.cbMap.set(0x74, {
            name: "BIT 6, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.H);
            }
        });
        this.cbMap.set(0x75, {
            name: "BIT 6, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.L);
            }
        });
        this.cbMap.set(0x76, {
            name: "BIT 6, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(6);
            }
        });
        this.cbMap.set(0x77, {
            name: "BIT 6, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(6, this.registers.A);
            }
        });
        this.cbMap.set(0x78, {
            name: "BIT 7, B",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.B);
            }
        });
        this.cbMap.set(0x79, {
            name: "BIT 7, C",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.C);
            }
        });
        this.cbMap.set(0x7a, {
            name: "BIT 7, D",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.D);
            }
        });
        this.cbMap.set(0x7b, {
            name: "BIT 7, E",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.E);
            }
        });
        this.cbMap.set(0x7c, {
            name: "BIT 7, H",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.H);
            }
        });
        this.cbMap.set(0x7d, {
            name: "BIT 7, L",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.L);
            }
        });
        this.cbMap.set(0x7e, {
            name: "BIT 7, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.testBitAtRegisterAddr(7);
            }
        });
        this.cbMap.set(0x7f, {
            name: "BIT 7, A",
            cycleTime: 0,
            operation: () => {
                this.registers.testBit(7, this.registers.A);
            }
        });
        this.cbMap.set(0x80, {
            name: "RES 0, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.B);
            }
        });
        this.cbMap.set(0x81, {
            name: "RES 0, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.C);
            }
        });
        this.cbMap.set(0x82, {
            name: "RES 0, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.D);
            }
        });
        this.cbMap.set(0x83, {
            name: "RES 0, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.E);
            }
        });
        this.cbMap.set(0x84, {
            name: "RES 0, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.H);
            }
        });
        this.cbMap.set(0x85, {
            name: "RES 0, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.L);
            }
        });
        this.cbMap.set(0x86, {
            name: "RES 0, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(0);
            }
        });
        this.cbMap.set(0x87, {
            name: "RES 0, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(0, this.registers.A);
            }
        });
        this.cbMap.set(0x88, {
            name: "RES 1, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.B);
            }
        });
        this.cbMap.set(0x89, {
            name: "RES 1, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.C);
            }
        });
        this.cbMap.set(0x8a, {
            name: "RES 1, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.D);
            }
        });
        this.cbMap.set(0x8b, {
            name: "RES 1, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.E);
            }
        });
        this.cbMap.set(0x8c, {
            name: "RES 1, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.H);
            }
        });
        this.cbMap.set(0x8d, {
            name: "RES 1, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.L);
            }
        });
        this.cbMap.set(0x8e, {
            name: "RES 1, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(1);
            }
        });
        this.cbMap.set(0x8f, {
            name: "RES 1, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(1, this.registers.A);
            }
        });
        this.cbMap.set(0x90, {
            name: "RES 2, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.B);
            }
        });
        this.cbMap.set(0x91, {
            name: "RES 2, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.C);
            }
        });
        this.cbMap.set(0x92, {
            name: "RES 2, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.D);
            }
        });
        this.cbMap.set(0x93, {
            name: "RES 2, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.E);
            }
        });
        this.cbMap.set(0x94, {
            name: "RES 2, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.H);
            }
        });
        this.cbMap.set(0x95, {
            name: "RES 2, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.L);
            }
        });
        this.cbMap.set(0x96, {
            name: "RES 2, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(2);
            }
        });
        this.cbMap.set(0x97, {
            name: "RES 2, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(2, this.registers.A);
            }
        });
        this.cbMap.set(0x98, {
            name: "RES 3, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.B);
            }
        });
        this.cbMap.set(0x99, {
            name: "RES 3, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.C);
            }
        });
        this.cbMap.set(0x9a, {
            name: "RES 3, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.D);
            }
        });
        this.cbMap.set(0x9b, {
            name: "RES 3, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.E);
            }
        });
        this.cbMap.set(0x9c, {
            name: "RES 3, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.H);
            }
        });
        this.cbMap.set(0x9d, {
            name: "RES 3, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.L);
            }
        });
        this.cbMap.set(0x9e, {
            name: "RES 3, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(3);
            }
        });
        this.cbMap.set(0x9f, {
            name: "RES 3, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(3, this.registers.A);
            }
        });
        this.cbMap.set(0xa0, {
            name: "RES 4, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.B);
            }
        });
        this.cbMap.set(0xa1, {
            name: "RES 4, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.C);
            }
        });
        this.cbMap.set(0xa2, {
            name: "RES 4, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.D);
            }
        });
        this.cbMap.set(0xa3, {
            name: "RES 4, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.E);
            }
        });
        this.cbMap.set(0xa4, {
            name: "RES 4, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.H);
            }
        });
        this.cbMap.set(0xa5, {
            name: "RES 4, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.L);
            }
        });
        this.cbMap.set(0xa6, {
            name: "RES 4, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(4);
            }
        });
        this.cbMap.set(0xa7, {
            name: "RES 4, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(4, this.registers.A);
            }
        });
        this.cbMap.set(0xa8, {
            name: "RES 5, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.B);
            }
        });
        this.cbMap.set(0xa9, {
            name: "RES 5, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.C);
            }
        });
        this.cbMap.set(0xaa, {
            name: "RES 5, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.D);
            }
        });
        this.cbMap.set(0xab, {
            name: "RES 5, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.E);
            }
        });
        this.cbMap.set(0xac, {
            name: "RES 5, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.H);
            }
        });
        this.cbMap.set(0xad, {
            name: "RES 5, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.L);
            }
        });
        this.cbMap.set(0xae, {
            name: "RES 5, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(5);
            }
        });
        this.cbMap.set(0xaf, {
            name: "RES 5, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(5, this.registers.A);
            }
        });
        this.cbMap.set(0xb0, {
            name: "RES 6, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.B);
            }
        });
        this.cbMap.set(0xb1, {
            name: "RES 6, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.C);
            }
        });
        this.cbMap.set(0xb2, {
            name: "RES 6, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.D);
            }
        });
        this.cbMap.set(0xb3, {
            name: "RES 6, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.E);
            }
        });
        this.cbMap.set(0xb4, {
            name: "RES 6, H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.H);
            }
        });
        this.cbMap.set(0xb5, {
            name: "RES 6, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.L);
            }
        });
        this.cbMap.set(0xb6, {
            name: "RES 6, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(6);
            }
        });
        this.cbMap.set(0xb7, {
            name: "RES 6, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(6, this.registers.A);
            }
        });
        this.cbMap.set(0xb8, {
            name: "RES 7, B",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.B);
            }
        });
        this.cbMap.set(0xb9, {
            name: "RES 7, C",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.C);
            }
        });
        this.cbMap.set(0xba, {
            name: "RES 7, D",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.D);
            }
        });
        this.cbMap.set(0xbb, {
            name: "RES 7, E",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.E);
            }
        });
        this.cbMap.set(0xbc, {
            name: "RES 7 H",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.H);
            }
        });
        this.cbMap.set(0xbd, {
            name: "RES 7, L",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.L);
            }
        });
        this.cbMap.set(0xbe, {
            name: "RES 7, (HL) ",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBitAtRegisterAddr(7);
            }
        });
        this.cbMap.set(0xbf, {
            name: "RES 7, A",
            cycleTime: 0,
            operation: () => {
                this.registers.resetBit(7, this.registers.A);
            }
        });
        this.cbMap.set(0xc0, {
            name: "SET 0, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc1, {
            name: "SET 0, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc2, {
            name: "SET 0, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc3, {
            name: "SET 0, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc4, {
            name: "SET 0, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc5, {
            name: "SET 0, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc6, {
            name: "SET 0, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(0);
            }
        });
        this.cbMap.set(0xc7, {
            name: "SET 0, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(0, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc8, {
            name: "SET 1, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xc9, {
            name: "SET 1, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xca, {
            name: "SET 1, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xcb, {
            name: "SET 1, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xcc, {
            name: "SET 1, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xcd, {
            name: "SET 1, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xce, {
            name: "SET 1, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(1);
            }
        });
        this.cbMap.set(0xcf, {
            name: "SET 1, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(1, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd0, {
            name: "SET 2, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd1, {
            name: "SET 2, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd2, {
            name: "SET 2, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd3, {
            name: "SET 2, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd4, {
            name: "SET 2, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd5, {
            name: "SET 2, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd6, {
            name: "SET 2, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(2);
            }
        });
        this.cbMap.set(0xd7, {
            name: "SET 2, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(2, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd8, {
            name: "SET 3, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xd9, {
            name: "SET 3, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xda, {
            name: "SET 3, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xdb, {
            name: "SET 3, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xdc, {
            name: "SET 3, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xdd, {
            name: "SET 3, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xde, {
            name: "SET 3, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(3);
            }
        });
        this.cbMap.set(0xdf, {
            name: "SET 3, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(3, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe0, {
            name: "SET 4, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe1, {
            name: "SET 4, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe2, {
            name: "SET 4, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe3, {
            name: "SET 4, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe4, {
            name: "SET 4, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe5, {
            name: "SET 4, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe6, {
            name: "SET 4, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(4);
            }
        });
        this.cbMap.set(0xe7, {
            name: "SET 4, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(4, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe8, {
            name: "SET 5, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xe9, {
            name: "SET 5, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xea, {
            name: "SET 5, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xeb, {
            name: "SET 5, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xec, {
            name: "SET 5, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xed, {
            name: "SET 5, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xee, {
            name: "SET 5, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(5);
            }
        });
        this.cbMap.set(0xef, {
            name: "SET 5, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(5, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf0, {
            name: "SET 6, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf1, {
            name: "SET 6, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf2, {
            name: "SET 6, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf3, {
            name: "SET 6, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf4, {
            name: "set 6, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf5, {
            name: "SET 6, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf6, {
            name: "SET 6, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(6);
            }
        });
        this.cbMap.set(0xf7, {
            name: "SET 6, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(6, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf8, {
            name: "SET 7, B",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.B.setBit(7, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xf9, {
            name: "SET 7, C",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.C.setBit(7, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xfa, {
            name: "SET 7, D",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.D.setBit(7, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xfb, {
            name: "SET 7, E",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.E.setBit(7, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xfc, {
            name: "SET 7, H",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.H.setBit(7, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xfd, {
            name: "SET 7, L",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.L.setBit(7, 1);
                this.cycle(4);
            }
        });
        this.cbMap.set(0xfe, {
            name: "SET 7, (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.setBitAtRegisterAddress(7);
            }
        });
        this.cbMap.set(0xff, {
            name: "SET 7, A",
            cycleTime: 0,
            operation: () => {
                this.cycle(4);
                this.registers.A.setBit(7, 1);
                this.cycle(4);
            }
        });
    }
    exports.setCbMap = setCbMap;
});
define("cpu/setInstructionMap", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setInstructionMap = void 0;
    function setInstructionMap() {
        const { registers, memory } = this;
        this.instructionMap.set(0x0, {
            name: "NOP",
            cycleTime: 4,
            operation() {
                // NOP
            }
        });
        this.instructionMap.set(0x1, {
            get name() {
                return `LD BC, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            cycleTime: 12,
            operation: () => {
                this.registers.loadWord(this.registers.BC);
            }
        });
        this.instructionMap.set(0x2, {
            name: "LD (BC), A",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.BC, this.registers.A);
            }
        });
        this.instructionMap.set(0x3, {
            name: "INC BC",
            cycleTime: 8,
            operation: () => {
                this.registers.BC.value++;
            }
        });
        this.instructionMap.set(0x4, {
            name: "INC B",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.B);
            }
        });
        this.instructionMap.set(0x5, {
            name: "DEC B",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.B);
            }
        });
        this.instructionMap.set(0x6, {
            get name() {
                return `LD B, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.B);
            }
        });
        this.instructionMap.set(0x7, {
            name: "RLCA",
            cycleTime: 4,
            operation: () => {
                this.registers.rotateLeft();
            }
        });
        this.instructionMap.set(0x8, {
            get name() {
                return `LD (0x${memory.readWord(registers.PC.value).toString(16)}), SP`;
            },
            cycleTime: 20,
            operation: () => {
                this.registers.writeStackPointerToMemory();
            }
        });
        this.instructionMap.set(0x9, {
            name: "ADD HL, BC",
            cycleTime: 8,
            operation: () => {
                this.registers.add16Bit(this.registers.HL, this.registers.BC);
            }
        });
        this.instructionMap.set(0xA, {
            name: "LD A, (BC)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.A, this.registers.BC);
            }
        });
        this.instructionMap.set(0xB, {
            name: "DEC BC",
            cycleTime: 8,
            operation: () => {
                this.registers.BC.value--;
            }
        });
        this.instructionMap.set(0xC, {
            name: "INC C",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.C);
            }
        });
        this.instructionMap.set(0xD, {
            name: "DEC C",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.C);
            }
        });
        this.instructionMap.set(0xE, {
            get name() {
                return `LD C, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.C);
            }
        });
        this.instructionMap.set(0xF, {
            name: "RRCA",
            cycleTime: 4,
            operation: () => {
                this.registers.rotateRight();
            }
        });
        this.instructionMap.set(0x10, {
            name: "STOP 0",
            cycleTime: 4,
            operation: () => {
                this.isStopped = true;
            }
        });
        this.instructionMap.set(0x11, {
            get name() {
                return `LD DE, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            cycleTime: 12,
            operation: () => {
                this.registers.loadWord(this.registers.DE);
            }
        });
        this.instructionMap.set(0x12, {
            name: "LD (DE), A",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.DE, this.registers.A);
            }
        });
        this.instructionMap.set(0x13, {
            name: "INC DE",
            cycleTime: 8,
            operation: () => {
                this.registers.DE.value++;
            }
        });
        this.instructionMap.set(0x14, {
            name: "INC D",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.D);
            }
        });
        this.instructionMap.set(0x15, {
            name: "DEC D",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.D);
            }
        });
        this.instructionMap.set(0x16, {
            get name() {
                return `LD D, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.D);
            }
        });
        this.instructionMap.set(0x17, {
            name: "RLA",
            cycleTime: 4,
            operation: () => {
                this.registers.rotateLeftCarry();
            }
        });
        this.instructionMap.set(0x18, {
            get name() {
                return `JR 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 12,
            operation: () => {
                this.registers.relativeJump();
            }
        });
        this.instructionMap.set(0x19, {
            name: "ADD HL, DE",
            cycleTime: 8,
            operation: () => {
                this.registers.add16Bit(this.registers.HL, this.registers.DE);
            }
        });
        this.instructionMap.set(0x1A, {
            name: "LD A, (DE)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.A, this.registers.DE);
            }
        });
        this.instructionMap.set(0x1B, {
            name: "DEC DE",
            cycleTime: 8,
            operation: () => {
                this.registers.DE.value--;
            }
        });
        this.instructionMap.set(0x1C, {
            name: "INC E",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.E);
            }
        });
        this.instructionMap.set(0x1D, {
            name: "DEC E",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.E);
            }
        });
        this.instructionMap.set(0x1E, {
            get name() {
                return `LD E, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.E);
            }
        });
        this.instructionMap.set(0x1F, {
            name: "RRA",
            cycleTime: 4,
            operation: () => {
                this.registers.rotateRightCarry();
            }
        });
        this.instructionMap.set(0x20, {
            get name() {
                return `JR NZ, 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return !registers.F.zero ? 12 : 8;
            },
            operation: () => {
                this.registers.relativeJumpIfNotZero();
            },
        });
        this.instructionMap.set(0x21, {
            get name() {
                return `LD HL, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            cycleTime: 12,
            operation: () => {
                this.registers.loadWord(this.registers.HL);
            }
        });
        this.instructionMap.set(0x22, {
            name: "LD (HL+), A",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddrAndIncrementTarget(this.registers.HL, this.registers.A);
            }
        });
        this.instructionMap.set(0x23, {
            name: "INC HL",
            cycleTime: 8,
            operation: () => {
                this.registers.HL.value++;
            }
        });
        this.instructionMap.set(0x24, {
            name: "INC H",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.H);
            }
        });
        this.instructionMap.set(0x25, {
            name: "DEC H",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.H);
            }
        });
        this.instructionMap.set(0x26, {
            get name() {
                return `LD H, ${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.H);
            }
        });
        this.instructionMap.set(0x27, {
            name: "DAA",
            cycleTime: 4,
            operation: () => {
                this.registers.decimalAdjustAccumulator();
            }
        });
        this.instructionMap.set(0x28, {
            get name() {
                return `JR Z, 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return registers.F.zero ? 12 : 8;
            },
            operation: () => {
                this.registers.relativeJumpIfZero();
            }
        });
        this.instructionMap.set(0x29, {
            name: "ADD HL, HL",
            cycleTime: 8,
            operation: () => {
                this.registers.add16Bit(this.registers.HL, this.registers.HL);
            }
        });
        this.instructionMap.set(0x2A, {
            name: "LD A, (HL+)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByteAndIncrementSource(this.registers.A, this.registers.HL);
            }
        });
        this.instructionMap.set(0x2B, {
            name: "DEC HL",
            cycleTime: 8,
            operation: () => {
                this.registers.HL.value--;
            }
        });
        this.instructionMap.set(0x2C, {
            name: "INC L",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.L);
            }
        });
        this.instructionMap.set(0x2D, {
            name: "DEC L",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.L);
            }
        });
        this.instructionMap.set(0x2E, {
            get name() {
                return `LD L, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.L);
            }
        });
        this.instructionMap.set(0x2F, {
            name: "CPL",
            cycleTime: 4,
            operation: () => {
                this.registers.complementAccumulator();
            }
        });
        this.instructionMap.set(0x30, {
            get name() {
                return `JR NC, 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return !registers.F.carry ? 12 : 8;
            },
            operation: () => {
                this.registers.relativeJumpIfNotCarry();
            }
        });
        this.instructionMap.set(0x31, {
            get name() {
                return `LD SP, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            cycleTime: 12,
            operation: () => {
                this.registers.loadWord(this.registers.SP);
            }
        });
        this.instructionMap.set(0x32, {
            name: "LD (HL-), A",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddrAndDecrementTarget(this.registers.HL, this.registers.A);
            }
        });
        this.instructionMap.set(0x33, {
            name: "INC SP",
            cycleTime: 8,
            operation: () => {
                this.registers.SP.value++;
            }
        });
        this.instructionMap.set(0x34, {
            name: "INC (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.incrementMemoryValAtRegisterAddr(this.registers.HL);
            }
        });
        this.instructionMap.set(0x35, {
            name: "DEC (HL)",
            cycleTime: 0,
            operation: () => {
                this.registers.decrementMemoryValAtRegisterAddr(this.registers.HL);
            }
        });
        this.instructionMap.set(0x36, {
            get name() {
                return `LD (HL), 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 0,
            operation: () => {
                this.registers.writeByteIntoRegisterAddress(this.registers.HL);
            }
        });
        this.instructionMap.set(0x37, {
            name: "SCF",
            cycleTime: 4,
            operation: () => {
                this.registers.setCarryFlag();
            }
        });
        this.instructionMap.set(0x38, {
            get name() {
                return `JR C, 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return registers.F.carry ? 12 : 8;
            },
            operation: () => {
                this.registers.relativeJumpIfCarry();
            }
        });
        this.instructionMap.set(0x39, {
            name: "ADD HL, SP",
            cycleTime: 8,
            operation: () => {
                this.registers.add16Bit(this.registers.HL, this.registers.SP);
            }
        });
        this.instructionMap.set(0x3A, {
            name: "LD A, (HL-)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByteAndDecrementSource(this.registers.A, this.registers.HL);
            }
        });
        this.instructionMap.set(0x3B, {
            name: "DEC SP",
            cycleTime: 8,
            operation: () => {
                this.registers.SP.value--;
            }
        });
        this.instructionMap.set(0x3C, {
            name: "INC A",
            cycleTime: 4,
            operation: () => {
                this.registers.increment(this.registers.A);
            }
        });
        this.instructionMap.set(0x3D, {
            name: "DEC A",
            cycleTime: 4,
            operation: () => {
                this.registers.decrement(this.registers.A);
            }
        });
        this.instructionMap.set(0x3E, {
            get name() {
                return `LD A, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.readByte(this.registers.A);
            }
        });
        this.instructionMap.set(0x3F, {
            name: "CCF",
            cycleTime: 4,
            operation: () => {
                this.registers.complementCarryFlag();
            }
        });
        this.instructionMap.set(0x40, {
            name: "LD B, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.B);
            }
        });
        this.instructionMap.set(0x41, {
            name: "LD B, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.C);
            }
        });
        this.instructionMap.set(0x42, {
            name: "LD B, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.D);
            }
        });
        this.instructionMap.set(0x43, {
            name: "LD B, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.E);
            }
        });
        this.instructionMap.set(0x44, {
            name: "LD B, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.H);
            }
        });
        this.instructionMap.set(0x45, {
            name: "LD B, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.L);
            }
        });
        this.instructionMap.set(0x46, {
            name: "LD B, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.B, this.registers.HL);
            }
        });
        this.instructionMap.set(0x47, {
            name: "LD B, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.B, this.registers.A);
            }
        });
        this.instructionMap.set(0x48, {
            name: "LD C, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.B);
            }
        });
        this.instructionMap.set(0x49, {
            name: "LD C, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.C);
            }
        });
        this.instructionMap.set(0x4A, {
            name: "LD C, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.D);
            }
        });
        this.instructionMap.set(0x4B, {
            name: "LD C, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.E);
            }
        });
        this.instructionMap.set(0x4C, {
            name: "LD C, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.H);
            }
        });
        this.instructionMap.set(0x4D, {
            name: "LD C, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.L);
            }
        });
        this.instructionMap.set(0x4E, {
            name: "LD C, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.C, this.registers.HL);
            }
        });
        this.instructionMap.set(0x4F, {
            name: "LD C, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.C, this.registers.A);
            }
        });
        this.instructionMap.set(0x50, {
            name: "LD D, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.B);
            }
        });
        this.instructionMap.set(0x51, {
            name: "LD D, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.C);
            }
        });
        this.instructionMap.set(0x52, {
            name: "LD D, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.D);
            }
        });
        this.instructionMap.set(0x53, {
            name: "LD D, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.E);
            }
        });
        this.instructionMap.set(0x54, {
            name: "LD D, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.H);
            }
        });
        this.instructionMap.set(0x55, {
            name: "LD D, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.L);
            }
        });
        this.instructionMap.set(0x56, {
            name: "LD D, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.D, this.registers.HL);
            }
        });
        this.instructionMap.set(0x57, {
            name: "LD D, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.D, this.registers.A);
            }
        });
        this.instructionMap.set(0x58, {
            name: "LD E, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.B);
            }
        });
        this.instructionMap.set(0x59, {
            name: "LD E, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.C);
            }
        });
        this.instructionMap.set(0x5A, {
            name: "LD E, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.D);
            }
        });
        this.instructionMap.set(0x5B, {
            name: "E, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.E);
            }
        });
        this.instructionMap.set(0x5C, {
            name: "LD E, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.H);
            }
        });
        this.instructionMap.set(0x5D, {
            name: "LD E, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.L);
            }
        });
        this.instructionMap.set(0x5E, {
            name: "LD E, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.E, this.registers.HL);
            }
        });
        this.instructionMap.set(0x5F, {
            name: "LD E, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.E, this.registers.A);
            }
        });
        this.instructionMap.set(0x60, {
            name: "LD H, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.B);
            }
        });
        this.instructionMap.set(0x61, {
            name: "LD H, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.C);
            }
        });
        this.instructionMap.set(0x62, {
            name: "LD H, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.D);
            }
        });
        this.instructionMap.set(0x63, {
            name: "LD H, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.E);
            }
        });
        this.instructionMap.set(0x64, {
            name: "LD H, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.H);
            }
        });
        this.instructionMap.set(0x65, {
            name: "LD H, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.L);
            }
        });
        this.instructionMap.set(0x66, {
            name: "LD H, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.H, this.registers.HL);
            }
        });
        this.instructionMap.set(0x67, {
            name: "LD H, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.H, this.registers.A);
            }
        });
        this.instructionMap.set(0x68, {
            name: "LD L, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.B);
            }
        });
        this.instructionMap.set(0x69, {
            name: "LD L, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.C);
            }
        });
        this.instructionMap.set(0x6A, {
            name: "LD L, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.D);
            }
        });
        this.instructionMap.set(0x6B, {
            name: "LD L, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.E);
            }
        });
        this.instructionMap.set(0x6C, {
            name: "LD L, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.H);
            }
        });
        this.instructionMap.set(0x6D, {
            name: "LD L, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.L);
            }
        });
        this.instructionMap.set(0x6E, {
            name: "LD L, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.L, this.registers.HL);
            }
        });
        this.instructionMap.set(0x6F, {
            name: "LD L, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.L, this.registers.A);
            }
        });
        this.instructionMap.set(0x70, {
            name: "LD (HL), B",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.B);
            }
        });
        this.instructionMap.set(0x71, {
            name: "LD (HL) C",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.C);
            }
        });
        this.instructionMap.set(0x72, {
            name: "LD (HL), D",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.D);
            }
        });
        this.instructionMap.set(0x73, {
            name: "LD (HL), E",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.E);
            }
        });
        this.instructionMap.set(0x74, {
            name: "LD (HL), H",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.H);
            }
        });
        this.instructionMap.set(0x75, {
            name: "LD (HL), L",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.L);
            }
        });
        this.instructionMap.set(0x76, {
            name: "HALT",
            cycleTime: 4,
            operation: () => {
                this.isHalted = true;
            }
        });
        this.instructionMap.set(0x77, {
            name: "LD (HL), A",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr(this.registers.HL, this.registers.A);
            }
        });
        this.instructionMap.set(0x78, {
            name: "LD A, B",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.B);
            }
        });
        this.instructionMap.set(0x79, {
            name: "LD A, C",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.C);
            }
        });
        this.instructionMap.set(0x7A, {
            name: "LD A, D",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.D);
            }
        });
        this.instructionMap.set(0x7B, {
            name: "LD A, E",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.E);
            }
        });
        this.instructionMap.set(0x7C, {
            name: "LD A, H",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.H);
            }
        });
        this.instructionMap.set(0x7D, {
            name: "LD A, L",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.L);
            }
        });
        this.instructionMap.set(0x7E, {
            name: "LD A, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte(this.registers.A, this.registers.HL);
            }
        });
        this.instructionMap.set(0x7F, {
            name: "LD A, A",
            cycleTime: 4,
            operation: () => {
                this.registers.load(this.registers.A, this.registers.A);
            }
        });
        this.instructionMap.set(0x80, {
            name: "ADD A, B",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.B);
            }
        });
        this.instructionMap.set(0x81, {
            name: "ADD A, C",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.C);
            }
        });
        this.instructionMap.set(0x82, {
            name: "ADD A, D",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.D);
            }
        });
        this.instructionMap.set(0x83, {
            name: "ADD A, E",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.E);
            }
        });
        this.instructionMap.set(0x84, {
            name: "ADD A, H",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.H);
            }
        });
        this.instructionMap.set(0x85, {
            name: "ADD A, L",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.L);
            }
        });
        this.instructionMap.set(0x86, {
            name: "ADD A, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.addFromRegisterAddr(this.registers.A, this.registers.HL);
            }
        });
        this.instructionMap.set(0x87, {
            name: "ADD A, A",
            cycleTime: 4,
            operation: () => {
                this.registers.add(this.registers.A, this.registers.A);
            }
        });
        this.instructionMap.set(0x88, {
            name: "ADC A, B",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.B);
            }
        });
        this.instructionMap.set(0x89, {
            name: "ADC A, C",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.C);
            }
        });
        this.instructionMap.set(0x8A, {
            name: "ADC A, D",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.D);
            }
        });
        this.instructionMap.set(0x8B, {
            name: "ADC A, E",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.E);
            }
        });
        this.instructionMap.set(0x8C, {
            name: "ADC A, H",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.H);
            }
        });
        this.instructionMap.set(0x8D, {
            name: "ADC A, L",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.L);
            }
        });
        this.instructionMap.set(0x8E, {
            name: "ADC A, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.addWithCarryFromMemory(this.registers.HL);
            }
        });
        this.instructionMap.set(0x8F, {
            name: "ADC A, A",
            cycleTime: 4,
            operation: () => {
                this.registers.addWithCarry(this.registers.A);
            }
        });
        this.instructionMap.set(0x90, {
            name: "SUB B",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.B);
            }
        });
        this.instructionMap.set(0x91, {
            name: "SUB C",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.C);
            }
        });
        this.instructionMap.set(0x92, {
            name: "SUB D",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.D);
            }
        });
        this.instructionMap.set(0x93, {
            name: "SUB E",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.E);
            }
        });
        this.instructionMap.set(0x94, {
            name: "SUB H",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.H);
            }
        });
        this.instructionMap.set(0x95, {
            name: "SUB L",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.L);
            }
        });
        this.instructionMap.set(0x96, {
            name: "SUB (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.subtractFromMemory(this.registers.HL);
            }
        });
        this.instructionMap.set(0x97, {
            name: "SUB A",
            cycleTime: 4,
            operation: () => {
                this.registers.subtract(this.registers.A);
            }
        });
        this.instructionMap.set(0x98, {
            name: "SBC A, B",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.B);
            }
        });
        this.instructionMap.set(0x99, {
            name: "SBC A, C",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.C);
            }
        });
        this.instructionMap.set(0x9A, {
            name: "SBC A, D",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.D);
            }
        });
        this.instructionMap.set(0x9B, {
            name: "SBC A, E",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.E);
            }
        });
        this.instructionMap.set(0x9C, {
            name: "SBC A, H",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.H);
            }
        });
        this.instructionMap.set(0x9D, {
            name: "SBC A, L",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.L);
            }
        });
        this.instructionMap.set(0x9E, {
            name: "SBC A, (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.subtractWithCarryFromMemory(this.registers.HL);
            }
        });
        this.instructionMap.set(0x9F, {
            name: "SBC A, A",
            cycleTime: 4,
            operation: () => {
                this.registers.subtractWithCarry(this.registers.A);
            }
        });
        this.instructionMap.set(0xA0, {
            name: "AND B",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.B);
            }
        });
        this.instructionMap.set(0xA1, {
            name: "AND C",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.C);
            }
        });
        this.instructionMap.set(0xA2, {
            name: "AND D",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.D);
            }
        });
        this.instructionMap.set(0xA3, {
            name: "AND E",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.E);
            }
        });
        this.instructionMap.set(0xA4, {
            name: "AND H",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.H);
            }
        });
        this.instructionMap.set(0xA5, {
            name: "AND L",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.L);
            }
        });
        this.instructionMap.set(0xA6, {
            name: "AND (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.andFromMemory(this.registers.HL);
            }
        });
        this.instructionMap.set(0xA7, {
            name: "AND A",
            cycleTime: 4,
            operation: () => {
                this.registers.and(this.registers.A);
            }
        });
        this.instructionMap.set(0xA8, {
            name: "XOR B",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.B);
            }
        });
        this.instructionMap.set(0xA9, {
            name: "XOR C",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.C);
            }
        });
        this.instructionMap.set(0xAA, {
            name: "XOR D",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.D);
            }
        });
        this.instructionMap.set(0xAB, {
            name: "XOR E",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.E);
            }
        });
        this.instructionMap.set(0xAC, {
            name: "XOR H",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.H);
            }
        });
        this.instructionMap.set(0xAD, {
            name: "XOR L",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.L);
            }
        });
        this.instructionMap.set(0xAE, {
            name: "XOR (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.xorFromMemory(this.registers.HL);
            }
        });
        this.instructionMap.set(0xAF, {
            name: "XOR A",
            cycleTime: 4,
            operation: () => {
                this.registers.xor(this.registers.A);
            }
        });
        this.instructionMap.set(0xB0, {
            name: "OR B",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.B);
            }
        });
        this.instructionMap.set(0xB1, {
            name: "OR C",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.C);
            }
        });
        this.instructionMap.set(0xB2, {
            name: "OR D",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.D);
            }
        });
        this.instructionMap.set(0xB3, {
            name: "OR E",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.E);
            }
        });
        this.instructionMap.set(0xB4, {
            name: "OR H",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.H);
            }
        });
        this.instructionMap.set(0xB5, {
            name: "OR L",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.L);
            }
        });
        this.instructionMap.set(0xB6, {
            name: "OR (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.orFromMemory(this.registers.HL);
            }
        });
        this.instructionMap.set(0xB7, {
            name: "OR A",
            cycleTime: 4,
            operation: () => {
                this.registers.or(this.registers.A);
            }
        });
        this.instructionMap.set(0xB8, {
            name: "CP B",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.B);
            }
        });
        this.instructionMap.set(0xB9, {
            name: "CP C",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.C);
            }
        });
        this.instructionMap.set(0xBA, {
            name: "CP D",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.D);
            }
        });
        this.instructionMap.set(0xBB, {
            name: "CP E",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.E);
            }
        });
        this.instructionMap.set(0xBC, {
            name: "CP H",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.H);
            }
        });
        this.instructionMap.set(0xBD, {
            name: "CP L",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.L);
            }
        });
        this.instructionMap.set(0xBE, {
            name: "CP (HL)",
            cycleTime: 8,
            operation: () => {
                this.registers.compareFromRegisterAddr(this.registers.HL);
            }
        });
        this.instructionMap.set(0xBF, {
            name: "CP A",
            cycleTime: 4,
            operation: () => {
                this.registers.compare(this.registers.A);
            }
        });
        this.instructionMap.set(0xC0, {
            name: "RET NZ",
            get cycleTime() {
                return !registers.F.zero ? 20 : 8;
            },
            operation: () => {
                this.registers.returnFromFunctionIfNotZero();
            }
        });
        this.instructionMap.set(0xC1, {
            name: "POP BC",
            cycleTime: 12,
            operation: () => {
                this.registers.popToRegister(this.registers.BC);
            }
        });
        this.instructionMap.set(0xC2, {
            get name() {
                return `JP NZ, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return !registers.F.zero ? 16 : 12;
            },
            operation: () => {
                this.registers.jumpIfNotZero();
            }
        });
        this.instructionMap.set(0xC3, {
            get name() {
                return `JP 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            cycleTime: 16,
            operation: () => {
                this.registers.jump();
            }
        });
        this.instructionMap.set(0xC4, {
            get name() {
                return `CALL NZ, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return !registers.F.zero ? 24 : 12;
            },
            operation: () => {
                this.registers.callFunctionIfNotZero();
            }
        });
        this.instructionMap.set(0xC5, {
            name: "PUSH BC",
            cycleTime: 16,
            operation: () => {
                this.registers.pushFromRegister(this.registers.BC);
            }
        });
        this.instructionMap.set(0xC6, {
            get name() {
                return `ADD A, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.addImmediate(this.registers.A);
            }
        });
        this.instructionMap.set(0xC7, {
            name: "RST 00H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0);
            }
        });
        this.instructionMap.set(0xC8, {
            name: "RET Z",
            get cycleTime() {
                return registers.F.zero ? 20 : 8;
            },
            operation: () => {
                this.registers.returnFromFunctionIfZero();
            }
        });
        this.instructionMap.set(0xC9, {
            name: "RET",
            cycleTime: 16,
            operation: () => {
                this.registers.returnFromFunction();
            }
        });
        this.instructionMap.set(0xCA, {
            get name() {
                return `JP Z, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return registers.F.zero ? 16 : 12;
            },
            operation: () => {
                this.registers.jumpIfZero();
            }
        });
        this.instructionMap.set(0xCB, {
            name: "PREFIX CB",
            cycleTime: 0,
            operation: () => {
            }
        });
        this.instructionMap.set(0xCC, {
            get name() {
                return `CALL Z, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return registers.F.zero ? 24 : 12;
            },
            operation: () => {
                this.registers.callFunctionIfZero();
            }
        });
        this.instructionMap.set(0xCD, {
            get name() {
                return `CALL 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            cycleTime: 24,
            operation: () => {
                this.registers.callFunction();
            }
        });
        this.instructionMap.set(0XCE, {
            get name() {
                return `ADC A, 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.addWithCarryImmediate();
            }
        });
        this.instructionMap.set(0xCF, {
            name: "RST 08H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x8);
            }
        });
        this.instructionMap.set(0xD0, {
            name: "RET NC",
            get cycleTime() {
                return !registers.F.carry ? 20 : 8;
            },
            operation: () => {
                this.registers.returnFromFunctionIfNotCarry();
            }
        });
        this.instructionMap.set(0xD1, {
            name: "POP DE",
            cycleTime: 12,
            operation: () => {
                this.registers.popToRegister(this.registers.DE);
            }
        });
        this.instructionMap.set(0xD2, {
            get name() {
                return `JP NC 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return !registers.F.carry ? 16 : 12;
            },
            operation: () => {
                this.registers.jumpIfNotCarry();
            }
        });
        // 0xD3 has no instruction
        this.instructionMap.set(0xD4, {
            get name() {
                return `CALL NC, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return !registers.F.carry ? 24 : 12;
            },
            operation: () => {
                this.registers.callFunctionIfNotCarry();
            }
        });
        this.instructionMap.set(0xD5, {
            name: "PUSH DE",
            cycleTime: 16,
            operation: () => {
                this.registers.pushFromRegister(this.registers.DE);
            }
        });
        this.instructionMap.set(0xD6, {
            get name() {
                return `SUB 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.subtractImmediate();
            }
        });
        this.instructionMap.set(0xD7, {
            name: "RST 10H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x10);
            }
        });
        this.instructionMap.set(0xD8, {
            name: "RET C",
            get cycleTime() {
                return registers.F.carry ? 20 : 8;
            },
            operation: () => {
                this.registers.returnFromFunctionIfCarry();
            }
        });
        this.instructionMap.set(0xD9, {
            name: "RETI",
            cycleTime: 16,
            operation: () => {
                this.registers.returnFromFunction();
                this.interruptMasterEnabled = true;
            }
        });
        this.instructionMap.set(0xDA, {
            get name() {
                return `JP C, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return registers.F.carry ? 16 : 12;
            },
            operation: () => {
                this.registers.jumpIfCarry();
            }
        });
        // 0xDB has no instruction
        this.instructionMap.set(0xDC, {
            get name() {
                return `CALL C, 0x${memory.readWord(registers.PC.value).toString(16)}`;
            },
            get cycleTime() {
                return registers.F.carry ? 24 : 12;
            },
            operation: () => {
                this.registers.callFunctionIfCarry();
            }
        });
        // 0xDD has no instruction
        this.instructionMap.set(0xDE, {
            get name() {
                return `SBC A, ${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.subtractWithCarryImmediate();
            }
        });
        this.instructionMap.set(0xDF, {
            name: "RST 18H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x18);
            }
        });
        this.instructionMap.set(0xE0, {
            get name() {
                return `LDH (0xff00 + 0x${memory.readByte(registers.PC.value).toString(16)}), A`;
            },
            cycleTime: 0,
            operation: () => {
                this.registers.writeToMemory8Bit(this.registers.A);
            }
        });
        this.instructionMap.set(0xE1, {
            name: "POP HL",
            cycleTime: 12,
            operation: () => {
                this.registers.popToRegister(this.registers.HL);
            }
        });
        this.instructionMap.set(0xE2, {
            name: "LDH (C), A",
            cycleTime: 8,
            operation: () => {
                this.registers.writeToMemoryRegisterAddr8bit(this.registers.C, this.registers.A);
            }
        });
        // 0xE3 has no instruction
        // 0xE4 has no instruction
        this.instructionMap.set(0xE5, {
            name: "PUSH HL",
            cycleTime: 16,
            operation: () => {
                this.registers.pushFromRegister(this.registers.HL);
            }
        });
        this.instructionMap.set(0xE6, {
            get name() {
                return `AND 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.andImmediate();
            }
        });
        this.instructionMap.set(0xE7, {
            name: "RST 20H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x20);
            }
        });
        this.instructionMap.set(0xE8, {
            get name() {
                return `ADD SP, 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 16,
            operation: () => {
                this.registers.addImmediateSigned(this.registers.SP);
            }
        });
        this.instructionMap.set(0xE9, {
            name: "JP (HL)",
            cycleTime: 4,
            operation: () => {
                this.registers.jumpToRegisterAddr();
            }
        });
        this.instructionMap.set(0xEA, {
            get name() {
                return `LD (${memory.readWord(registers.PC.value).toString(16)}), A`;
            },
            cycleTime: 0,
            operation: () => {
                this.registers.writeToMemory16bit(this.registers.A);
            }
        });
        // 0xEB has no instruction
        // 0xEC has no instruction
        // 0xED has no instruction
        this.instructionMap.set(0xEE, {
            get name() {
                return `XOR 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.xorImmediate();
            }
        });
        this.instructionMap.set(0xEF, {
            name: "RST 28H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x28);
            }
        });
        this.instructionMap.set(0xF0, {
            get name() {
                return `LDH A, (0x${memory.readByte(registers.PC.value).toString(16)})`;
            },
            cycleTime: 0,
            operation: () => {
                this.registers.loadFromBase(this.registers.A);
            }
        });
        this.instructionMap.set(0xF1, {
            name: "POP AF",
            cycleTime: 12,
            operation: () => {
                this.registers.popToRegister(this.registers.AF);
            }
        });
        this.instructionMap.set(0xF2, {
            name: "LD A, (C)",
            cycleTime: 8,
            operation: () => {
                this.registers.loadByte8Bit(this.registers.A, this.registers.C);
            }
        });
        this.instructionMap.set(0xF3, {
            name: "DI",
            cycleTime: 4,
            operation: () => {
                this.interruptMasterEnabled = false;
            }
        });
        // 0xF4 has no instruction
        this.instructionMap.set(0xF5, {
            name: "PUSH AF",
            cycleTime: 16,
            operation: () => {
                this.registers.pushFromRegister(this.registers.AF);
            }
        });
        this.instructionMap.set(0xF6, {
            get name() {
                return `OR ${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.orImmediate();
            }
        });
        this.instructionMap.set(0xF7, {
            name: "RST 30H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x30);
            }
        });
        this.instructionMap.set(0xF8, {
            get name() {
                return `LD HL, SP + 0x${memory.readSignedByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 12,
            operation: () => {
                this.registers.loadHLStackPointer();
            }
        });
        this.instructionMap.set(0xF9, {
            name: "LD SP, HL",
            cycleTime: 8,
            operation: () => {
                this.registers.load(this.registers.SP, this.registers.HL);
            }
        });
        this.instructionMap.set(0xFA, {
            get name() {
                return `LD A, (0x${memory.readWord(registers.PC.value).toString(16)})`;
            },
            cycleTime: 0,
            operation: () => {
                this.registers.loadFrom16bitAddr(this.registers.A);
            }
        });
        this.instructionMap.set(0xFB, {
            name: "EI",
            cycleTime: 4,
            operation: () => {
                this.interruptMasterEnabled = true;
            }
        });
        // 0xFC has no instruction
        // 0xFD has no instruction
        this.instructionMap.set(0xFE, {
            get name() {
                return `CP 0x${memory.readByte(registers.PC.value).toString(16)}`;
            },
            cycleTime: 8,
            operation: () => {
                this.registers.compareImmediate();
            }
        });
        this.instructionMap.set(0xFF, {
            name: "RST 38H",
            cycleTime: 16,
            operation: () => {
                this.registers.restart(0x38);
            }
        });
    }
    exports.setInstructionMap = setInstructionMap;
});
define("cpu/CPU", ["require", "exports", "Gameboy", "misc/BitOperations", "cpu/CPURegisters", "cpu/setCbMap", "cpu/setInstructionMap"], function (require, exports, Gameboy_1, BitOperations_8, CPURegisters_1, setCbMap_1, setInstructionMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CPU = void 0;
    // see https://gbdev.gg8.se/wiki/articles/Interrupts
    const VBLANK_INTERRUPT_ADDRESS = 0x40;
    const LCD_INTERRUPT_ADDRESS = 0x48;
    const TIMER_INTERRUPT_ADDRESS = 0x50;
    const SERIAL_INTERRUPT_ADDRESS = 0x58;
    const JOYPAD_INTERRUPT_ADDRESS = 0x60;
    class CPU {
        memory;
        registers;
        isStopped = false;
        isHalted = false;
        interruptMasterEnabled = true;
        setInstructionMap = setInstructionMap_1.setInstructionMap;
        setCbMap = setCbMap_1.setCbMap;
        instructionMap = new Map();
        cbMap = new Map();
        counter = 0;
        timerCycles = 0;
        isDoubleSpeed = false;
        gpu;
        apu;
        constructor(memory, gpu, apu) {
            this.registers = new CPURegisters_1.CPURegisters(memory, this);
            this.memory = memory;
            this.gpu = gpu;
            this.apu = apu;
            this.setInstructionMap();
            this.setCbMap();
        }
        loadCartridge(arrayBuffer) {
            const gameDataView = new DataView(arrayBuffer);
            const isGBC = this.memory.loadCartridge(gameDataView);
            this.initialize();
            return isGBC;
        }
        initialize() {
            this.memory.reset();
            this.registers.initialize();
            Gameboy_1.Gameboy.frames = 0;
        }
        updateTimers(cycles) {
            const { timerControlRegister, dividerRegister, timerCounterRegister, interruptRequestRegister, timerModuloRegister } = this.registers;
            this.counter = (this.counter + cycles) & 0xffff;
            const msb = (this.counter >> 8) & 0xff;
            dividerRegister.overrideValue = msb;
            if (!timerControlRegister.isTimerEnabled()) {
                return;
            }
            this.timerCycles += cycles;
            while (this.timerCycles >= timerControlRegister.getClockFrequency()) {
                this.timerCycles -= timerControlRegister.getClockFrequency();
                // if overflow happens
                if (timerCounterRegister.value === 0xff) {
                    interruptRequestRegister.triggerTimerRequest();
                    timerCounterRegister.value = timerModuloRegister.value;
                }
                else {
                    timerCounterRegister.value++;
                }
            }
        }
        checkInterrupts() {
            const { interruptRequestRegister, interruptEnableRegister } = this.registers;
            const hasInterrupts = interruptEnableRegister.value & interruptRequestRegister.value;
            if (hasInterrupts > 0) {
                this.isHalted = false;
            }
            if (this.interruptMasterEnabled) {
                if (interruptEnableRegister.isVBlankInterruptEnabled() && interruptRequestRegister.vBlankInterruptRequest()) {
                    interruptRequestRegister.clearVBlankRequest();
                    this.registers.pushToStack(this.registers.PC.value);
                    this.registers.PC.value = VBLANK_INTERRUPT_ADDRESS;
                    this.interruptMasterEnabled = false;
                }
                else if (interruptEnableRegister.isLCDStatInterruptEnabled() && interruptRequestRegister.lcdStatInterruptRequest()) {
                    this.registers.pushToStack(this.registers.PC.value);
                    interruptRequestRegister.clearLcdStatRequest();
                    this.registers.PC.value = LCD_INTERRUPT_ADDRESS;
                    this.interruptMasterEnabled = false;
                }
                else if (interruptEnableRegister.isTimerInterruptEnabled() && interruptRequestRegister.timerInterruptRequest()) {
                    this.registers.pushToStack(this.registers.PC.value);
                    interruptRequestRegister.clearTimerRequest();
                    this.registers.PC.value = TIMER_INTERRUPT_ADDRESS;
                    this.interruptMasterEnabled = false;
                }
                else if (interruptEnableRegister.isSerialInterruptEnabled() && interruptRequestRegister.serialInterruptRequest()) {
                    this.registers.pushToStack(this.registers.PC.value);
                    interruptRequestRegister.clearSerialRequest();
                    this.registers.PC.value = SERIAL_INTERRUPT_ADDRESS;
                    this.interruptMasterEnabled = false;
                }
                else if (interruptEnableRegister.isJoypadInterruptEnabled() && interruptRequestRegister.joypadInterruptRequest()) {
                    this.registers.pushToStack(this.registers.PC.value);
                    interruptRequestRegister.clearJoypadRequest();
                    this.registers.PC.value = JOYPAD_INTERRUPT_ADDRESS;
                    this.interruptMasterEnabled = false;
                }
            }
        }
        checkIfDoubleSpeed() {
            const speedSwitch = this.memory.readByte(0xff4d);
            if ((0, BitOperations_8.getBit)(speedSwitch, 7) === 1) {
                this.isDoubleSpeed = true;
            }
            else {
                this.isDoubleSpeed = false;
            }
        }
        performCbInstruction() {
            const cbOpCode = this.memory.readByte(this.registers.PC.value);
            const cbInstruction = this.cbMap.get(cbOpCode);
            if (cbInstruction == null) {
                throw new Error(`Invalid CB op code: 0x${cbOpCode.toString(16)}`);
            }
            const previousAddress = this.registers.PC.hexValue;
            this.registers.PC.value++;
            if (Gameboy_1.Gameboy.shouldOutputLogs) {
                console.log(`found instruction ${cbInstruction.name} with code 0x${cbOpCode.toString(16)} at address ${previousAddress}`);
            }
            cbInstruction.operation();
            return cbInstruction.cycleTime;
        }
        tick() {
            try {
                const opCode = this.memory.readByte(this.registers.PC.value);
                const instruction = this.instructionMap.get(opCode);
                if (instruction != null) {
                    const previousAddress = this.registers.PC.hexValue;
                    this.registers.PC.value++;
                    if (Gameboy_1.Gameboy.shouldOutputLogs) {
                        console.log(`found instruction ${instruction.name} with code 0x${opCode.toString(16)} at address ${previousAddress}`);
                    }
                    instruction.operation();
                    let cycles = instruction.cycleTime;
                    if (instruction.name === "PREFIX CB") {
                        this.performCbInstruction();
                    }
                    if (this.isDoubleSpeed) {
                        cycles = cycles / 2;
                    }
                    return cycles;
                }
                else {
                    throw new Error(`invalid instruction code: 0x${opCode.toString(16).toUpperCase()}`);
                }
            }
            catch (e) {
                console.log(`execution failed at frame ${Gameboy_1.Gameboy.frames}`);
                throw e;
            }
        }
        cycle(cycles) {
            this.updateTimers(cycles);
            this.gpu.tick(cycles);
            this.apu.tick(cycles);
        }
        step() {
            this.checkInterrupts();
            this.checkIfDoubleSpeed();
            if (this.isHalted) {
                this.cycle(4);
                return 4;
            }
            const cycles = this.tick();
            if (cycles !== 0) {
                this.cycle(cycles);
            }
            return cycles;
        }
    }
    exports.CPU = CPU;
});
define("joypad/Joypad", ["require", "exports", "cpu/memory_registers/JoypadRegister"], function (require, exports, JoypadRegister_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Joypad = void 0;
    var GamepadButtons;
    (function (GamepadButtons) {
        GamepadButtons[GamepadButtons["A"] = 0] = "A";
        GamepadButtons[GamepadButtons["B"] = 1] = "B";
        GamepadButtons[GamepadButtons["X"] = 2] = "X";
        GamepadButtons[GamepadButtons["Y"] = 3] = "Y";
        GamepadButtons[GamepadButtons["LB"] = 4] = "LB";
        GamepadButtons[GamepadButtons["RB"] = 5] = "RB";
        GamepadButtons[GamepadButtons["LT"] = 6] = "LT";
        GamepadButtons[GamepadButtons["RT"] = 7] = "RT";
        GamepadButtons[GamepadButtons["Select"] = 8] = "Select";
        GamepadButtons[GamepadButtons["Start"] = 9] = "Start";
        GamepadButtons[GamepadButtons["L3"] = 10] = "L3";
        GamepadButtons[GamepadButtons["R3"] = 11] = "R3";
        GamepadButtons[GamepadButtons["Up"] = 12] = "Up";
        GamepadButtons[GamepadButtons["Down"] = 13] = "Down";
        GamepadButtons[GamepadButtons["Left"] = 14] = "Left";
        GamepadButtons[GamepadButtons["Right"] = 15] = "Right";
    })(GamepadButtons || (GamepadButtons = {}));
    class Joypad {
        gamepad;
        constructor(gamepad) {
            this.gamepad = gamepad;
        }
        static isUpKeyPressed = false;
        static isDownKeyPressed = false;
        static isRightKeyPressed = false;
        static isLeftKeyPressed = false;
        static isEnterKeyPressed = false;
        static isShiftKeyPressed = false;
        static isSKeyPressed = false;
        static isAKeyPressed = false;
        static handleInput() {
            const gamepad = navigator.getGamepads()[0];
            const joypad = new Joypad(gamepad);
            JoypadRegister_2.joypadRegister.isPressingLeft = joypad.isPressingLeft();
            JoypadRegister_2.joypadRegister.isPressingRight = joypad.isPressingRight();
            JoypadRegister_2.joypadRegister.isPressingDown = joypad.isPressingDown();
            JoypadRegister_2.joypadRegister.isPressingUp = joypad.isPressingUp();
            JoypadRegister_2.joypadRegister.isPressingA = joypad.isPressingA();
            JoypadRegister_2.joypadRegister.isPressingB = joypad.isPressingB();
            JoypadRegister_2.joypadRegister.isPressingSelect = joypad.isPressingSelect();
            JoypadRegister_2.joypadRegister.isPressingStart = joypad.isPressingStart();
        }
        isPressingLeft() {
            const axes = this.gamepad?.axes[0] || 0;
            return this.gamepad?.buttons[GamepadButtons.Left].pressed || axes < -0.1 || Joypad.isLeftKeyPressed;
        }
        isPressingRight() {
            const axes = this.gamepad?.axes[0] || 0;
            return this.gamepad?.buttons[GamepadButtons.Right]?.pressed || axes > 0.1 || Joypad.isRightKeyPressed;
        }
        isPressingUp() {
            const axes = this.gamepad?.axes[1] || 0;
            return this.gamepad?.buttons[GamepadButtons.Up].pressed || axes < -0.1 || Joypad.isUpKeyPressed;
        }
        isPressingDown() {
            const axes = this.gamepad?.axes[1] || 0;
            return this.gamepad?.buttons[GamepadButtons.Down].pressed || axes > 0.1 || Joypad.isDownKeyPressed;
        }
        isPressingA() {
            return this.gamepad?.buttons[GamepadButtons.A].pressed || Joypad.isSKeyPressed;
        }
        isPressingB() {
            return this.gamepad?.buttons[GamepadButtons.X].pressed || Joypad.isAKeyPressed;
        }
        isPressingStart() {
            return this.gamepad?.buttons[GamepadButtons.Start].pressed || Joypad.isEnterKeyPressed;
        }
        isPressingSelect() {
            return this.gamepad?.buttons[GamepadButtons.Select].pressed || Joypad.isShiftKeyPressed;
        }
    }
    exports.Joypad = Joypad;
});
define("Gameboy", ["require", "exports", "apu/APU", "cpu/CPU", "cpu/Memory", "gpu/GPU", "joypad/Joypad"], function (require, exports, APU_1, CPU_1, Memory_2, GPU_1, Joypad_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Gameboy = void 0;
    const memory = new Memory_2.Memory();
    const MAX_FPS = 60;
    const INTERVAL = 1000 / MAX_FPS;
    class Gameboy {
        gpu = new GPU_1.GPU(memory);
        cpu = new CPU_1.CPU(memory, this.gpu, new APU_1.APU(memory));
        fps = 0;
        cycles = 0;
        previousTime = 0;
        static frames = 0;
        static shouldOutputLogs = false;
        isRunning = true;
        loadCartridge(arrayBuffer) {
            const isGBC = this.cpu.loadCartridge(arrayBuffer);
            this.gpu.isGBC = isGBC;
        }
        run() {
            const context = document.querySelector("canvas")?.getContext('2d');
            this.initializeKeyboardInputs();
            if (context != null) {
                requestAnimationFrame((time) => this.execute(time, context));
            }
            else {
                throw new Error("canvas context is null!");
            }
        }
        initializeKeyboardInputs() {
            document.addEventListener("keyup", (e) => {
                e.preventDefault();
                switch (e.key) {
                    case "ArrowDown":
                        Joypad_1.Joypad.isDownKeyPressed = false;
                        break;
                    case "ArrowUp":
                        Joypad_1.Joypad.isUpKeyPressed = false;
                        break;
                    case "ArrowLeft":
                        Joypad_1.Joypad.isLeftKeyPressed = false;
                        break;
                    case "ArrowRight":
                        Joypad_1.Joypad.isRightKeyPressed = false;
                        break;
                    case "Enter":
                        Joypad_1.Joypad.isEnterKeyPressed = false;
                        break;
                    case "Shift":
                        Joypad_1.Joypad.isShiftKeyPressed = false;
                        break;
                    case "s":
                        Joypad_1.Joypad.isSKeyPressed = false;
                        break;
                    case "a":
                        Joypad_1.Joypad.isAKeyPressed = false;
                        break;
                }
            });
            document.addEventListener("keydown", (e) => {
                e.preventDefault();
                switch (e.key) {
                    case "ArrowDown":
                        Joypad_1.Joypad.isDownKeyPressed = true;
                        break;
                    case "ArrowUp":
                        Joypad_1.Joypad.isUpKeyPressed = true;
                        break;
                    case "ArrowLeft":
                        Joypad_1.Joypad.isLeftKeyPressed = true;
                        break;
                    case "ArrowRight":
                        Joypad_1.Joypad.isRightKeyPressed = true;
                        break;
                    case "Enter":
                        Joypad_1.Joypad.isEnterKeyPressed = true;
                        break;
                    case "Shift":
                        Joypad_1.Joypad.isShiftKeyPressed = true;
                        break;
                    case "s":
                        Joypad_1.Joypad.isSKeyPressed = true;
                        break;
                    case "a":
                        Joypad_1.Joypad.isAKeyPressed = true;
                        break;
                }
            });
        }
        execute(currentTime, context) {
            const diff = currentTime - this.previousTime;
            if (diff >= INTERVAL || this.previousTime === 0) {
                this.fps = 1000 / diff;
                this.previousTime = currentTime - (diff % INTERVAL);
                while (this.cycles <= GPU_1.GPU.CyclesPerFrame) {
                    this.cycles += this.cpu.step();
                }
                Joypad_1.Joypad.handleInput();
                context.putImageData(this.gpu.screen, 0, 0);
                Gameboy.frames++;
                this.cycles %= GPU_1.GPU.CyclesPerFrame;
            }
            if (this.isRunning) {
                requestAnimationFrame((time) => this.execute(time, context));
            }
        }
    }
    exports.Gameboy = Gameboy;
});
define("main", ["require", "exports", "Gameboy"], function (require, exports, Gameboy_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const romInput = document.getElementById("rom-input");
    romInput?.addEventListener("change", (e) => {
        handleFileChange(e);
    });
    let gameboy = null;
    async function handleFileChange(e) {
        gameboy = new Gameboy_2.Gameboy();
        const files = e.target?.files;
        if (files != null) {
            const file = files[0];
            let rom = await fileToArrayBuffer(file);
            if (rom != null) {
                gameboy.loadCartridge(rom);
                gameboy.run();
            }
        }
    }
    function loadRom() {
        document.getElementById("rom-input")?.click();
    }
    function enterFullScreen() {
        document.documentElement.requestFullscreen();
    }
    function showControlsModal() {
        const modal = document.getElementById("modal");
        if (modal != null) {
            modal.style.display = "block";
        }
    }
    function hideControlsModal() {
        const modal = document.getElementById("modal");
        if (modal != null) {
            modal.style.display = "none";
        }
    }
    function fileToArrayBuffer(file) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = () => {
                fileReader.abort();
                reject(new Error("Error parsing file"));
            };
            fileReader.readAsArrayBuffer(file);
        });
    }
});
define("apu/channels/StereoChannel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StereoChannel = void 0;
    var StereoChannel;
    (function (StereoChannel) {
        StereoChannel[StereoChannel["Left"] = 0] = "Left";
        StereoChannel[StereoChannel["Right"] = 1] = "Right";
    })(StereoChannel || (exports.StereoChannel = StereoChannel = {}));
});
