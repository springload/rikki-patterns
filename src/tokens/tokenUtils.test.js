const {
    makeCSSName,
    makeCSSVariable,
    mapToCSS,
    quote,
} = require('./tokenUtils');

describe('tokenUtils', () => {
    describe('makeCSSName', () => {
        it('works', () => {
            expect(makeCSSName('Very Bold')).toEqual('$very-bold');
        });

        it('prefix', () => {
            expect(makeCSSName('Light Blue', 'color')).toEqual(
                '$color-light-blue',
            );
        });
    });

    describe('makeCSSVariable', () => {
        it('works', () => {
            expect(makeCSSVariable('color', 'Light Blue', '#0000ff')).toEqual(
                '$color-light-blue: #0000ff;',
            );
        });
    });

    describe('mapToCSS', () => {
        it('works', () => {
            expect(mapToCSS('color', { name: 'potato' })).toEqual({
                cssName: '$color-potato',
                humanName: 'Potato',
                name: 'potato',
            });
        });
    });

    describe('quote', () => {
        it('works', () => {
            expect(quote(5)).toEqual('"5"');
        });
    });
});
