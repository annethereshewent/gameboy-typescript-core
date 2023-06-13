"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPURegisters = void 0;
const BackgroundPaletteRegister_1 = require("./BackgroundPaletteRegister");
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
const LCDControlRegister_1 = require("./LCDControlRegister");
const ObjectPaletteRegister_1 = require("./ObjectPaletteRegister");
const LCDStatusRegister_1 = require("./lcd_status/LCDStatusRegister");
const BackgroundPaletteIndexRegister_1 = require("./BackgroundPaletteIndexRegister");
const ObjectPaletteIndexRegister_1 = require("./ObjectPaletteIndexRegister");
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
        this.lineYRegister = new MemoryRegister_1.MemoryRegister(0xff44, memory, "lineYRegister");
        this.lcdControlRegister = new LCDControlRegister_1.LCDControlRegister(memory);
        this.scrollYRegister = new MemoryRegister_1.MemoryRegister(0xff42, memory, "scrollYRegister");
        this.scrollXRegister = new MemoryRegister_1.MemoryRegister(0xff43, memory, "scrollXRegister");
        this.lineYCompareRegister = new MemoryRegister_1.MemoryRegister(0xff45, memory, "lineYCompareRegister");
        this.windowYRegister = new MemoryRegister_1.MemoryRegister(0xff4a, memory, "windowYRegister");
        this.windowXRegister = new MemoryRegister_1.MemoryRegister(0xff4b, memory, "windowXRegister");
        this.backgroundPaletteRegister = new BackgroundPaletteRegister_1.BackgroundPaletteRegister(memory);
        this.objectPaletteRegister0 = new ObjectPaletteRegister_1.ObjectPaletteRegister(0xff48, memory, "objetPaletteRegister0");
        this.objectPaletteRegister1 = new ObjectPaletteRegister_1.ObjectPaletteRegister(0xff49, memory, "objectPaletteRegister1");
        this.backgroundPaletteIndexRegister = new BackgroundPaletteIndexRegister_1.BackgroundPaletteIndexRegister(memory);
        this.objectPaletteIndexRegister = new ObjectPaletteIndexRegister_1.ObjectPaletteIndexRegister(memory);
        // default value according to docs
        this.lcdControlRegister.value = 0x83;
        this.lineYRegister.value = 0x91;
    }
}
exports.GPURegisters = GPURegisters;
