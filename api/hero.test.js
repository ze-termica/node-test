const bitmap = require('./hero.js');

test('adds 1 + 2 to equal 3', () => {
    console.log(bitmap);
    expect(bitmap().sum(1, 2)).toBe(3);
});