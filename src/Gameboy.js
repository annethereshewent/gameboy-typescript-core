"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gameboy = void 0;
const APU_1 = require("./apu/APU");
const CPU_1 = require("./cpu/CPU");
const Memory_1 = require("./cpu/Memory");
const GPU_1 = require("./gpu/GPU");
const Joypad_1 = require("./joypad/Joypad");
const memory = new Memory_1.Memory();
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
