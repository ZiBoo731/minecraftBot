const http = require('http')
const mineflayer = require('mineflayer')
const port = process.env.PORT || 10000
const axios = require('axios')

async function notifyCsrv() {
  try {
    await axios.get('https://csrv.gg')
    console.log('Pomyślnie nawiązano połączenie z csrv.gg')
  } catch (error) {
    console.error('Nie udało się otworzyć csrv.gg:', error.message)
  }
}
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

  if(message.includes('leave') && !message.includes(bot.username)){
        bot.quit()
        process.exit()
  }

  else if(message.includes('slot') && !message.includes(bot.username)){
    bot.chat(`hand is at : ${bot.quickBarSlot} place`)
  }

  else if(message.includes('eat') && !message.includes(bot.username)){
    const hunger = bot.food
    if(hunger<20){
      bot.chat("I'm hungry (level: "+hunger+"), I'm eating")
      bot.consume()
    }else{
      bot.chat("I'm not hungry(level: "+hunger+")")
    } 
  }

  else if(message.includes('successfully logged in') && !message.includes(bot.username)){
    bot.chat('hi!')
  }

  else if((message.includes('joined') && !message.includes(bot.username))){
    bot.chat('zrobielm bota, nie odkopujcie - jest na spawnie - Piotrek')
    bot.chat('napisz na czacie bot help')
  }
})

bot.on('chat', async  (username, message) => {
  if(username === bot.username) return

  const messageParts = message.split(' ')
  if(messageParts[0] === 'wyrzuc' && messageParts.length == 3){
    const dropItemName = messageParts[1]
    const dropItemCount = parseInt(messageParts[2])

    const dropItem = bot.inventory.items().find(i => i.name === dropItemName)

    if(dropItem){
      try{
        await bot.toss(dropItem.type, null, dropItemCount)
        bot.chat(`Wyrzuciłem ${dropItemCount}x ${dropItemName}`)
      } catch(err){
        bot.chat(`Nie udało mi się wyrzucić ${dropItemName}: ${err.message}`)
      }
    }else{
      bot.chat(`Nie mam przy sobie ${dropItemName}`)
    }
  }


  else if(message === 'wyrzuc'){
    if(!lastReceivedItem){
      bot.chat('Jeszcze nic nie podniosłem.')
      return
    }

    const itemInInventory = bot.inventory.items().find(i => i.displayName === lastReceivedItem)

    if(itemInInventory){
      try{
        await bot.tossStack(itemInInventory)
        bot.chat(`Wyrzuciłem ostatni przedmiot: ${itemInInventory.name}`)
        lastReceivedItem = null
      } catch (err){
        bot.chat('nie udalo mi sie wyrzucic')
      }
    }else{
      bot.chat('Nie mam juz tego w eq')
    }
  }


  else if(message === 'bot tp'){
    bot.chat(`/tpa ${username}`)
  }

  else if (message === 'show inventory') {
    const eqitems = bot.inventory.items()
    bot.chat('Moje przedmioty:')
    eqitems.forEach(item => {
      bot.chat(`- ${item.displayName}: ${item.count}`)
    })
  }

  else if (message === 'wyrzuc wszystko') {
    const items = bot.inventory.items()
    for (const item of items) {
        await bot.tossStack(item)
    }
  }

  else if (['bot help', 'bothelp', 'helpbot', 'help bot'].includes(message.toLowerCase())){
    bot.chat('napisz na chacie:')
    bot.chat('')
    bot.chat('leave - zeby bot wyszedl')
    bot.chat('wyrzuc <nazwa bloku po angielsku np.(cobblestone, diamond_sword)> <ilosc> - bot wyrzuci item')
    bot.chat('wyrzuc - wyrzuci ostatnia rzecz ktora podniosl')
    bot.chat('bot tp')
    bot.chat('show inventory - pokazuje eq bota')
    bot.chat('wyrzuc wszystko - wyrzuca cale z eq')
  }
})

let lastReceivedItem = null
bot.on('playerCollect', (collector, itemEntity) => {
    console.log(`collector: ${collector.username}, itemEntity: ${itemEntity.type}`)
  if(collector.username === bot.username){
    const collectedItem = itemEntity.getDroppedItem().displayName
    
    if(collectedItem){
      lastReceivedItem = collectedItem
    }
  }
})

bot.on('physicsTick', () => {
  const playerEntity = bot.nearestEntity(entity => entity.type === 'player')
  if (playerEntity) {
    const position = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(position)
  }
})


bot.on('error', (err) => console.log('Błąd:', err))
bot.on('kicked', (reason) => {
  console.log('Wyrzucono bota:', reason))
  notifyCsrv()
}
