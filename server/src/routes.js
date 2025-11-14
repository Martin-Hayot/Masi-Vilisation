"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var users_1 = require("./handlers/users");
var auth_1 = require("./handlers/auth");
var router = (0, express_1.Router)();
var userRouter = (0, express_1.Router)();
userRouter.get('/', users_1.getUsers);
userRouter.post('/', users_1.createUser);
router.use('/users', userRouter);
var authRouter = (0, express_1.Router)();
authRouter.post('/login', auth_1.login);
authRouter.post('/logout', auth_1.logout);
authRouter.post('/refresh', auth_1.refresh);
router.use('/auth', authRouter);
exports.default = router;
//# sourceMappingURL=routes.js.map