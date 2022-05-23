var {Calendar} = require('./calendar');

var calendar = new Calendar();
// Mevsim ismi değiştirme
calendar.setSeasonName(0, 'İlkbahar')
calendar.setSeasonName(1, 'Yaz')
calendar.setSeasonName(2, 'Sonbahar')
calendar.setSeasonName(3, 'Kış')

console.log(`SkyBlock Yılı: ${calendar.getCurrentYear()}`)
console.log(`SkyBlock Mevsimi: ${calendar.getCurrentSeasonName()}`)
console.log(`SkyBlock Günü: ${calendar.getCurrentDay()}`)
console.log(`SkyBlock Zamanı: ${calendar.getCurrentHour()}:${calendar.getFlatMinutes()}`)
console.log(`Yağmur durumu ${calendar.isRaining()}`)