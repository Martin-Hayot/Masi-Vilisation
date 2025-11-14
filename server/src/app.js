"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Allow only the Vite dev origin:
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
app.use(routes_1.default);
// Global error handler (should be after routes)
app.use(function (err, req, res, next) {
    var statusCode = err.statusCode || 500;
    var message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;
    res.status(statusCode).json({ error: message });
});
exports.default = app;
//# sourceMappingURL=app.js.map