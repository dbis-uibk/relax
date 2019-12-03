"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function isAssignmentToken(token) {
    return token.kind >= ts.SyntaxKind.FirstAssignment && token.kind <= ts.SyntaxKind.LastAssignment;
}
exports.isAssignmentToken = isAssignmentToken;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN1cHBvcnQvdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsMkJBQWtDLEtBQWM7SUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztBQUNuRyxDQUFDO0FBRkQsOENBRUMiLCJmaWxlIjoic3VwcG9ydC90b2tlbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvam1sb3Blei9Xb3Jrc3BhY2UvdHNsaW50LWVzbGludC1ydWxlcy9zcmMifQ==
