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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies 
var execute_1 = require("@getvim/execute");
var prompt = require("prompt");
// Init CLI
console.log('');
console.log('DATABASE RESTORE');
console.log('@param backupName  // F.e: 1646678127337.dump');
console.log(' ');
prompt.start();
prompt.get(['backupName'], function (e, data) { return __awaiter(void 0, void 0, void 0, function () {
    var name, e_1, e_2, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (e)
                    throw e;
                name = data.backupName;
                if (typeof name != "string" || !name.length) {
                    throw new Error("The backup name must be provided as an argument. F.e: npm run restore-database DUMP_NAME.dump");
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log(' ');
                console.log('1/3) Downloading the Database Backup into the pgdata-management volume...');
                return [4 /*yield*/, (0, execute_1.execute)("docker exec api node dist/cli/databaseManagement.js restore ".concat(name))];
            case 2:
                _a.sent();
                console.log("The Database Backup ".concat(name, " was downloaded successfully."));
                console.log(' ');
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error('Error in task 1: ', e_1);
                throw e_1;
            case 4:
                _a.trys.push([4, 6, , 7]);
                console.log(' ');
                console.log('2/3) Restoring the Database Backup...');
                return [4 /*yield*/, (0, execute_1.execute)("docker exec postgres docker-entrypoint.sh pg_restore --clean -U postgres -d postgres /var/lib/pgdata-management/".concat(name))];
            case 5:
                _a.sent();
                console.log("The Database Backup ".concat(name, " has been restored successfully."));
                console.log(' ');
                return [3 /*break*/, 7];
            case 6:
                e_2 = _a.sent();
                console.error('Error in task 2: ', e_2);
                throw e_2;
            case 7:
                _a.trys.push([7, 9, , 10]);
                console.log(' ');
                console.log('3/3) Cleaning Database Management Files...');
                return [4 /*yield*/, (0, execute_1.execute)("docker exec api node dist/cli/databaseManagement.js clean")];
            case 8:
                _a.sent();
                console.log("The management files have beel cleaned successfully.");
                console.log(' ');
                return [3 /*break*/, 10];
            case 9:
                e_3 = _a.sent();
                console.error('Error in task 3: ', e_3);
                throw e_3;
            case 10: return [2 /*return*/];
        }
    });
}); });
