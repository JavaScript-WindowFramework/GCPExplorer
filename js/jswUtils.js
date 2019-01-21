var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var UtilPanel = /** @class */ (function (_super) {
    __extends(UtilPanel, _super);
    function UtilPanel() {
        var _this = _super.call(this) || this;
        _this.setWidth(32);
        return _this;
    }
    UtilPanel.prototype.addImage = function (url, title, func) {
        var img = document.createElement('img');
        img.src = './css/images2/' + url;
        img.title = title;
        img.addEventListener('click', func);
        this.getClient().appendChild(img);
    };
    return UtilPanel;
}(JSW.Panel));
//# sourceMappingURL=jswUtils.js.map