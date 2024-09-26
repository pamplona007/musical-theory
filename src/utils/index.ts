export type Note = {
    name: string;
    european: string;
    frequency: number;
    octave: number;
    isSharp: boolean;
};

const getAudioFrequency = (n: number) => {
    return 27.5 * ((2**(1/12))**n);
};

export const getNotes = (): Note[] => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const europeanNames = ['Do', 'Do', 'Re', 'Re', 'Mi', 'Fa', 'Fa', 'Sol', 'Sol', 'La', 'La', 'Si'];
    const notes: Note[] = [];

    for (let octave = 0; 8 >= octave; octave++) {
        for (let i = 0; i < noteNames.length; i++) {
            const name = noteNames[i];
            const european = europeanNames[i];
            const isSharp = name.includes('#');
            const frequency = getAudioFrequency(i + (octave * 12) - 9); // A0 is 27.5Hz and C0 is 16.35Hz
            notes.push({ name: name.replace('#', ''), european, frequency, octave, isSharp });
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
