"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../middlewares/index");
exports.default = (app) => {
    app.use(index_1.bodyParser);
    app.use(index_1.cors);
    app.use(index_1.contentType);
};
//# sourceMappingURL=middlewares.js.map