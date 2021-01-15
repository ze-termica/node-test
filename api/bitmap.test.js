const bitmap = require('./bitmap.js');

// FIXME: Test
test('Validate input vector', () => {
    console.log(bitmap);
    expect(bitmap().getBitmapElementNumbers([1,2,4,6,15])).toBe(true);
    expect(bitmap().getBitmapElementNumbers([1,2,24,6,15])).toBe(false);
});