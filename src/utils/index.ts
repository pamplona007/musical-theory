export type Note = {
    id: string;
    name: string;
    european: string;
    frequency: number;
    octave: number;
    isSharp: boolean;
    midi: number;
};

const getAudioFrequency = (n: number) => {
    return 27.5 * ((2**(1/12))**n);
};

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const europeanNames = ['Do', 'Do', 'Re', 'Re', 'Mi', 'Fa', 'Fa', 'Sol', 'Sol', 'La', 'La', 'Si'];
const startingMIDI = 12;

export const getNotes = (): Note[] => {
    const notes: Note[] = [];

    for (let octave = 0; 8 >= octave; octave++) {
        for (let i = 0; i < noteNames.length; i++) {
            const name = noteNames[i];
            const european = europeanNames[i];
            const isSharp = name.includes('#');
            const frequency = getAudioFrequency(i + (octave * 12) - 9); // A0 is 27.5Hz and C0 is 16.35Hz

            notes.push({
                id: `${name}${octave}`,
                name: name.replace('#', ''),
                european,
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

export const noteName = (note: Note, options?: { simple?: boolean; european?:boolean }) => {
    const { simple = false, european = false } = options || {};

    return [
        european ? note.european : note.name,
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
