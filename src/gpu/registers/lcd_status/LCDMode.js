"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCDMode = void 0;
var LCDMode;
(function (LCDMode) {
    LCDMode[LCDMode["HBlank"] = 0] = "HBlank";
    LCDMode[LCDMode["VBlank"] = 1] = "VBlank";
    LCDMode[LCDMode["SearchingOAM"] = 2] = "SearchingOAM";
    LCDMode[LCDMode["TransferringToLCD"] = 3] = "TransferringToLCD";
})(LCDMode = exports.LCDMode || (exports.LCDMode = {}));
