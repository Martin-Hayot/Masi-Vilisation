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
exports.authService = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_1 = require("../repositories/user");
var auth_1 = require("../utils/auth");
if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET environment variable is required');
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET environment variable is required');
}
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
var ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
var REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
exports.authService = {
    login: function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValid, accessToken, refreshToken, safeUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.userRepository.getUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Invalid email or password');
                        }
                        return [4 /*yield*/, (0, auth_1.verifyPassword)(password, user.password)];
                    case 2:
                        isValid = _a.sent();
                        if (!isValid) {
                            throw new Error('Invalid email or password');
                        }
                        accessToken = this.generateAccessToken(user);
                        refreshToken = this.generateRefreshToken(user);
                        safeUser = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                        };
                        return [2 /*return*/, {
                                user: safeUser,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                            }];
                }
            });
        });
    },
    /**
     * Refresh an access token using a valid refresh token.
     *
     * Returns an object containing a new access token.
     * Optionally you can rotate refresh tokens by also returning a new refresh token here.
     */
    refresh: function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, userId, user, accessToken, newRefreshToken, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        payload = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
                        if (typeof payload === 'string') {
                            throw new Error('Invalid refresh token payload');
                        }
                        if (!payload ||
                            payload.type !== 'refresh' ||
                            !payload.sub) {
                            throw new Error('Invalid refresh token');
                        }
                        userId = payload.sub;
                        return [4 /*yield*/, user_1.userRepository.getUserById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found for refresh token');
                        }
                        accessToken = this.generateAccessToken(user);
                        newRefreshToken = this.generateRefreshToken(user);
                        return [2 /*return*/, { accessToken: accessToken, refreshToken: newRefreshToken }];
                    case 2:
                        err_1 = _a.sent();
                        // Normalize errors so handlers can decide proper HTTP responses
                        if (err_1.name === 'TokenExpiredError') {
                            throw new Error('Refresh token expired');
                        }
                        if (err_1.name === 'JsonWebTokenError') {
                            throw new Error('Invalid refresh token');
                        }
                        throw new Error(err_1.message || 'Failed to refresh access token');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    generateAccessToken: function (user) {
        try {
            var token = jsonwebtoken_1.default.sign({
                sub: user.id,
                username: user.username,
                type: 'access',
            }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
            return token;
        }
        catch (err) {
            throw new Error('Failed to generate access token');
        }
    },
    generateRefreshToken: function (user) {
        try {
            var token = jsonwebtoken_1.default.sign({
                sub: user.id,
                username: user.username,
                type: 'refresh',
            }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
            return token;
        }
        catch (err) {
            throw new Error('Failed to generate refresh token');
        }
    },
};
//# sourceMappingURL=auth.js.map