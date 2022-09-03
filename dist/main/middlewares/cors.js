"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
const cors = (request, response, next) => {
    response.set('acess-control-allow-origin', '*');
    response.set('acess-control-allow-methods', '*');
    response.set('acess-control-allow-headers', '*');
    next();
};
exports.cors = cors;
//# sourceMappingURL=cors.js.map