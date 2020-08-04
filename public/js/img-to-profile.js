let file = ""
    // Avatar 
async function avatarFile(){
    if (this.files && this.files[0]){
        let readFile = new FileReader();
        readFile.onload = function (e){
            document.getElementById("img-upload").src = e.target.result;
            document.getElementById("img-upload").style.width = "100px";
        };
        readFile.readAsDataURL(this.files[0]);
        file = this.files[0]
    };
    console.log('file:',file)
    const formData = new FormData();
    formData.append('picture', file);
    console.log(file.name)

    await fetch('/profile/update_profile_pic', {
        method:'POST',
        body:formData
    })
    .then(resp=>resp.json())
    .then(data=>{
        document.getElementById("img-upload").innerHTML = data
        console.log(data)
    })
};

let uploadProfilePic = () => {
    let profilePicDiv = document.getElementById('profile-img')

    var ahDiv = document.createElement("div"); // -- <div>
    ahDiv.className = "ava-group"; // -class/CSS
    profilePicDiv.append(ahDiv); // <div>"main" -> <div>"ava-group"
    //
    var ahsDiv = document.createElement("div"); // -- <div>for styling
    ahsDiv.className = "avag-style"; // -class/CSS
    ahDiv.append(ahsDiv); // <div>"ava-group" -> <div>"avag-style"
    //
    var ahLab = document.createElement("label"); // -- <label>
    ahLab.setAttribute("id","ava-html");
    ahLab.className = "ava-label"; // -class/CSS
    ahLab.setAttribute("for","avatar");
    ahDiv.append(ahLab); // <div>"ava-group" -> <label>"ava-html"
    //
    var ahImg = document.createElement("img"); // -- <img>
    ahImg.setAttribute("id","img-upload");
    ahImg.className = "ava-img"; // -class/CSS
    
    ahImg.setAttribute("src","/images/icons/default_ava.png");
    ahLab.appendChild(ahImg);
    //
    var ahbDiv = document.createElement("div"); // -- <div>
    ahbDiv.className = "col-md-6"; // bootstrap
    ahDiv.appendChild(ahbDiv); // <div>"ava-group" -> <div>bootstrap
    //
    var ahInput = document.createElement("input"); // -- <input>
    ahInput.setAttribute("id","avatar");
    ahInput.setAttribute("name","avatar");
    ahInput.setAttribute("type","file");
    ahInput.className = "ava-control"; // -class/CSS
    ahbDiv.appendChild(ahInput); // - <div>bootstrap -> <input>"avatar"
    
    document.getElementById("avatar").addEventListener("change",avatarFile,false);
}

const pullPostDataFromServer = async () => {
    uploadProfilePic()
    let data = await fetch('/profile', {
        method:'POST'
    })
    let {posts,user} = await data.json()
    posts.sort(function(a, b) {
        return b.id - a.id;
    })

    console.log(user)

    let image = document.getElementById('img-upload')
    if(user.profilepic){
        image.setAttribute('src',user.profilepic)
    }

    let profileFeed = []

    for(let i = 0; i < posts.length; i++){
        console.log(posts[i])
        profileFeed.push(posts[i].picurl)
    }

    for(let i = 0; i < profileFeed.length; i++){
        let div = document.createElement('div')
        div.setAttribute('class','profile-feed-post-container')
        let postLink = document.createElement('a')
        postLink.setAttribute('href',`${posts[i].picurl}`)
        // let imgDiv = document.createElement('div')
        // imgDiv.className('profile-feed-img-container')
        let img = document.createElement('img')
        img.setAttribute('src',profileFeed[i])
        img.setAttribute('class','profile-feed-img')
        let causeIcon = document.createElement('img')
        causeIcon.className = "cause-icons"
        posts[i].causes == 'blm' ? causeIcon.setAttribute('src','/images/icons/blm_icon.png') : null
        posts[i].causes == 'election' ? causeIcon.setAttribute('src','/images/icons/election_icon.png') : null
        posts[i].causes == 'climate' ? causeIcon.setAttribute('src','/images/icons/environment_icon.png') : null
        
        postLink.append(img,causeIcon)
        div.appendChild(postLink)
        document.getElementById('profile-feed').appendChild(div)
    }

    console.log(profileFeed)

}

window.addEventListener('DOMContentLoaded',pullPostDataFromServer)