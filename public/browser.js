document.addEventListener("click", function(e){
if (e.target.classList.contains("edit-me")) {
  let userInput = prompt('Escribar el texto esitar')
  axios.post('/update-item',{text: userInput}).then(function(){
    // algo interesenta en el siguine video
  }).catch(function(){
    console.log("Probar mas tarde.")
  })
}
})