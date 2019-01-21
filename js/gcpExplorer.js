/**
 * Googleサインイン用ウインドウ
*/
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
var GoogleSignWindow = /** @class */ (function (_super) {
    __extends(GoogleSignWindow, _super);
    function GoogleSignWindow(auth, callback) {
        var _this = _super.call(this) || this;
        _this.setTitle('ログイン');
        _this.setSize(180, 100);
        _this.setPos();
        var client = _this.getClient();
        client.style.display = 'flex';
        client.style.alignItems = 'center';
        client.style.justifyContent = 'center';
        var button = document.createElement('button');
        button.innerText = 'ログイン';
        client.appendChild(button);
        var button2 = document.createElement('button');
        button2.innerText = 'ログアウト';
        client.appendChild(button2);
        var that = _this;
        button.addEventListener('click', function () {
            auth.signIn().then(function (flag) { callback(flag); that.close(); });
        });
        button2.addEventListener('click', function () {
            auth.signOut().then(function (flag) { callback(flag); that.close(); });
        });
        return _this;
    }
    return GoogleSignWindow;
}(JSW.FrameWindow));
var GCPProjectExplorer = /** @class */ (function (_super) {
    __extends(GCPProjectExplorer, _super);
    function GCPProjectExplorer(clientKey) {
        var _this = _super.call(this) || this;
        _this.setTitle('CGP Explorer');
        _this.setSize(900, 600);
        var splitter = new JSW.Splitter();
        _this.addChild(splitter, 'client');
        splitter.setSplitterPos(260);
        var panel = new UtilPanel();
        panel.getClient().dataset.panel = 'GDrivePanel';
        _this.addChild(panel, 'right');
        panel.addImage('login.svg', 'ログイン', _this.onLogin.bind(_this));
        var list = new JSW.ListView();
        _this.mListProject = list;
        list.addEventListener('itemClick', function (e) {
            var index = e.params.itemIndex;
            var projectId = list.getItemValue(index);
            _this.loadInstanse(projectId);
        });
        splitter.addChild(0, list, 'client');
        list.addHeader([['Name', 140], 'Project ID']);
        _this.mProject = new JSW.GoogleProject();
        _this.mProject.init(clientKey).then(function () {
            if (_this.mProject.isSignIn()) {
                _this.loadProject();
            }
        });
        var list2 = new JSW.ListView();
        _this.mListInstanse = list2;
        splitter.addChild(1, list2, 'client');
        list2.addHeader(['Name', ['Zone', 150], 'Status', 'IP'], 120);
        return _this;
    }
    GCPProjectExplorer.prototype.onLogin = function () {
        var _this = this;
        new GoogleSignWindow(this.mProject, function (flag) {
            _this.mListInstanse.clearItem();
            _this.mListProject.clearItem();
            if (flag) {
                _this.loadProject();
            }
        });
    };
    GCPProjectExplorer.prototype.loadProject = function () {
        var list = this.mListProject;
        this.mProject.getProjects().then(function (response) {
            list.clearItem();
            var projects = response.projects;
            for (var _i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                var project = projects_1[_i];
                var index = list.addItem([project.name, project.projectId]);
                list.setItemValue(index, project.projectId);
            }
        });
    };
    GCPProjectExplorer.prototype.loadInstanse = function (projectId) {
        var list = this.mListInstanse;
        list.clearItem();
        this.mProject.getInstanse(projectId).then(function (response) {
            var items = response.items;
            for (var item in items) {
                var zone = items[item];
                var instances = zone.instances;
                for (var i = 0, l = instances.length; i < l; i++) {
                    var inst = instances[i];
                    var zone_1 = inst.zone.substring(inst.zone.lastIndexOf('/') + 1);
                    var ip = '';
                    if (inst.networkInterfaces && inst.networkInterfaces.length && inst.networkInterfaces[0].accessConfigs)
                        ip = inst.networkInterfaces[0].accessConfigs[0].natIP;
                    list.addItem([inst.name, zone_1, inst.status, ip]);
                }
            }
        });
    };
    return GCPProjectExplorer;
}(JSW.FrameWindow));
//# sourceMappingURL=gcpExplorer.js.map