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
var JSW;
(function (JSW) {
    var GoogleAuth = /** @class */ (function () {
        function GoogleAuth() {
        }
        GoogleAuth.prototype.init = function (clientId, scope, discovery) {
            var _this = this;
            return new Promise(function (resolv, reject) {
                var that = _this;
                gapi.load('client:auth2', function () {
                    var discoverys = discovery instanceof Array ? discovery : [discovery];
                    gapi.client.init({
                        clientId: clientId,
                        scope: scope,
                        discoveryDocs: discoverys
                    }).then(function () {
                        that.mAuthInstance = gapi.auth2.getAuthInstance();
                        resolv();
                    }).catch(function (e) {
                        reject(e);
                    });
                });
            });
        };
        /**
         *サインイン状態のチェック
         *
         * @returns {boolean} サインイン状態
         * @memberof GoogleDrive
         */
        GoogleAuth.prototype.isSignIn = function () {
            if (!this.mAuthInstance)
                return false;
            return this.mAuthInstance.isSignedIn.get();
        };
        /**
     *サインインの要求
     *
     * @returns {Promise<boolean>}
     * @resolve flag true:成功 false:失敗
     * @reject value エラーメッセージ
     * @memberof GoogleDrive
     */
        GoogleAuth.prototype.signIn = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                if (gapi.auth2) {
                    var auth = that.mAuthInstance;
                    var flag = auth.isSignedIn.get();
                    if (flag)
                        resolve(flag);
                    else
                        auth.signIn().then(function () {
                            resolve(true);
                        }).catch(function () {
                            reject({ message: 'ログイン失敗' });
                        });
                }
                else {
                    reject({ message: 'APIが初期化されていない' });
                }
            });
        };
        /**
        * サインアウトンの要求
        * @returns {Promise<boolean>}
        * @resolve flag true:成功 false:失敗
        * @reject value エラーメッセージ
        */
        GoogleAuth.prototype.signOut = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                if (!gapi.auth2)
                    reject({ message: 'APIが初期化されていない' });
                else
                    that.mAuthInstance.signOut().then(function (flag) {
                        resolve(flag);
                    });
            });
        };
        return GoogleAuth;
    }());
    JSW.GoogleAuth = GoogleAuth;
    var GoogleProject = /** @class */ (function (_super) {
        __extends(GoogleProject, _super);
        function GoogleProject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GoogleProject.prototype.init = function (clientId, scope, discovery) {
            if (!scope) {
                scope = 'https://www.googleapis.com/auth/compute ' +
                    'https://www.googleapis.com/auth/cloud-platform ' +
                    'https://www.googleapis.com/auth/cloudplatformprojects';
            }
            if (!discovery) {
                discovery = 'https://appengine.googleapis.com/$discovery/rest?version=v1';
            }
            return _super.prototype.init.call(this, clientId, scope, discovery);
        };
        GoogleProject.prototype.getProjects = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.request({
                    path: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects',
                    method: 'GET'
                }).then(function (response) {
                    resolve(response);
                });
            });
        };
        GoogleProject.prototype.getInstanse = function (projectId) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.request({
                    path: 'https://content.googleapis.com/compute/v1/projects/' + projectId + '/aggregated/instances',
                    method: 'GET',
                    params: { fields: 'items/*/instances/name,items/*/instances/zone,items/*/instances/status,items/*/instances/networkInterfaces/accessConfigs/natIP' }
                }).then(function (response) {
                    resolve(response);
                });
            });
        };
        GoogleProject.prototype.request = function (values) {
            return new Promise(function (resolve, reject) {
                var user = gapi.auth2.getAuthInstance().currentUser.get();
                var oauthToken = user.getAuthResponse().access_token;
                var http = new XMLHttpRequest();
                var path = values.path;
                var params = values.params;
                if (values.params) {
                    path += '?';
                    for (var index in params)
                        path += encodeURIComponent(index) + '=' + encodeURIComponent(params[index]);
                }
                http.open(values.method, path, true);
                http.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
                http.setRequestHeader('Content-Type', 'application/json');
                http.onreadystatechange = function () {
                    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
                        resolve(JSON.parse(http.response));
                    }
                };
                if (values.body)
                    http.send(JSON.stringify(values.body));
                else
                    http.send();
            });
        };
        return GoogleProject;
    }(GoogleAuth));
    JSW.GoogleProject = GoogleProject;
})(JSW || (JSW = {}));
//# sourceMappingURL=gcp.js.map