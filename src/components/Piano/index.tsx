import { Flex, ScrollArea } from '@radix-ui/themes';
import classNames from 'classnames';
import { ForwardedRef, forwardRef, PropsWithChildren, useImperativeHandle } from 'react';
import { filterNotes, Note, noteName } from 'src/utils';
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
}

function playNote(note: Note, timing = '8n') {
    const synth = new Synth().toDestination();
    synth.triggerAttackRelease(noteName(note), timing);
}

const NoteComponent = (props: PropsWithChildren<NoteComponentProps>) => {
    const {
        note,
        handleNotePress,
        children,
        active,
    } = props;

    return (
        <button
            key={noteName(note)}
            className={classNames(
                styles.key,
                {
                    [styles.sharp]: note.isSharp,
                    [styles.active]: active,
                },
            )}
            onMouseDown={() => {
                playNote(note);
                handleNotePress?.(note);
            }}
        >
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
                {filteredNotes.map((note) => (
                    <NoteComponent
                        key={noteName(note)}
                        note={note}
                        handleNotePress={onNotePress}
                        active={activeNotes && activeNotes.includes(noteName(note))}
                    >
                        {displayNames && noteName(note, { simple, european })}
                    </NoteComponent>
                ))}
            </Flex>
        </ScrollArea>
    );
};

export default forwardRef<PianoRef, PianoProps>(Piano);
