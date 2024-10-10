import i18n from '../translations/i18n';

export type Note = {
    id: string;
    name: string;
    frequency: number;
    octave: number;
    isSharp: boolean;
    midi: number;
};

const getAudioFrequency = (n: number) => {
    return 27.5 * ((2**(1/12))**n);
};

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const startingMIDI = 12;

export const getNotes = (): Note[] => {
    const notes: Note[] = [];

    for (let octave = 0; 8 >= octave; octave++) {
        for (let i = 0; i < noteNames.length; i++) {
            const name = noteNames[i];
            const isSharp = name.includes('#');
            const frequency = getAudioFrequency(i + (octave * 12) - 9); // A0 is 27.5Hz and C0 is 16.35Hz

            notes.push({
                id: `${name}${octave}`,
                name: name.replace('#', ''),
                frequency,
                octave,
                isSharp,
                midi: i + (octave * 12) + startingMIDI,
            });
        }
    }

    return notes;
};

export const notes = getNotes();

export const filterNotes = (startingOctave: number, endingOctave: number) => {
    return notes.filter((note) => (
        note.octave >= startingOctave && note.octave <= endingOctave
    ));
};

export const noteName = (note: Note, options?: { simple?: boolean; latin?:boolean }) => {
    const { simple = false } = options || {};

    return [
        i18n.t(note.name),
        note.isSharp && '#',
        !simple && note.octave,
    ].filter(Boolean).join('');
};

export const scales = [
    {
        name: 'major',
        notes: [2, 2, 1, 2, 2, 2, 1],
    },
    {
        name: 'minor',
        notes: [2, 1, 2, 2, 1, 2, 2],
    },
    {
        name: 'harmonic_minor',
        notes: [2, 1, 2, 2, 1, 3, 1],
    },
    {
        name: 'melodic_minor',
        notes: [2, 1, 2, 2, 2, 2, 1],
    },
    {
        name: 'pentatonic_major',
        notes: [2, 2, 3, 2, 3],
    },
    {
        name: 'pentatonic_minor',
        notes: [3, 2, 2, 3, 2],
    },
    {
        name: 'blues',
        notes: [3, 2, 1, 1, 3, 2],
    },
    {
        name: 'whole_tone',
        notes: [2, 2, 2, 2, 2, 2],
    },
    {
        name: 'diminished',
        notes: [1, 2, 1, 2, 1, 2, 1, 2],
    },
];

export const getScale = (note: Note, scale: string, options?: { ascending?: boolean, octaves?: number }) => {
    const scaleConfig = scales.find(({ name }) => name === scale);

    if (!scaleConfig) {
        return [];
    }

    const { ascending = true, octaves = 1 } = options || {};
    const scaleNotes: Note[] = [note];
    let currentNoteIndex = notes.findIndex((n) => n.id === note.id);

    if (-1 === currentNoteIndex) {
        return [];
    }

    for (let octave = 0; octave < octaves; octave++) {
        for (const interval of scaleConfig.notes) {
            currentNoteIndex += ascending ? interval : -interval;
            scaleNotes.push(notes[currentNoteIndex]);

            if (currentNoteIndex >= notes.length || 0 > currentNoteIndex) {
                break;
            }
        }
    }

    scaleNotes.pop();

    return scaleNotes;
};

interface IInterval {
    name: string;
    semitones: number;
    short: string;
}

export const intervals = [
    {
        name: 'perfect_unison',
        semitones: 0,
        short: 'P1',
    },
    {
        name: 'diminished_second',
        semitones: 0,
        short: 'd2',
    },
    {
        name: 'minor_second',
        semitones: 1,
        short: 'm2',
    },
    {
        name: 'augmented_unison',
        semitones: 1,
        short: 'A1',
    },
    {
        name: 'major_second',
        semitones: 2,
        short: 'M2',
    },
    {
        name: 'diminished_third',
        semitones: 2,
        short: 'd3',
    },
    {
        name: 'minor_third',
        semitones: 3,
        short: 'm3',
    },
    {
        name: 'augmented_second',
        semitones: 3,
        short: 'A2',
    },
    {
        name: 'major_third',
        semitones: 4,
        short: 'M3',
    },
    {
        name: 'diminished_fourth',
        semitones: 4,
        short: 'd4',
    },
    {
        name: 'perfect_fourth',
        semitones: 5,
        short: 'P4',
    },
    {
        name: 'augmented_third',
        semitones: 5,
        short: 'A3',
    },
    {
        name: 'diminished_fifth',
        semitones: 5,
        short: 'd5',
    },
    {
        name: 'augmented_fourth',
        semitones: 6,
        short: 'A4',
    },
    {
        name: 'perfect_fifth',
        semitones: 7,
        short: 'P5',
    },
    {
        name: 'diminished_sixth',
        semitones: 7,
        short: 'd6',
    },
    {
        name: 'minor_sixth',
        semitones: 8,
        short: 'm6',
    },
    {
        name: 'augmented_fifth',
        semitones: 8,
        short: 'A5',
    },
    {
        name: 'major_sixth',
        semitones: 9,
        short: 'M6',
    },
    {
        name: 'diminished_seventh',
        semitones: 9,
        short: 'd7',
    },
    {
        name: 'minor_seventh',
        semitones: 10,
        short: 'm7',
    },
    {
        name: 'augmented_sixth',
        semitones: 10,
        short: 'A6',
    },
    {
        name: 'major_seventh',
        semitones: 11,
        short: 'M7',
    },
    {
        name: 'diminished_octave',
        semitones: 11,
        short: 'd8',
    },
    {
        name: 'perfect_octave',
        semitones: 12,
        short: 'P8',
    },
    {
        name: 'augmented_seventh',
        semitones: 12,
        short: 'A7',
    },
];

export const getIntervalNote = (note: Note, interval: IInterval, options?: { ascending?: boolean }) => {
    const { ascending = true } = options || {};

    const noteIndex = notes.findIndex((n) => n.id === note.id);

    if (-1 === noteIndex) {
        return null;
    }

    const targetNoteIndex = noteIndex + (ascending ? interval.semitones : -interval.semitones);
    const targetNote = notes[targetNoteIndex];

    if (!targetNote) {
        return null;
    }

    return targetNote;
};
