"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPURegisters = void 0;
const InterruptEnableRegister_1 = require("./memory_registers/InterruptEnableRegister");
const InterruptRequestRegister_1 = require("./memory_registers/InterruptRequestRegister");
const CPURegister_1 = require("./CPURegister");
const CPUFlagRegister_1 = require("./CPUFlagRegister");
const FlagsRegisterPair_1 = require("./FlagsRegisterPair");
const MemoryRegister_1 = require("./memory_registers/MemoryRegister");
const TimerControlRegister_1 = require("./memory_registers/TimerControlRegister");
const DividerRegister_1 = require("./memory_registers/DividerRegister");
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
        this.A = new CPURegister_1.CPURegister("A", 0, 1, this.registerDataView, false);
        this.B = new CPURegister_1.CPURegister("B", 0, 3, this.registerDataView, false);
        this.C = new CPURegister_1.CPURegister("C", 0, 2, this.registerDataView, false);
        this.D = new CPURegister_1.CPURegister("D", 0, 5, this.registerDataView, false);
        this.E = new CPURegister_1.CPURegister("E", 0, 4, this.registerDataView, false);
        this.F = new CPUFlagRegister_1.FlagsRegister("F", 0, 0, this.registerDataView, false);
        this.H = new CPURegister_1.CPURegister("H", 0, 7, this.registerDataView, false);
        this.L = new CPURegister_1.CPURegister("L", 0, 6, this.registerDataView, false);
        // see http://bgb.bircd.org/pandocs.htm#powerupsequence for info on initial register values
        this.AF = new FlagsRegisterPair_1.FlagsRegisterPair("AF", 0x11b0, 0, this.registerDataView, true);
        this.BC = new CPURegister_1.CPURegister("BC", 0x13, 2, this.registerDataView, true);
        this.DE = new CPURegister_1.CPURegister("DE", 0xd8, 4, this.registerDataView, true);
        this.HL = new CPURegister_1.CPURegister("HL", 0x14d, 6, this.registerDataView, true);
        // stack pointer starts at the top of the stack memory, which is at 0xfffe
        this.SP = new CPURegister_1.CPURegister("SP", 0xfffe, 8, this.registerDataView, true);
        // first 255 (0xFF) instructions in memory are reserved for the gameboy
        this.PC = new CPURegister_1.CPURegister("PC", 0x100, 10, this.registerDataView, true);
        this.memory = memory;
        // memory registers
        this.interruptEnableRegister = new InterruptEnableRegister_1.InterruptEnableRegister(memory);
        this.interruptRequestRegister = new InterruptRequestRegister_1.InterruptRequestRegister(memory);
        this.dividerRegister = new DividerRegister_1.DividerRegister(memory);
        this.timerCounterRegister = new MemoryRegister_1.MemoryRegister(0xff05, memory);
        this.timerModuloRegister = new MemoryRegister_1.MemoryRegister(0xff06, memory);
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
