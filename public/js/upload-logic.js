let file = "";

const loadFile = (evt)=>{
    console.log(evt.target.files[0]);
    let FR = new FileReader()
    FR.onload = (e)=>{
        document.getElementById("image-to-Upload").innerHTML = `<img src='${e.target.result}' />`
    }
    FR.readAsDataURL(evt.target.files[0]);
    file = evt.target.files[0];
    document.getElementById("submit").classList.replace("hidden", "bttn")
}

const uploadToServer = (evt) =>{
        //best to commit it as such
        const formData = new FormData();
        formData.append('picture', file);

        //not nessessay if you are just uploading a single image
        formData.append('body',document.getElementById('body').value )//etc
        formData.append('tags',document.getElementById('tags').value )//etc
        console.log(`formData:`,formData)
        fetch('/upload', {
            method:'POST',
            body:formData
        })
        .then(resp=>resp.json())
        .then(data=>{
            console.log(data)
            window.location = '/feed'
        })
        .catch(err=>console.log(err))
    
}

//Whenever you change the image
let loadedFile = document.getElementById("upload")
loadedFile.addEventListener("input", loadFile)
//when you hit the submit button
let button = document.getElementById("submit")
button.addEventListener("click", uploadToServer)