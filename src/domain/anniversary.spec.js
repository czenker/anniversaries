import Anniversary from './anniversary'
import GeneratedNumber from './generated_number'
import GeneratedDate from './generated_date'

describe('getStaticId', () => {
    test('is a number that is consistent with its number and its time period', () => {
        const number = new GeneratedNumber(42)
        const date = new GeneratedDate(new Date('1969-07-20 20:17:58Z'), "mock")
        const anniversary = new Anniversary(number, date)

        expect(anniversary.getStaticId()).toBeGreaterThan(0)
        expect(anniversary.getStaticId()).toEqual(anniversary.getStaticId())

        const anniversary2 = new Anniversary(number, date)
        expect(anniversary2.getStaticId()).toEqual(anniversary.getStaticId())
    })
    test('it does not correlate with the date', () => {
        const number = new GeneratedNumber(1)
        const date = new GeneratedDate(new Date('1969-07-20 20:17:58Z'), "mock")
        const date2 = new GeneratedDate(new Date(date.getDate()), "mock")
        date2.getDate().setSeconds(date2.getDate().getSeconds() + 999)
        const anniversary = new Anniversary(number, date)
        const anniversary2 = new Anniversary(number, date2)

        expect(anniversary.getStaticId()).toEqual(anniversary2.getStaticId())
    })
    test('it is different for different numbers and time periods', () => {
        const number1 = new GeneratedNumber(1)
        const number2 = new GeneratedNumber(2)
        const date1 = new GeneratedDate(new Date('1969-07-20 20:17:58Z'), "mock1")
        const date2 = new GeneratedDate(new Date('1969-07-20 20:17:58Z'), "mock2")

        const anniversary1 = new Anniversary(number1, date1)
        const anniversary2 = new Anniversary(number1, date2)
        const anniversary3 = new Anniversary(number2, date1)
        const anniversary4 = new Anniversary(number2, date2)

        expect(anniversary1.getStaticId()).not.toEqual(anniversary2.getStaticId())
        expect(anniversary1.getStaticId()).not.toEqual(anniversary3.getStaticId())
        expect(anniversary1.getStaticId()).not.toEqual(anniversary2.getStaticId())
        expect(anniversary2.getStaticId()).not.toEqual(anniversary3.getStaticId())
        expect(anniversary2.getStaticId()).not.toEqual(anniversary4.getStaticId())
        expect(anniversary3.getStaticId()).not.toEqual(anniversary4.getStaticId())
    })
})
