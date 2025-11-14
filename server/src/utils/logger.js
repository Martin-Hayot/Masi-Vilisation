"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(function (_a) {
        var timestamp = _a.timestamp, level = _a.level, message = _a.message, stack = _a.stack;
        if (stack) {
            return "".concat(timestamp, " [").concat(level.toUpperCase(), "]: ").concat(message, "\n").concat(stack);
        }
        return "".concat(timestamp, " [").concat(level.toUpperCase(), "]: ").concat(message);
    })),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map