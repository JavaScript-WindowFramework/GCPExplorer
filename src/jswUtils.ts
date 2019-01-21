
class UtilPanel extends JSW.Panel {
	constructor() {
		super()
		this.setWidth(32)
	}
	addImage(url, title, func) {
		let img = document.createElement('img')
		img.src = './css/images2/' + url
		img.title = title
		img.addEventListener('click', func)
		this.getClient().appendChild(img)
	}
}
