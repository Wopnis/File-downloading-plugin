function bytesTo(bytes) {
    const sizes = ['Bytes', 'KB', 'MB','GB','TB',]
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + '' + sizes[i]
}

const builder = (tag, classes=[], content) => {
    const domNode = document.createElement(tag)
    if(classes.length){
        domNode.classList.add(...classes)
    }
    if(content){
        domNode.textContent = content
    }
    return domNode
}

const noop = function () {}

export function download(selector, options={}) {
    let files = []
    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector)
    const preview = builder('div', ['preview'])
    const open = builder('button',['btn'], 'Открыть')
    const downLoad = builder('button',['btn','primary'], 'Загрузить')
    downLoad.style.display = 'none'

    if(options.multi) {
        input.setAttribute('multiple', true)
    }
    if(options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }
    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', downLoad)
    input.insertAdjacentElement('afterend', open)

    const clickInput = ()=> input.click()

    const takenFile = event => {
        if(!event.target.files.length){
            return
        }
        files = Array.from(event.target.files)
        preview.innerHTML = ''
        downLoad.style.display = 'inline'
        files.forEach((file => {
            if(!file.type.match('image')){
                return
            }
            const reader = new FileReader()
            reader.onload = ev => {
                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">
                <div class="preview-delete" data-name="${file.name}">&times;</div>
                <img src="${src}" alt="${file.name}">
                <div class="preview-info">
                    <span>${file.name}</span>
                    <span>${bytesTo(file.size)}</span>
                </div>
                </div>
             `)
            }
            reader.readAsDataURL(file)
        }))
    }

    const deleteChooses = event => {
        if (!event.target.dataset.name) {
            return
        }
        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)
        if (!files.length) {
            downLoad.style.display = 'none'
        }
        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('deleted')
        setTimeout(()=> block.remove(), 300)
    }

    const clearPreview = el => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class = preview-info-progress></div>'
    }

    const downLoadImage = () => {
        preview.querySelectorAll('.preview-delete').forEach(e=>e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)
    }

    open.addEventListener('click', clickInput)
    input.addEventListener('change', takenFile)
    preview.addEventListener('click', deleteChooses)
    downLoad.addEventListener('click', downLoadImage)

}