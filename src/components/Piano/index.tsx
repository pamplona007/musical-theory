import { Flex, Kbd, ScrollArea } from '@radix-ui/themes';
import classNames from 'classnames';
import { ForwardedRef, forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useState } from 'react';
import { filterNotes, Note, noteName, notes } from 'src/utils';
import { Synth } from 'tone';

import styles from './styles.module.scss';

type PianoProps = {
    onNotePress?: (note: Note) => void;
    startingOctave?: number;
    endingOctave?: number;
    european?: boolean;
    displayNames?: boolean;
    activeNotes?: string[] | false;
}

export type PianoRef = {
    playNote: (note: Note, timing?: string) => void;
}

type NoteComponentProps = {
    note: Note;
    handleNotePress?: (note: Note) => void;
    active?: boolean;
    keyboardKey?: string | false;
}

function playNote(note: Note, timing = '8n') {
    const synth = new Synth().toDestination();
    synth.triggerAttackRelease(note.id, timing);
}

const keyboardKeys = ['a', 'w', 's', 'e', 'd', 'h', 'u', 'j', 'i', 'k', 'o', 'l'];

const NoteComponent = (props: PropsWithChildren<NoteComponentProps>) => {
    const {
        note,
        handleNotePress,
        children,
        active: _active,
        keyboardKey,
    } = props;

    console.log(notes);

    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === keyboardKey) {
                playNote(note);
                handleNotePress?.(note);
                setActive(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === keyboardKey) {
                setActive(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [note, handleNotePress, keyboardKey]);

    return (
        <button
            className={classNames(
                styles.key,
                {
                    [styles.sharp]: note.isSharp,
                    [styles.active]: active || _active,
                },
            )}
            onMouseDown={() => {
                playNote(note);
                handleNotePress?.(note);
            }}
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
        activeNotes = [],
    } = props;

    const simple = startingOctave === endingOctave;

    const filteredNotes = filterNotes(startingOctave, endingOctave);

    useImperativeHandle(ref, () => ({
        playNote,
    }));

    return (
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
                        active={activeNotes && activeNotes.includes(note.id)}
                    >
                        {displayNames && noteName(note, { simple, european })}
                    </NoteComponent>
                ))}
            </Flex>
        </ScrollArea>
    );
};

export default forwardRef<PianoRef, PianoProps>(Piano);
