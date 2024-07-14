const translations={
    en:{
        title:"Men",
        pargr: "Women"
    },
    hi:{
        title:"पुरुष",
        pargr: "महिला"
    }
}
const languageSelector = document.querySelector("select");
let li = document.getElementById("megamenu_container")
languageSelector.addEventListener("change",(event)=>{
    setLanguage(event.target.value)
})

const setLanguage = (language)=>{
    if(language=="hi"){
        li.innerHTML=translations.hi.title
    }
    else if(language=="en"){
        li.innerHTML=translations.en.title
    }
}