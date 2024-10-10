import { Box, Flex, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Piano, { PianoRef } from 'src/components/Piano';
import { filterNotes, getIntervalNote, Note, noteName, intervals } from 'src/utils';

const IntervalExercise = () => {
    const availableNotes = filterNotes(4, 4);

    const { t } = useTranslation();

    const [rootNote, setRootNote] = useState<Note>(availableNotes[0]);
    const [selectedInterval, setSelectedInterval] = useState(intervals[0]);
    const [hitNotes, setHitNotes] = useState<Note[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    const pianoRef = useRef<PianoRef>(null);

    const selectRandomInterval = useCallback(() => {
        const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];
        setSelectedInterval(randomInterval);
    }, []);

    const targetNote = getIntervalNote(rootNote, selectedInterval);

    const next = useCallback(() => {
        if (!pianoRef.current) {
            return;
        }

        const note = availableNotes[Math.floor(Math.random() * availableNotes.length)];
        setRootNote(note);
        setHitNotes([]);
        selectRandomInterval();
        pianoRef.current.playNote(note);
    }, [availableNotes, selectRandomInterval]);

    const correctHitNote = hitNotes.find((note) => note.midi === targetNote?.midi);
    const wrongHitNotes = hitNotes.filter((note) => note.midi !== targetNote?.midi);

    useEffect(() => {
        if (correctHitNote && !success) {
            setSuccess(true);

            setTimeout(() => {
                next();
                setSuccess(false);
            }, 1000);
        }
    }, [correctHitNote, next, success]);

    return (
        <>
            <Flex
                justify={'center'}
                align={'center'}
                direction={'column'}
                mt={{
                    initial: '1vh',
                    md: '3vh',
                }}
            >
                <Text
                    size={{
                        initial: '7',
                        md: '9',
                    }}
                    weight={'bold'}
                    color={'gray'}
                    align={'center'}
                >
                    {t(`interval.${selectedInterval.name}`)}
                </Text>
            </Flex>

            <Flex
                justify={'center'}
                align={'center'}
                direction={'column'}
                my={{
                    initial: '.5vh',
                    md: '1vh',
                }}
            >
                <Text
                    size={{
                        initial: '5',
                        md: '7',
                    }}
                    color={'gray'}
                >
                    {t('from')}
                </Text>
            </Flex>

            <Flex
                justify={'center'}
                align={'center'}
                direction={'column'}
            >
                <button
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        pianoRef.current?.playNote(rootNote);
                    }}
                >
                    <Text
                        size={'9'}
                        weight={'bold'}
                        color={'gray'}
                    >
                        {noteName(rootNote, {
                            simple: true,
                        })}
                    </Text>
                </button>
            </Flex>

            <Box mt={'9'}>
                <Piano
                    startingOctave={4}
                    endingOctave={5}
                    ref={pianoRef}
                    onNotePress={(note) => {
                        if (!hitNotes.includes(note)) {
                            setHitNotes([...hitNotes, note]);
                        }
                    }}
                    successNotes={correctHitNote ? [correctHitNote.id] : []}
                    errorNotes={wrongHitNotes.map((note) => note.id)}
                    simple
                />
            </Box>
        </>
    );
};

export default IntervalExercise;
