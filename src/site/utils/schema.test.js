const path = require('path');
const { Schema, pathTrimStart } = require('./schema');

describe('schema', () => {
    describe('Schema', () => {
        it('exists', () => {
            expect(Schema).toBeDefined();
        });

        it('generate', () => {
            expect(Schema({ path: path.join(__dirname, '..', '..', 'ui') }).generate()).toBeInstanceOf(Object);
        });
    });

    // Schema({ path: UI_PATH }).generate()

    describe('pathTrimStart', () => {
        it('exists', () => {
            expect(pathTrimStart).toBeDefined();
        });

        it('basic', () => {
            expect(pathTrimStart('/admin/test')).toEqual('admin/test');
        });
    });
});
