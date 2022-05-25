var {
    Calendar,
    SEASON_WINTER,
    SEASON_LENGTH
} = require('./calendar');

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
if (calendar.getCurrentSeason() == SEASON_WINTER && calendar.getCurrentDay() > SEASON_LENGTH - 3) {
    // Pastacı Kız burada
} else {
    var seasonsLeft = SEASON_WINTER - calendar.getCurrentSeason();
    var day = calendar.getCurrentDay() - 1;
    var timeUntilEvent = (seasonsLeft * SEASON_LENGTH * 20 * 60) + ((SEASON_LENGTH - day - 3) * 20 * 60) - (calendar.getEpochTime() % (20 * 60));
    console.log(`Pastacı kızın gelmesine ${Math.floor(timeUntilEvent / 3600)} saat ${Math.floor(timeUntilEvent % 3600 / 60)} dakika kaldı.`)
    /*
    var s = calendar.internal.getCurrentSeason(calendar.getSkyBlockTime() + timeUntilEvent*72) // bu satır doğrulamak  
    console.log(s)
    */
}