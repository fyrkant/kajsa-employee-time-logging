import { expect } from 'chai';

import { parseDescription, stringifyDescription } from './stringUtils';

describe('string utils test', () => {
  it('parse description', () => {
    const input = `GENERAL:
lorem ipsum
bacon pizza

LOG:
12:45 - poop, pee, sleep
13:34 - pee
18:00 - sleep`;

    expect(parseDescription(input)).deep.equal({
      general: ['lorem ipsum', 'bacon pizza'],
      log: ['12:45 - poop, pee, sleep', '13:34 - pee', '18:00 - sleep'],
    });
  });
  it('parse description2', () => {
    const input = `GENERAL:
bacon pizza

LOG:`;

    expect(parseDescription(input)).deep.equal({
      general: ['bacon pizza'],
      log: [],
    });
  });

  it('stringify description', () => {
    const input = {
      general: ['lorem ipsum', 'bacon pizza'],
      log: [
        '12:45 - poop, pee, sleep',
        '18:00 - sleep',
        '13:34 - pee',
        '00:20 - pee',
      ],
    };

    expect(stringifyDescription(input)).equal(`GENERAL:
lorem ipsum
bacon pizza

LOG:
00:20 - pee
12:45 - poop, pee, sleep
13:34 - pee
18:00 - sleep`);
  });

  it('stringify description2', () => {
    const input = {
      general: ['lorem ipsum'],
      log: [],
    };

    expect(stringifyDescription(input)).equal(`GENERAL:
lorem ipsum

LOG:`);
  });
});
