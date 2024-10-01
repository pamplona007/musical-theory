import { Flex, Kbd, ScrollArea } from '@radix-ui/themes';
import classNames from 'classnames';
import { createContext, ForwardedRef, forwardRef, PropsWithChildren, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { filterNotes, Note, noteName } from 'src/utils';
import { PolySynth } from 'tone';

import styles from './styles.module.scss';

export type PianoProps = {
    onNotePress?: (note: Note) => void;
    startingOctave?: number;
    endingOctave?: number;
    european?: boolean;
    displayNames?: boolean;
    activeNotes?: string[] | false;
}

export type PianoRef = {
    playNote: (note: Note, timing?: string) => void;
    attackNote: (note: Note) => void;
    releaseNote: (note: Note) => void;
    availableNotes: Note[];
}

type NoteComponentProps = {
    note: Note;
    handleNotePress?: (note: Note) => void;
    active?: boolean;
    keyboardKey?: string | false;
}

const keyboardKeys = ['a', 'w', 's', 'e', 'd', 'h', 'u', 'j', 'i', 'k', 'o', 'l'];
const PianoContext = createContext<PianoRef | null>(null);
const synth = new PolySynth().toDestination();

const NoteComponent = (props: PropsWithChildren<NoteComponentProps>) => {
    const {
        note,
        handleNotePress,
        children,
        active,
        keyboardKey,
    } = props;

    const isTouchDevice = 'ontouchstart' in window || 0 < navigator.maxTouchPoints;

    const {
        playNote,
        attackNote,
        releaseNote,
    } = useContext(PianoContext)!;

    const attackThisNote = useCallback(() => {
        attackNote(note);
        handleNotePress?.(note);
    }, [attackNote, handleNotePress, note]);

    const releaseThisNote = useCallback(() => {
        releaseNote(note);
    }, [releaseNote, note]);

    const playThisNote = useCallback(() => {
        playNote(note);
        handleNotePress?.(note);
    }, [playNote, note, handleNotePress]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === keyboardKey && !event.repeat) {
                attackThisNote();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === keyboardKey) {
                releaseThisNote();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [attackThisNote, keyboardKey, releaseThisNote]);

    return (
        <button
            className={classNames(
                styles.key,
                {
                    [styles.sharp]: note.isSharp,
                    [styles.active]: active,
                },
            )}
            onMouseLeave={() => releaseThisNote()}
            onMouseDown={() => !isTouchDevice && attackThisNote()}
            onMouseUp={() => !isTouchDevice && releaseThisNote()}
            onClick={() => isTouchDevice && playThisNote()}
        >
            {keyboardKey && (
                <Kbd
                    size={'2'}
                >
                    {keyboardKey}
                </Kbd>
            )}
            {children}
        </button>
    );
};

const Piano = (props: PianoProps, ref: ForwardedRef<PianoRef>) => {
    const {
        onNotePress,
        startingOctave = 3,
        endingOctave = 5,
        european = false,
        displayNames = true,
        activeNotes: externallyActiveNotes,
    } = props;

    const [activeNotes, setActiveNotes] = useState<string[]>([]);

    const filteredNotes = filterNotes(startingOctave, endingOctave);

    const refValue: PianoRef = useMemo(() => ({
        playNote: (note, timing = '8n') => {
            synth.triggerAttackRelease(note.id, timing);
        },
        attackNote: (note) => {
            if (activeNotes.includes(note.id)) {
                return;
            }

            setActiveNotes([...activeNotes, note.id]);
            synth.triggerAttack(note.id);
        },
        releaseNote: (note) => {
            setActiveNotes(activeNotes.filter((id) => id !== note.id));
            synth.triggerRelease(note.id);
        },
        availableNotes: filteredNotes,
    }), [activeNotes, filteredNotes]);

    useImperativeHandle(ref, () => refValue);

    const simple = startingOctave === endingOctave;

    return (
        <PianoContext.Provider value={refValue}>
            <ScrollArea className={styles['piano-wrapper']}>
                <Flex
                    justify={'center'}
                    className={styles.piano}
                >
                    {filteredNotes.map((note, index) => (
                        <NoteComponent
                            key={note.id}
                            note={note}
                            handleNotePress={onNotePress}
                            keyboardKey={simple && keyboardKeys[index]}
                            active={activeNotes.includes(note.id) || (externallyActiveNotes && externallyActiveNotes.includes(note.id))}
                        >
                            {displayNames && noteName(note, { simple, european })}
                        </NoteComponent>
                    ))}
                </Flex>
            </ScrollArea>
        </PianoContext.Provider>
    );
};

export default forwardRef<PianoRef, PianoProps>(Piano);
