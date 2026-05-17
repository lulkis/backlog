const { cleanPath } = require('../utils/utils');

test('Leerzeichen werden zu Unterstrichen', () => {
    expect(cleanPath('The Dark Knight')).toBe('the_dark_knight');
});

test('Path Traversal wird blockiert', () => {
    expect(cleanPath('../../app.js')).toBe('app.js');
});

test('Doppelpunkte werden entfernt', () => {
    expect(cleanPath('Batman: Begins')).toBe('batman_begins');
});
