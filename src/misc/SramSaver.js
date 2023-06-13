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
