const {ipcRenderer} = require('electron')

document.addEventListener('click', (event) => {
  if (event.target.href) {
    // Open links in external browser
    shell.openExternal(event.target.href)
    event.preventDefault()
  } else if (event.target.classList.contains('js-refresh-action')) {
    console.log('button clicked')
    getPrice()
  } else if (event.target.classList.contains('js-quit-action')) {
    console.log('nak close ke?')
    window.close()
  }
})
/*
document.addEventListener('DOMContentLoaded', (getPrice) => {
  let n = new Notification('You did it!', {
    body: 'Nice work.'
  })

  // Tell the notification to show the menubar popup window on click
  n.onclick = () => { ipcRenderer.send('show-window') }

})
*/
const getPrice = () => {
  // fetch json data
  var price = ''
  var d = new Date()
  var str_date = d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear()
  var str_time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
  const url = 'https://api.mybitx.com/api/1/tickers?pair=XBTMYR'
  fetch(url)
    .then(res => res.json())
    //.then(json => console.log(json))
    .then(function(data) {
     const bp = data.tickers
     price = bp[0].ask
     ipcRenderer.send('price-updated', price)
     console.log('sending price...'+ str_date + " " + str_time)
    })
    
}
// update price every 2 minutes (in milliseconds)
const fifteenMinutes = 900000
setInterval(getPrice, fifteenMinutes)
// Update initial weather when loaded
document.addEventListener('DOMContentLoaded', getPrice)