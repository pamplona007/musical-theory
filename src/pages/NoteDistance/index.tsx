import { Box, Button, Container, Flex, Text } from '@radix-ui/themes';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Input from 'src/components/Input';
import Piano, { PianoRef } from 'src/components/Piano';
import { filterNotes, noteName } from 'src/utils';

const NoteDistance = () => {
    const [firstNoteIndex, setFirstNoteIndex] = useState<number | null>(null);
    const [secondNoteIndex, setSecondNoteIndex] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [consecutiveSuccess, setConsecutiveSuccess] = useState<number>(0);
    const [distanceValue, setDistanceValue] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const tonesNumber = Math.floor(distanceValue / 2);
    const extraSemitones = distanceValue % 2;

    const beginner = 5 > consecutiveSuccess;
    const advanced = 10 <= consecutiveSuccess;
    const superAdvanced = 15 <= consecutiveSuccess;

    const startingOctave = advanced ? 3: 4;
    const endingOctave = advanced ? 5 : 4;

    const filteredNotes = useMemo(() => filterNotes(startingOctave, endingOctave), [startingOctave, endingOctave]);

    const firstNote = (firstNoteIndex || 0 === firstNoteIndex) && filteredNotes[firstNoteIndex];
    const secondNote = (secondNoteIndex || 0 === secondNoteIndex) && filteredNotes[secondNoteIndex];

    const pianoRef = useRef<PianoRef>(null);

    const next = useCallback(() => {
        const firstNoteIndex = Math.floor(Math.random() * filteredNotes.length);
        const secondNoteIndex = Math.floor(Math.random() * (filteredNotes.length - firstNoteIndex)) + firstNoteIndex;

        setFirstNoteIndex(firstNoteIndex);
        setSecondNoteIndex(null);
        setTimeout(() => {
            setSecondNoteIndex(secondNoteIndex);
        }, 1000);
    }, [filteredNotes]);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!firstNote || !secondNote || !inputRef.current) {
            return;
        }

        const distanceValue = inputRef.current.value;
        inputRef.current.value = '';
        const distance = secondNoteIndex - firstNoteIndex;

        if (distance === Number(distanceValue)) {
            setSuccess(true);
            setConsecutiveSuccess(consecutiveSuccess + 1);

            setTimeout(() => {
                setSuccess(false);
                next();
            }, 1000);
            return;
        }

        setSuccess(false);
        setConsecutiveSuccess(0);
    }, [firstNote, secondNote, secondNoteIndex, firstNoteIndex, consecutiveSuccess, next]);

    useEffect(() => {
        if (!firstNote || !pianoRef.current) {
            return;
        }

        pianoRef.current.playNote(firstNote);
    }, [firstNote]);

    useEffect(() => {
        if (!secondNote || !pianoRef.current) {
            return;
        }

        pianoRef.current.playNote(secondNote);
    }, [secondNote]);

    useEffect(() => {
        next();
    }, [next]);

    const buildTonesString = (): string => {
        let string = '';

        string += `${tonesNumber} to${1 === tonesNumber ? 'm' : 'ns'}`;

        if (extraSemitones) {
            string += ` e ${extraSemitones} semitom${1 === extraSemitones ? '' : 's'}`;
        }

        return string;
    };

    return (
        <Container>
            <Flex
                justify={'center'}
                align={'center'}
                mt={'15vh'}
                mb={'8'}
                direction={'column'}
            >

                <Flex
                    align={'center'}
                    gap={'5'}
                >
                    {firstNote && (
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                pianoRef.current?.playNote(firstNote);
                            }}
                        >
                            <Text
                                size={'9'}
                                weight={'bold'}
                                color={success ? 'green' : 'gray'}
                            >
                                {noteName(firstNote, {
                                    simple: startingOctave === endingOctave,
                                    european: true,
                                })}
                            </Text>
                        </button>
                    )}

                    {secondNote && (
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                pianoRef.current?.playNote(secondNote);
                            }}
                        >
                            <Text
                                size={'9'}
                                weight={'bold'}
                                color={success ? 'green' : 'gray'}
                            >
                                {noteName(secondNote, {
                                    simple: startingOctave === endingOctave,
                                    european: true,
                                })}
                            </Text>
                        </button>
                    )}
                </Flex>

                <Text
                    size={'4'}
                    weight={'bold'}
                    color={success ? 'green' : 'gray'}
                >
                    {consecutiveSuccess}
                    {' '}
                    {1 === consecutiveSuccess ? 'acerto' : 'acertos'}
                </Text>
            </Flex>

            <form
                onSubmit={handleSubmit}
            >
                <Flex
                    justify={'center'}
                    align={'center'}
                    direction={'column'}
                    gap={'3'}
                    mb={'8'}
                >
                    <Flex
                        justify={'center'}
                        align={'center'}
                        gap={'3'}
                    >
                        <Input
                            type={'text'}
                            placeholder={'Distância em semitons'}
                            ref={inputRef}
                            onChange={(event) => {
                                setDistanceValue(Number(event.target.value));
                            }}
                            name={'semitons'}
                        />
                        <Button
                            type={'submit'}
                        >
                            {'Confirmar'}
                        </Button>
                    </Flex>
                    <Text>
                        {buildTonesString()}
                    </Text>
                </Flex>
            </form>

            <Box
                style={{
                    opacity: 1 - (0.2 * (consecutiveSuccess - 10)),
                }}
            >
                <Piano
                    startingOctave={startingOctave}
                    endingOctave={endingOctave}
                    displayNames={!superAdvanced}
                    activeNotes={beginner && [firstNote && noteName(firstNote), secondNote && noteName(secondNote)].filter(Boolean) as string[]}
                    ref={pianoRef}
                />
            </Box>
        </Container>
    );
};

export default NoteDistance;
