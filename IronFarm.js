const http = require('http')
const mineflayer = require('mineflayer')
const port = process.env.PORT || 10000

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Bot is running')
}).listen(port, '0.0.0.0', () => {
  console.log(`Serwer HTTP nasłuchuje na porcie ${port}`)
})


const options = {
  host: 'klakier-rudy-kot.csrv.gg',
  port: 29548,
  username: 'IronFarmBot',
  version: '1.21.11'
}

const bot = mineflayer.createBot(options)


bot.on('spawn', () => {
  bot.setQuickBarSlot(8)
  console.log('Bot is runing')
  bot.chat('/login 123456')
})


bot.on('messagestr', (message) => {

  if(message.includes('leave')){
        bot.quit()
        process.exit()
  }

  else if(message.includes('slot')){
    bot.chat(`hand is at : ${bot.quickBarSlot} place`)
  }

  else if(message.includes('eat')){
    const hunger = bot.food
    if(hunger<20){
      bot.chat("I'm hungry (level: "+hunger+"), I'm eating")
      bot.consume()
    }else{
      bot.chat("I'm not hungry(level: "+hunger+")")
    } 
  }

  else if(message.includes('successfully logged in')){
    bot.chat('hi!')
  }

  else if(message.includes('joined')){
    bot.chat('zrobielm bota, nie odkopujcie - jest na spawnie - Piotrek')
  }
})


bot.on('error', (err) => console.log('Błąd:', err))
bot.on('kicked', (reason) => console.log('Wyrzucono bota:', reason))
