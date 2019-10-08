document.addEventListener("click", function(e) {
  // Delete Item
  if (e.target.classList.contains("delete-me")) {
    if (confirm('Quieres borrar este item')){
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function () {
        e.target.parentElement.parentElement.remove()
      }).catch(function() {
        console.log("Please try again later.")
      })
    }
  }

  // Update item
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Escribir el texto a editar", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if (userInput) {
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
      }).catch(function() {
        console.log("Please try again later.")
      })
    }
  }
})