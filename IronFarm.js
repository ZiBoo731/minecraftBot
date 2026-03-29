const http = require('http')
const mineflayer = require('mineflayer')


http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Bot is running!')
}).listen(process.env.PORT || 3000)


const options = {
  host: 'klakier-rudy-kot.csrv.gg',
  port: 29548,
  username: '_fylek_pl',
  auth: 'microsoft',
  version: '1.21.11' 
}

const bot = mineflayer.createBot(options)


bot.on('spawn', () => {
  bot.chat('hi!')
  bot.setQuickBarSlot(8)
  console.log('Bot is runing')
})


bot.on('messagestr', (message) => {

  if(message.includes('leave')){
        bot.quit()
        process.exit();
  }

  else if(message.includes('slot')){
    bot.chat(`hand is at : ${bot.quickBarSlot} place`)
  }

  else if(message.includes('eat')){
    if(hunger<20){
      bot.chat("I'm hungry (level: "+hunger+"), I'm eating")
      bot.consume()
    }else{
      bot.chat("I'm not hungry(level: "+hunger+")")
    } 
  }
})


bot.on('error', (err) => console.log('Błąd:', err))
bot.on('kicked', (reason) => console.log('Wyrzucono bota:', reason))
