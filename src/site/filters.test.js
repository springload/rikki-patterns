const filters = require('./filters');

describe('filters', () => {
    it('exists', () => {
        expect(filters).toBeDefined();
    });

    describe('markdown', () => {
        it('exists', () => {
            expect(filters.markdown).toBeDefined();
        });

        it('works', () => {
            expect(filters.markdown('*bold*')).toEqual('<p><em>bold</em></p>\n');
        });

        it('no value', () => {
            expect(filters.markdown()).toEqual('');
        });
    });

    describe('pretty', () => {
        it('exists', () => {
            expect(filters.pretty).toBeDefined();
        });

        it('works', () => {
            expect(filters.pretty('<p>test</p><p>test</p>')).toEqual('<p>test</p>\n<p>test</p>');
        });
    });

    describe('slugify', () => {
        it('exists', () => {
            expect(filters.slugify).toBeDefined();
        });

        it('works', () => {
            expect(filters.slugify('Hello, World!')).toEqual('Hello-World!');
        });
    });

    describe('python_value', () => {
        it('exists', () => {
            expect(filters.python_value).toBeDefined();
        });

        it('works', () => {
            expect(filters.python_value(5)).toEqual('5');
            expect(filters.python_value(true)).toEqual('True');
            expect(filters.python_value(false)).toEqual('False');
            expect(filters.python_value(null)).toEqual('None');
        });

        it('bails for component references', () => {
            expect(filters.python_value({
                type: 'test',
                flavour: 'test',
                variant: 'test',
            })).toEqual('{...}');
        });
    });

    describe('reactProp', () => {
        it('exists', () => {
            expect(filters.reactProp).toBeDefined();
        });

        it('works', () => {
            expect(filters.reactProp(5)).toEqual('{5}');
            expect(filters.reactProp('test')).toEqual('"test"');
        });
    });

    describe.skip('richtext', () => {
        it('exists', () => {
            expect(filters.richtext).toBeDefined();
        });

        it('works', () => {
            expect(filters.richtext({
                type: 'list',
                flavour: 'base',
                variant: 'action',
            })).toEqual({ length: 75, val: '<ul class="list-action"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>\n' });
        });

        it('bails for non-component reference values', () => {
            expect(filters.richtext(5)).toEqual(5);
        });

        it('supports arrays of references', () => {
            expect(filters.richtext([
                {
                    type: 'list',
                    flavour: 'base',
                    variant: 'action',
                },
                {
                    type: 'list',
                    flavour: 'base',
                    variant: 'action',
                },
            ])).toEqual({ length: 150, val: '<ul class="list-action"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>\n<ul class="list-action"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>\n' });
        });
    });

    describe('safe', () => {
        it('exists', () => {
            expect(filters.safe).toBeDefined();
        });

        it('works', () => {
            expect(filters.safe(5)).toEqual(5);
        });
    });
});
