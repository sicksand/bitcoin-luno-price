const {ipcRenderer,shell} = require('electron')

let voice = undefined

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
const getPrice = () => {
  const url = 'https://api.mybitx.com/api/1/tickers?pair=XBTMYR'
  return window.fetch(url).then((response) => {
    return response.json()
  })


}

const updatePrice = () => {
  getPrice().then((price) => {
    price.currently.time = Date.now()
    console.log('Got price', price)
    ipcRenderer.send('price-updated', price)
    updateHTML(price)

  }
}
*/
const updateHTML = (bp) => {
  var date = new Date(+(`${bp[0].timestamp}`))
  var formattedDate = date.getDate() + '-' + ('0' +(date.getMonth()+1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2)
  var bPrice = Number(`${bp[0].bid}`).toLocaleString()
  var aPrice = Number(`${bp[0].ask}`).toLocaleString()
  var hPrice = (+(`${bp[0].bid}`) + +(`${bp[0].ask}`)) / 2
  hPrice = hPrice.toString().split('.')
  var sPrice = Number(hPrice[0]).toLocaleString()
  document.querySelector('.js-update-time').textContent = `${formattedDate}`
  document.querySelector('.js-summary').textContent = `RM ${sPrice}`
  document.querySelector('.price-bid').textContent = `RM ${bPrice}`
  document.querySelector('.price-ask').textContent = `RM ${aPrice}`
  speakTheGoodNews(sPrice)
}
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
     price = bp[0].ask.toLocaleString('en-US')
     ipcRenderer.send('price-updated', bp)
     updateHTML(bp)
     console.log('sending price...'+ str_date + " " + str_time)
    })
    
}

const speakTheGoodNews = (sPrice) => {
  const utterance = new SpeechSynthesisUtterance(`The current price of 1 Bitcoin is RM ${sPrice}`)
  utterance.voice = voice
  speechSynthesis.speak(utterance)
}


// update price every 2 minutes (in milliseconds)
const fifteenMinutes = 900000
setInterval(getPrice, fifteenMinutes)
// Update initial weather when loaded
document.addEventListener('DOMContentLoaded', getPrice)