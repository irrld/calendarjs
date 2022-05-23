# calendarjs
A calendar library for Crafters SkyBlock

Just clone the repository and use it, here is an example. Also you can check the [test.js](https://github.com/irrld/calendarjs/blob/main/test.js) file too.
```
var {Calendar} = require('/path/to/calendarjs/calendar'); // example C:/Users/irrel/Desktop/calendarjs/calendar

var calendar = new Calendar();
// Changing the season name (0: Spring, 1: Summer, 2: Autumn, 3: Winter)
calendar.setSeasonName(3, 'I love Winter')

console.log(`SkyBlock Year: ${calendar.getCurrentYear()}`)
console.log(`SkyBlock Season: ${calendar.getCurrentSeasonName()}`)
console.log(`SkyBlock Day: ${calendar.getCurrentDay()}`)
console.log(`SkyBlock Time: ${calendar.getCurrentHour()}:${calendar.getFlatMinutes()}`)
console.log(`Rain state ${calendar.isRaining()}`)
console.log(`Snow state ${calendar.isSnowing()}`)
```

Öncelikle repository'i clonela ve klasöre çıkart, daha sonra aşağıdaki örneği uygulayabilirsin. Ayrıca [test.js](https://github.com/irrld/calendarjs/blob/main/test.js) dosyasına da göz atabilirsin.
```
var {Calendar} = require('/path/to/calendarjs/calendar'); // örn. C:/Users/irrel/Desktop/calendarjs/calendar

var calendar = new Calendar();
// Mevsim ismi değiştirme (0: İlkbahar, 1: Yaz, 2: Sonbahar, 3: Kış)
calendar.setSeasonName(3, 'Kışı Severim')

console.log(`SkyBlock Yılı: ${calendar.getCurrentYear()}`)
console.log(`SkyBlock Mevsimi: ${calendar.getCurrentSeasonName()}`)
console.log(`SkyBlock Günü: ${calendar.getCurrentDay()}`)
console.log(`SkyBlock Zamanı: ${calendar.getCurrentHour()}:${calendar.getFlatMinutes()}`)
console.log(`Yağmur durumu ${calendar.isRaining()}`)
console.log(`Kar durumu ${calendar.isSnowing()}`)
```
