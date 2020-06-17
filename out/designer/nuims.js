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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllServiceAPI = void 0;
const fs = require("fs-extra");
const globby = require("globby");
function loadAllServiceAPI(srcPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const services = yield Promise.all(globby.sync(srcPath + '/**/services/*/api.json')
            .map((jsonPath) => __awaiter(this, void 0, void 0, function* () {
            const content = yield fs.readFile(jsonPath, 'utf8');
            const arr = jsonPath.split('/');
            const name = arr[arr.length - 2];
            const json = JSON.parse(content);
            Object.keys(json).forEach((key) => {
                if (key.startsWith('__'))
                    delete json[key];
            });
            return { name, json };
        })));
        const result = {};
        services.forEach((service) => result[service.name] = service.json);
        return result;
    });
}
exports.loadAllServiceAPI = loadAllServiceAPI;
//# sourceMappingURL=nuims.js.map