import firebase from 'firebase/app'
import 'firebase/storage'
import {download} from "./download"

const firebaseConfig = {
    apiKey: "AIzaSyDaSIgw4CFbkFvBcxyIpdNOpOarw1bkejo",
    authDomain: "downloadfiles-plugin.firebaseapp.com",
    projectId: "downloadfiles-plugin",
    storageBucket: "downloadfiles-plugin.appspot.com",
    messagingSenderId: "614107965923",
    appId: "1:614107965923:web:45894a7a0cd4376cd818d6"
}

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

download('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage + '%'
                block.style.width = percentage + '%'
            }, error => {
                console.log(error)
            }, ()=> {
                console.log('Completed')
            })
        })
    }
})
