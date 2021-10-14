$('#searchRec').click(() => {
  $('#searchModal').css({"display": "block"})
});

$('.closeModal').click(() => {
  $('#searchModal').css({"display": "none"})
})

window.onclick = function(event) {
  if (event.target.id === "searchModal") {
    $('#searchModal').css({"display": "none"})
  }
}