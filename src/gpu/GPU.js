"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPU = void 0;
const Memory_1 = require("../cpu/Memory");
const InterruptRequestRegister_1 = require("../cpu/memory_registers/InterruptRequestRegister");
const BitOperations_1 = require("../misc/BitOperations");
const GPURegisters_1 = require("./registers/GPURegisters");
const OAMTable_1 = require("./registers/OAMTable");
const LCDMode_1 = require("./registers/lcd_status/LCDMode");
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
        return (0, BitOperations_1.getBit)(value, 7) === 1 && value !== 0xff;
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
            const tileVramBankNumber = (0, BitOperations_1.getBit)(tileByteAttributes, 3);
            const xFlip = (0, BitOperations_1.getBit)(tileByteAttributes, 5);
            const yFlip = (0, BitOperations_1.getBit)(tileByteAttributes, 6);
            const bgToOamPriority = (0, BitOperations_1.getBit)(tileByteAttributes, 7);
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
            const lowerBit = (0, BitOperations_1.getBit)(lowerByte, bitIndex);
            const upperBit = (0, BitOperations_1.getBit)(upperByte, bitIndex) << 1;
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
            const tileVramBankNumber = (0, BitOperations_1.getBit)(tileByteAttributes, 3);
            const xFlip = (0, BitOperations_1.getBit)(tileByteAttributes, 5);
            const yFlip = (0, BitOperations_1.getBit)(tileByteAttributes, 6);
            const bgToOamPriority = (0, BitOperations_1.getBit)(tileByteAttributes, 7);
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
                const lowerBit = (0, BitOperations_1.getBit)(lowerByte, bitPos);
                const upperBit = (0, BitOperations_1.getBit)(upperByte, bitPos) << 1;
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
            const tileIndex = lcdControlRegister.objSize() === 16 ? (0, BitOperations_1.resetBit)(sprite.tileIndex, 0) : sprite.tileIndex;
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
                const lowerBit = (0, BitOperations_1.getBit)(lowerByte, bitPos);
                const upperBit = (0, BitOperations_1.getBit)(upperByte, bitPos) << 1;
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
            const tileIndex = lcdControlRegister.objSize() === 16 ? (0, BitOperations_1.resetBit)(sprite.tileIndex, 0) : sprite.tileIndex;
            const tileBytePosition = tileIndex * 16;
            const tileYBytePosition = yPosInTile * 2;
            const tileAddress = tileBytePosition + tileYBytePosition + tileMapStartAddress;
            const lowerByte = this.memory.readByte(tileAddress);
            const upperByte = this.memory.readByte(tileAddress + 1);
            const paletteColors = sprite.paletteNumber === 0 ? this.registers.objectPaletteRegister0.colors : this.registers.objectPaletteRegister1.colors;
            for (let i = 0; i < 8; i++) {
                const bitPos = sprite.isXFlipped ? i : 7 - i;
                const lowerBit = (0, BitOperations_1.getBit)(lowerByte, bitPos);
                const upperBit = (0, BitOperations_1.getBit)(upperByte, bitPos) << 1;
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
                const lowerBit = (0, BitOperations_1.getBit)(lowerByte, bitIndex);
                const upperBit = (0, BitOperations_1.getBit)(upperByte, bitIndex) << 1;
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
                const lowerBit = (0, BitOperations_1.getBit)(lowerByte, i);
                const upperBit = (0, BitOperations_1.getBit)(upperByte, i) << 1;
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
