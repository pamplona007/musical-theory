import { Note, notes } from 'src/utils';
import { Synth } from 'tone';

type Events = 'note' | 'chord' | 'arpeggio' | 'tunechange';

type TuneChangeEvent = CustomEvent<Note[]>;

abstract class StringInstrument {
    public stringQuantity: number;
    public fretQuantity: number;
    public notes: Note[][] = [];
    private _tune: Note[] = [];
    private _stringSynths: Synth[];
    private _eventListeners: { [key: string]: EventListener } = {};

    constructor(stringQuantity: number, tune: Note[], fretQuantity: number) {
        this.stringQuantity = stringQuantity;
        this.fretQuantity = fretQuantity;
        this.tune = tune;
        this._stringSynths = Array.from({ length: stringQuantity }, () => new Synth().toDestination());
    }

    set tune(tune: Note[]) {
        const newNotes: Note[][] = [];

        for (let i = 0; i < this.stringQuantity; i++) {
            const stringTune = tune[i];
            const stringNotes: Note[] = [];
            const startingIndex = notes.findIndex((note) => note.id === stringTune.id);

            for (let j = startingIndex; j < startingIndex + this.fretQuantity; j++) {
                const note = notes[j % notes.length];

                stringNotes.push(note);
            }

            newNotes.push(stringNotes);
        }

        this._tune = tune;
        this.notes = newNotes;
        this._eventListeners.tunechange?.call(
            this,
            new CustomEvent('tunechange', { detail: tune }) as TuneChangeEvent,
        );
    }

    get tune(): Note[] {
        return this._tune;
    }

    get stringSynths(): Synth[] {
        return this._stringSynths;
    }

    playNote(string: number, fret: number) {
        const synth = this.stringSynths[string];
        const note = this.notes[string][fret];

        synth.triggerAttackRelease(note.id, '8n');
        this._eventListeners.note?.call(
            this,
            new CustomEvent('note', { detail: note }),
        );
    }

    playChord(frets: number[]) {
        const playedNotes: Note[] = [];

        for (let i = 0; i < this.stringQuantity; i++) {
            const fret = frets[i];

            if (-1 !== fret) {
                this.playNote(i, fret);
                playedNotes.push(this.notes[i][fret]);
            }
        }

        this._eventListeners.chord?.call(
            this,
            new CustomEvent('chord', { detail: playedNotes }),
        );
    }

    playArpeggio(frets: number[], duration: string) {
        const playedNotes: Note[] = [];

        for (let i = 0; i < this.stringQuantity; i++) {
            const fret = frets[i];

            if (-1 !== fret) {
                const synth = this.stringSynths[i];
                const note = this.notes[i][fret];

                synth.triggerAttackRelease(note.id, duration);
                playedNotes.push(note);
            }
        }

        this._eventListeners.arpeggio?.call(
            this,
            new CustomEvent('arpeggio', { detail: playedNotes }),
        );
    }

    addEventListener(event: Events, listener: EventListener) {
        this._eventListeners[event] = listener;
    }
}

const defaultGuitarTune: Note[] = [
    notes.find((note) => 'E2' === note.id) as Note,
    notes.find((note) => 'A2' === note.id) as Note,
    notes.find((note) => 'D3' === note.id) as Note,
    notes.find((note) => 'G3' === note.id) as Note,
    notes.find((note) => 'B3' === note.id) as Note,
    notes.find((note) => 'E4' === note.id) as Note,
];

class Guitar extends StringInstrument {
    constructor({
        stringQuantity = 6,
        tune = defaultGuitarTune,
        fretQuantity = 22,
    } = {}) {
        super(stringQuantity, tune, fretQuantity);
    }
}

export { Guitar };
