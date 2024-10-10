import { Kbd } from '@radix-ui/themes';
import classNames from 'classnames';
import { PropsWithChildren, useCallback, useContext, useEffect } from 'react';
import { Note } from 'src/utils';

import { PianoContext } from '..';
import styles from './styles.module.scss';

type NoteComponentProps = {
    note: Note;
    handleNotePress?: (note: Note) => void;
    active?: boolean;
    keyboardKey?: string | false;
    success?: boolean;
    error?: boolean;
}

const NoteComponent = (props: PropsWithChildren<NoteComponentProps>) => {
    const {
        note,
        handleNotePress,
        children,
        active,
        keyboardKey,
        success,
        error,
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
                    [styles.success]: success,
                    [styles.error]: error,
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

export default NoteComponent;
