let Random = require('./java-random');

const START_OF_TIMES = 1648800000; // seconds
const TIME_MULTIPLIER = 72;
const SEASON_LENGTH = 93; // days
const YEAR_LENGTH = 4;

const SEASON_SPRING = 0;
const SEASON_SUMMER = 1;
const SEASON_AUTUMN = 2;
const SEASON_WINTER = 3;

const RAIN_CHANCE_STAGE = 0;
const IS_RAINING_STAGE = 1;
const TEMP_STAGE = 2;
const PREFER_COLDER_STAGE = 3;
const RANDOMIZED_STAGE = 4;
const EVENT_STAGE = 7;

const CropType = Object.freeze([
  'WHEAT', 'SUGAR_CANE', 'CARROT', 'POTATO',
  'MELON', 'PUMPKIN', 'COCOA_BEANS', 'CACTUS',
  'MUSHROOM', 'BEETROOT',
]);

function shuffleWithRandom(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = rng.nextInt(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function makeJavaRandomFromLongSeed(longSeed) {
  const SEED48 = Number(BigInt.asUintN(48, BigInt(longSeed))); // modulo 2^48 -> safe to Number
  return new Random(SEED48); 
}

class FarmingContestUtils {
  // eventId = floor(totalDays / 3). day is total in-game days since START_OF_TIMES.
  static getEventId(day /* optional */) {
    const cal = new Calendar();
    const totalDays = (day === undefined) ? cal.getAsDays() : Math.floor(day);
    return Math.floor(totalDays / 3);
  }

  // convenience: no-arg version that uses "now"
  static getEventIdNow() {
    return this.getEventId();
  }

  // crops for given eventId (deterministic), picks up to first 3
  // it is important to use the same algorithm as Java's Random class, otherwise you'll get different results
  // additionally, the order of  the CropType enum is important, see the CropType const above.
  // actual Java code is:
  /* 
    public static ImmutableList<CropType> getCrops(long eventId) {
        List<CropType> crops = new ArrayList<>(List.of(CropType.VALUES));
        Collections.shuffle(crops,
            new Random(eventId ^ 0x9E3779B97F4A7C15L)); // use golden ratio xor for better spread
        return ImmutableList.copyOf(crops.subList(0, Math.min(3, crops.size())));
    }
  */
  static getCrops(eventId /* optional */) {
    const id = (eventId === undefined) ? this.getEventId() : Number(eventId);
    // golden-ratio 64-bit constant
    const GOLDEN = 0x9E3779B97F4A7C15n;
    // seed behavior matches Java: long xor, then pass to Random(long)
    const seed64 = BigInt(id) ^ GOLDEN; // 64-bit mix
    const rng = makeJavaRandomFromLongSeed(seed64);
    const shuffled = shuffleWithRandom(CropType, rng);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }

  // convenience: no-arg version that uses current event
  static getCropsNow() {
    return this.getCrops(this.getEventId());
  }
}

class InternalCalendar {
    getRandom(seed) {
        return new Random(seed);
    }

    getIngameTime(timeMilliseconds) {
        return (timeMilliseconds / 50 - 6000) % 24000;
    }

    getFlatMinutes(time) {
        return Math.floor(this.getCurrentMinute(time) - this.getCurrentMinute(time) % 10);
    }

    getAsMinutes(time) {
        return Math.floor(time / 60);
    }

    getAsHours(time) {
        return Math.floor(this.getAsMinutes(time) / 60);
    }

    getAsDays(time) {
        return Math.floor(this.getAsHours(time) / 24);
    }

    getAsSeasons(time) {
        return Math.floor(this.getAsDays(time) / SEASON_LENGTH);
    }

    getAsYears(time) {
        return Math.floor(this.getAsSeasons(time) / YEAR_LENGTH);
    }

    getCurrentMinute(time) {
        return this.getAsMinutes(time) % 60;
    }

    getCurrentHour(time) {
        return this.getAsHours(time) % 24;
    }

    getCurrentDay(time) {
        return this.getAsDays(time) % SEASON_LENGTH + 1;
    }

    getCurrentSeason(time) {
        return this.getAsSeasons(time) % YEAR_LENGTH;
    }

    getCurrentYear(time) {
        return this.getAsYears(time) + 1;
    }

    getRainChance(time) {
        const season = this.getCurrentSeason(time);
        switch (season) {
            case SEASON_SPRING:
                 return 4;
            case SEASON_SUMMER:
                return 2;
            case SEASON_AUTUMN:
                return 6;
            case SEASON_WINTER:
                return 8;
        };
        return 0;
    }

    isRaining(time) {
        return this.getBooleanFromPercentage(this.getAsDays(time), IS_RAINING_STAGE, this.getRainChance(time));
    }

    isSnowing(time) {
        return this.getCurrentSeason(time) == SEASON_WINTER && this.isRaining(time);
    }

    randomInt(time, stage, min, max) {
        var random = this.getRandom(time);
        var out = random.nextInt(max - min);
        for (var i = 0; i < stage; i++) {
            out = random.nextInt(max - min);
        }
        return out + min;
    }

    getBooleanFromPercentage(seed, stage, percentage) {
        var random = this.getRandom(seed);
        var out = random.nextInt(100);
        for (var i = 0; i < stage; i++) {
            out = random.nextInt(100);
        }
        return out < percentage;
    }
}

class Calendar {
    internal = new InternalCalendar();
    springName = 'Spring';
    summerName = 'Summer';
    autumnName = 'Autumn';
    winterName = 'Winter';

    setSeasonName(season, name) {
        switch (season) {
            case SEASON_SPRING: return this.springName = name;
            case SEASON_SUMMER: return this.summerName = name;
            case SEASON_AUTUMN: return this.autumnName = name;
            case SEASON_WINTER: return this.winterName = name;
            default: throw 'Season out of index';
        }
    }

    getEpochTime() {
        return Math.floor(Date.now() / 1000) - START_OF_TIMES;
    }

    getEpochTimeMilliseconds() {
        return Date.now() - (START_OF_TIMES * 1000);
    }

    getSkyBlockTime() {
        return this.getEpochTime() * TIME_MULTIPLIER;
    }

    getSkyBlockTimeMilliseconds() {
        return this.getEpochTimeMilliseconds() * TIME_MULTIPLIER;
    }

    getIngameTime() {
        return this.internal.getIngameTime(this.getSkyBlockTimeMilliseconds());
    }

    getFlatMinutes() {
        return this.internal.getFlatMinutes(this.getSkyBlockTime());
    }

    getAsMinutes() {
        return this.internal.getAsMinutes(this.getSkyBlockTime());
    }

    getAsHours() {
        return this.internal.getAsHours(this.getSkyBlockTime());
    }

    getAsDays() {
        return this.internal.getAsDays(this.getSkyBlockTime());
    }

    getAsSeasons() {
        return this.internal.getAsSeasons(this.getSkyBlockTime());
    }

    getAsYears() {
        return this.internal.getAsYears(this.getSkyBlockTime());
    }

    getCurrentMinute() {
        return this.internal.getCurrentMinute(this.getSkyBlockTime());
    }

    getCurrentHour() {
        return this.internal.getCurrentHour(this.getSkyBlockTime());
    }

    getCurrentDay() {
        return this.internal.getCurrentDay(this.getSkyBlockTime());
    }

    getCurrentSeason() {
        return this.internal.getCurrentSeason(this.getSkyBlockTime());
    }

    getCurrentSeasonName() {
        switch (this.getCurrentSeason()) {
            case SEASON_SPRING: return this.springName;
            case SEASON_SUMMER: return this.summerName;
            case SEASON_AUTUMN: return this.autumnName;
            case SEASON_WINTER: return this.winterName;
        }
    }

    getCurrentYear() {
        return this.internal.getCurrentYear(this.getSkyBlockTime());
    }

    getRainChance() {
        return this.internal.getRainChance(this.getSkyBlockTime());
    }

    isRaining() {
        return this.internal.isRaining(this.getSkyBlockTime());
    }

    isSnowing() {
        return this.internal.isSnowing(this.getSkyBlockTime());
    }
}

module.exports = {
    START_OF_TIMES,
    TIME_MULTIPLIER,

    SEASON_LENGTH,
    YEAR_LENGTH,

    SEASON_SPRING,
    SEASON_SUMMER,
    SEASON_AUTUMN,
    SEASON_WINTER,

    RAIN_CHANCE_STAGE,
    IS_RAINING_STAGE,
    TEMP_STAGE,
    PREFER_COLDER_STAGE,
    RANDOMIZED_STAGE,
    EVENT_STAGE,

    InternalCalendar,
    Calendar,
    CropType,
    FarmingContestUtils,
}
