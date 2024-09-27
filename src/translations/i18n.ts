import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const languages = [
    {
        id: 'pt',
        name: 'Português',
    },
    {
        id: 'en',
        name: 'English',
    },
];

const resources = {
    pt: {
        translation: {
            'tone_one': '{{count}} tom',
            'tone_other': '{{count}} tons',
            'semitone_one': '{{count}} semitom',
            'semitone_other': '{{count}} semitons',
            'hits_one': '{{count}} acerto',
            'hits_other': '{{count}} acertos',
            'tones_and_semitones': '$t(tone, {"count": {{tones}} }) e $t(semitone, {"count": {{semitones}} })',
            'distance_in_semitones': 'Distância em semitons',
            'confirm': 'Confirmar',

            'card.note_names.title': 'Nome das notas',
            'card.note_names.description': 'Vamos praticar o nome das notas musicais',
            'card.note_distances.title': 'Distância entre notas',
            'card.note_distances.description': 'Diga a distância entre duas notas em tons e semitons',
            'card.note_intervals.title': 'Intervalos',
            'card.note_intervals.description': 'Vamos praticar a identificação de intervalos musicais',
            'card.note_read.title': 'Leitura de partituras',
            'card.note_read.description': 'Pratique a leitura de partituras identificando notas',
        },
    },
    en: {
        translation: {
            'tone_one': '{{count}} tone',
            'tone_other': '{{count}} tones',
            'semitone_one': '{{count}} semitone',
            'semitone_other': '{{count}} semitones',
            'hits_one': '{{count}} hit',
            'hits_other': '{{count}} hits',
            'tones_and_semitones': '$t(tone, {"count": {{tones}} }) and $t(semitone, {"count": {{semitones}} })',
            'distance_in_semitones': 'Distance in semitones',
            'confirm': 'Confirm',

            'card.note_names.title': 'Note Names',
            'card.note_names.description': 'Let\'s practice the names of musical notes',
            'card.note_distances.title': 'Note Distances',
            'card.note_distances.description': 'Say the distance between two notes in tones and semitones',
            'card.note_intervals.title': 'Intervals',
            'card.note_intervals.description': 'Let\'s practice identifying musical intervals',
            'card.note_read.title': 'Sheet Music Reading',
            'card.note_read.description': 'Practice sheet music reading by identifying notes',
        },
    },
};

i18next
    .createInstance()
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: languages.map(({ id }) => id),
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18next;
