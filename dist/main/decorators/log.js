"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogControllerDecoretor = void 0;
class LogControllerDecoretor {
    constructor(controller, logErrorRepository) {
        this.controller = controller;
        this.logErrorRepository = logErrorRepository;
    }
    async handle(httpRequest) {
        const httReponse = await this.controller.handle(httpRequest);
        if (httReponse.statusCode === 500) {
            await this.logErrorRepository.logError(httReponse.body.stack);
        }
        return httReponse;
    }
}
exports.LogControllerDecoretor = LogControllerDecoretor;
//# sourceMappingURL=log.js.map