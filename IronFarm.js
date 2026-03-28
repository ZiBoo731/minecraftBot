const mineflayer = require('mineflayer')

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
})


bot.on('messagestr', (message) => {
    if(message.includes('eat')){
        const hunger = bot.food
        if(hunger<20){
            bot.chat("I'm hungry (level: "+hunger+"), I'm eating")
            bot.consume()
        }else(
            bot.chat("I'm not hungry(level: "+hunger+")")
        )
    }
})

bot.on('messagestr', (message) => {
    if(message.includes('leave')){
        bot.quit()
        process.exit();
    }
})

bot.on('messagestr', (message) => {
    if(message.includes('slot')){
        bot.chat(`hand is at : ${bot.quickBarSlot} place`)
    }
})


bot.on('error', (err) => console.log('Błąd:', err))
bot.on('kicked', (reason) => console.log('Wyrzucono bota:', reason))
