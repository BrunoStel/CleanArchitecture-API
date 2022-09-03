"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptRoute = void 0;
const adaptRoute = (controller) => {
    return async (request, response) => {
        const httpRequest = {
            body: request.body
        };
        const httpReponse = await controller.handle(httpRequest);
        response.status(httpReponse.statusCode).json(httpReponse.body);
    };
};
exports.adaptRoute = adaptRoute;
//# sourceMappingURL=express-route-adapter.js.map