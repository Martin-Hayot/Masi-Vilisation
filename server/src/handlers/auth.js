"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.logout = exports.login = void 0;
var auth_1 = require("../schemas/auth");
var logger_1 = __importDefault(require("../utils/logger"));
var auth_2 = require("../services/auth");
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var parseResult, _a, email, password, _b, user, accessToken, refreshToken, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parseResult = auth_1.LoginRequest.safeParse(req.body);
                if (!parseResult.success) {
                    logger_1.default.error("Invalid login request: ".concat(parseResult.error));
                    return [2 /*return*/, res.status(400).json({ error: parseResult.error })];
                }
                _a = parseResult.data, email = _a.email, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, auth_2.authService.login(email, password)];
            case 2:
                _b = _c.sent(), user = _b.user, accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                res.status(200).json({ user: user });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _c.sent();
                logger_1.default.error("Error during login: ".concat(err_1));
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res, next) {
    try {
        // Clear auth cookies on logout. Use the same cookie options shape as when setting them.
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.status(200).json({ message: 'Logged out' });
    }
    catch (err) {
        logger_1.default.error("Error during logout: ".concat(err));
        next(err);
    }
};
exports.logout = logout;
var refresh = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, accessToken, err_2, msg;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                refreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) ||
                    ((_b = req.body) === null || _b === void 0 ? void 0 : _b.refreshToken) ||
                    req.header('x-refresh-token');
                if (!refreshToken) {
                    return [2 /*return*/, res.status(401).json({ error: 'Refresh token required' })];
                }
                return [4 /*yield*/, auth_2.authService.refresh(refreshToken)];
            case 1:
                accessToken = (_e.sent()).accessToken;
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                // Return the new access token in the response body as well
                res.status(200).json({ accessToken: accessToken });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _e.sent();
                logger_1.default.error("Error during token refresh: ".concat(err_2));
                msg = ((_d = (_c = err_2 === null || err_2 === void 0 ? void 0 : err_2.message) === null || _c === void 0 ? void 0 : _c.toLowerCase) === null || _d === void 0 ? void 0 : _d.call(_c)) || '';
                if (msg.includes('expired') ||
                    msg.includes('invalid') ||
                    msg.includes('refresh token')) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ error: err_2.message || 'Invalid or expired refresh token' })];
                }
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.refresh = refresh;
//# sourceMappingURL=auth.js.map