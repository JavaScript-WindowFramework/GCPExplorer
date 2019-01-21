/**
 * Googleサインイン用ウインドウ
*/

class GoogleSignWindow extends JSW.FrameWindow {
	constructor(auth: JSW.GoogleAuth,callback : (flag:boolean)=>void) {
		super()
		this.setTitle('ログイン')
		this.setSize(180, 100)
		this.setPos()
		let client = this.getClient()
		client.style.display = 'flex'
		client.style.alignItems = 'center'
		client.style.justifyContent = 'center'


		let button = document.createElement('button')
		button.innerText = 'ログイン'
		client.appendChild(button)

		let button2 = document.createElement('button')
		button2.innerText = 'ログアウト'
		client.appendChild(button2)

		let that = this
		button.addEventListener('click', function () {
			auth.signIn().then(function (flag) { callback(flag); that.close() })
		})
		button2.addEventListener('click', function () {
			auth.signOut().then(function (flag) { callback(flag); that.close() })
		})
	}
}


class GCPProjectExplorer extends JSW.FrameWindow{
	mProject : JSW.GoogleProject
	mListProject : JSW.ListView
	mListInstanse : JSW.ListView
	constructor(clientKey:string){
		super()
		this.setTitle('CGP Explorer')
		this.setSize(900,600)

		const splitter = new JSW.Splitter()
		this.addChild(splitter,'client')
		splitter.setSplitterPos(260)

		let panel = new UtilPanel()
		panel.getClient().dataset.panel = 'GDrivePanel'
		this.addChild(panel, 'right')
		panel.addImage('login.svg', 'ログイン', this.onLogin.bind(this))

		const list = new JSW.ListView()
		this.mListProject = list
		list.addEventListener('itemClick',e=>{
			const index = e.params.itemIndex
			const projectId = list.getItemValue(index)
			this.loadInstanse(projectId)
		})
		splitter.addChild(0,list,'client')
		list.addHeader([['Name',140],'Project ID'])

		this.mProject = new JSW.GoogleProject()
		this.mProject.init(clientKey).then(()=>{
				if(this.mProject.isSignIn()){
					this.loadProject()
				}
			})

		const list2 = new JSW.ListView()
		this.mListInstanse = list2
		splitter.addChild(1,list2,'client')
		list2.addHeader(['Name',['Zone',150],'Status','IP'],120)


	}

	onLogin(){
		new GoogleSignWindow(this.mProject,(flag:boolean)=>{
			this.mListInstanse.clearItem()
			this.mListProject.clearItem()
			if(flag){
				this.loadProject()
			}
		})
	}
	loadProject(){
		const list = this.mListProject
		this.mProject.getProjects().then(function(response){
			list.clearItem()
			const projects = (response as any).projects
			for(let project of projects){
				let index = list.addItem([project.name,project.projectId])
				list.setItemValue(index,project.projectId)
			}
		})
	}
	loadInstanse(projectId:string){
		const list = this.mListInstanse
		list.clearItem()
		this.mProject.getInstanse(projectId).then(response=>{
			let items = (response as any).items
			for(let item in items){
				let zone = items[item]
				let instances = zone.instances
				for(let i=0,l=instances.length;i<l;i++){
					let inst = instances[i]
					let zone = inst.zone.substring(inst.zone.lastIndexOf('/')+1)
					let ip = ''
					if(inst.networkInterfaces && inst.networkInterfaces.length && inst.networkInterfaces[0].accessConfigs)
						ip = inst.networkInterfaces[0].accessConfigs[0].natIP
					list.addItem([inst.name,zone,inst.status,ip])

				}
			}
		})
	}

}
