import AnniversaryCalculator from './anniversaryCalculator.js'
import {years, months} from './periods/calendar'
import NumberGenerator from './domain/number_generator.js'
import GeneratedNumber from './domain/generated_number.js'

// plain number generator that generates natural numbers
const naturalNumberGenerator = new NumberGenerator(function* () {
    let number = 1
    while (true) {
        yield new GeneratedNumber(number)
        number++
    }
})

describe('anniversary calculator', () => {
    test('it works', () => {
        const birthday = new Date('1969-07-20 20:17:58Z')
        const now = new Date('2020-01-01 12:00:00Z')

        const min = new Date(now)
        min.setMonth(min.getMonth() - 24)
        const max = new Date(now)
        max.setMonth(max.getMonth() + 24)
        const anniversaryCalculator = new AnniversaryCalculator(min, max)
        anniversaryCalculator.addNumberGenerator(naturalNumberGenerator)
        anniversaryCalculator.addPeriod(years)

        const [upcoming, justPassed] = anniversaryCalculator.calculate(birthday, now)
        expect(justPassed.length).toEqual(2)
        expect(upcoming.length).toEqual(2)
    })
    test('it sorts dates ascending', () => {
        const birthday = new Date('1969-07-20 20:17:58Z')
        const now = new Date('2020-01-01 12:00:00Z')

        const min = new Date(now)
        min.setMonth(min.getMonth() - 24)
        const max = new Date(now)
        max.setMonth(max.getMonth() + 24)
        const anniversaryCalculator = new AnniversaryCalculator(min, max)
        anniversaryCalculator.addNumberGenerator(naturalNumberGenerator)
        anniversaryCalculator.addPeriod(years)
        anniversaryCalculator.addPeriod(months)

        const [upcoming, justPassed] = anniversaryCalculator.calculate(birthday, now)

        expect(justPassed.length).toBeGreaterThan(2)
        expect(upcoming.length).toBeGreaterThan(2)

        justPassed.reduce((prev, cur) => {
            if(prev !== undefined) {
                expect(cur.getTime()).toBeGreaterThanOrEqual(prev.getTime())
            }
            return cur
        })
        upcoming.reduce((prev, cur) => {
            if(prev !== undefined) {
                expect(cur.getTime()).toBeGreaterThanOrEqual(prev.getTime())
            }
            return cur
        })
    })
    test('it removes duplicate dates', () => {
        const birthday = new Date('1969-07-20 20:17:58Z')
        const now = new Date('2020-01-01 12:00:00Z')

        const min = new Date(now)
        min.setMonth(min.getMonth() - 24)
        const max = new Date(now)
        max.setMonth(max.getMonth() + 24)
        const anniversaryCalculator = new AnniversaryCalculator(min, max)
        anniversaryCalculator.addNumberGenerator(naturalNumberGenerator)
        anniversaryCalculator.addNumberGenerator(naturalNumberGenerator) // add a second time to create duplicates
        anniversaryCalculator.addPeriod(years)

        const [upcoming, justPassed] = anniversaryCalculator.calculate(birthday, now)

        expect(justPassed.length).toEqual(2)
        expect(upcoming.length).toEqual(2)
    })
    test('it takes the least odd date when there are duplicates', () => {
        const birthday = new Date('1969-07-20 20:17:58Z')
        const now = new Date('2020-01-01 12:00:00Z')

        const min = new Date(now)
        min.setMonth(min.getMonth())
        const max = new Date(now)
        max.setMonth(max.getMonth() + 12)
        const anniversaryCalculator = new AnniversaryCalculator(min, max)
        for (let i=10; i>0; i--) {
            const numberGenerator = new NumberGenerator(function* () {
                let number = 1
                while (true) {
                    yield new GeneratedNumber(number, `${i}`, i)
                    number++
                }
            })
            anniversaryCalculator.addNumberGenerator(numberGenerator)
        }

        anniversaryCalculator.addPeriod(years)

        const [upcoming, _] = anniversaryCalculator.calculate(birthday, now)

        expect(upcoming.length).toEqual(1)
        expect(upcoming[0].number.getOddity()).toEqual(1)
    })
    test('it classifies dates from earlier today as upcomming', () => {
        const birthday = new Date('1969-07-20 20:17:58') // @TODO: can we set a timezone?
        const now = new Date('2020-07-20 23:00:00')

        const min = new Date(now)
        min.setMonth(min.getMonth() - 1)
        const max = new Date(now)
        max.setMonth(max.getMonth() + 1)
        const anniversaryCalculator = new AnniversaryCalculator(min, max)
        anniversaryCalculator.addNumberGenerator(naturalNumberGenerator)
        anniversaryCalculator.addPeriod(years)

        const [upcoming, justPassed] = anniversaryCalculator.calculate(birthday, now)

        expect(justPassed.length).toEqual(0)
        expect(upcoming.length).toEqual(1)
    })
})