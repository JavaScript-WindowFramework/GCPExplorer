namespace JSW{
	export class GoogleAuth {
		mAuthInstance: gapi.auth2.GoogleAuth;
		init(clientId: string, scope: string, discovery: string | string[]) {
			return new Promise((resolv, reject) => {
				const that = this
				gapi.load('client:auth2', () => {
					let discoverys = discovery instanceof Array ? discovery : [discovery]
					gapi.client.init({
						clientId: clientId,
						scope: scope,
						discoveryDocs: discoverys
					}).then(function () {
						that.mAuthInstance = gapi.auth2.getAuthInstance()
						resolv()
					}).catch(function (e) {
						reject(e)
					})
				})
			})
		}
		/**
		 *サインイン状態のチェック
		 *
		 * @returns {boolean} サインイン状態
		 * @memberof GoogleDrive
		 */
		isSignIn(): boolean {
			if (!this.mAuthInstance)
				return false
			return this.mAuthInstance.isSignedIn.get()
		}
		/**
	 *サインインの要求
	 *
	 * @returns {Promise<boolean>}
	 * @resolve flag true:成功 false:失敗
	 * @reject value エラーメッセージ
	 * @memberof GoogleDrive
	 */
		signIn(): Promise<boolean> {
			const that = this
			return new Promise((resolve: (flag?: boolean) => void, reject: (value?: { message }) => void) => {
				if (gapi.auth2) {
					const auth = that.mAuthInstance;
					const flag = auth.isSignedIn.get()
					if (flag)
						resolve(flag);
					else
						auth.signIn().then(() => {
							resolve(true);
						}).catch(() => {
							reject({ message: 'ログイン失敗' })
						});
				} else {
					reject({ message: 'APIが初期化されていない' })
				}
			})

		}
		/**
		* サインアウトンの要求
		* @returns {Promise<boolean>}
		* @resolve flag true:成功 false:失敗
		* @reject value エラーメッセージ
		*/
		signOut(): Promise<boolean> {
			const that = this
			return new Promise((resolve: (value?: boolean) => void, reject: (value?: { message }) => void) => {
				if (!gapi.auth2)
					reject({ message: 'APIが初期化されていない' })
				else
					that.mAuthInstance.signOut().then((flag) => {
						resolve(flag)
					})
			})

		}
	}
	export class GoogleProject extends GoogleAuth{
		init(clientId: string, scope?: string, discovery?: string | string[]){
			if(!scope){
				scope = 'https://www.googleapis.com/auth/compute '+
						'https://www.googleapis.com/auth/cloud-platform '+
						'https://www.googleapis.com/auth/cloudplatformprojects'
			}
			if(!discovery){
				discovery = 'https://appengine.googleapis.com/$discovery/rest?version=v1'
			}
			return super.init(clientId,scope,discovery)
		}

		getProjects(){
			const that = this
			return new Promise((resolve: (response: gapi.client.Response<{}>) => void, reject) => {
				that.request({
					path: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects',
					method: 'GET'
				}).then((response) => {
					resolve(response)
				})

			})
		}
		getInstanse(projectId){
			const that = this
			return new Promise((resolve: (response: gapi.client.Response<{}>) => void, reject) => {
				that.request({
					path: 'https://content.googleapis.com/compute/v1/projects/'+projectId+'/aggregated/instances',
					method: 'GET',
					params: {fields:'items/*/instances/name,items/*/instances/zone,items/*/instances/status,items/*/instances/networkInterfaces/accessConfigs/natIP'}
				}).then((response) => {
					resolve(response)
				})

			})
		}
		request(values:{method:string,path:string,body?:{},params?:{}}){
			return new Promise((resolve: (response: gapi.client.Response<{}>) => void, reject) => {
				const user = gapi.auth2.getAuthInstance().currentUser.get();
				const oauthToken = user.getAuthResponse().access_token;
				const http = new XMLHttpRequest()
				let path = values.path
				let params = values.params
				if(values.params){
					path+='?'
					for(let index in params)
						path += encodeURIComponent(index)+'='+ encodeURIComponent(params[index])
				}

				http.open(values.method, path, true)
				http.setRequestHeader('Authorization', 'Bearer ' + oauthToken)
				http.setRequestHeader('Content-Type', 'application/json')
				http.onreadystatechange = function () {
					if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
						resolve(JSON.parse(http.response))
					}
				}
				if (values.body)
					http.send(JSON.stringify(values.body))
				else
					http.send()
			})

		}
	}
}