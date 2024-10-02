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
    {
        id: 'fr',
        name: 'Français',
    },
];

const resources = {
    pt: {
        translation: {
            'tone_one': '{{count}} tom',
            'tone_other': '{{count}} tons',
            'semitone_one': '{{count}} semitom',
            'semitone_other': '{{count}} semitons',
            'hits_zero': '{{count}} acertos',
            'hits_one': '{{count}} acerto',
            'hits_other': '{{count}} acertos',
            'personal_best': 'Recorde pessoal: {{count}}',
            'tones_and_semitones': '$t(tone, {"count": {{tones}} }) e $t(semitone, {"count": {{semitones}} })',
            'distance_in_semitones': 'Distância em semitons',
            'confirm': 'Confirmar',
            'start': 'Iniciar',

            'C': 'Dó',
            'D': 'Ré',
            'E': 'Mi',
            'F': 'Fá',
            'G': 'Sol',
            'A': 'Lá',
            'B': 'Si',

            'card.note_names.title': 'Nome das notas',
            'card.note_names.description': 'Vamos praticar o nome das notas musicais',
            'card.note_distances.title': 'Distância entre notas',
            'card.note_distances.description': 'Diga a distância entre duas notas em tons e semitons',
            'card.note_intervals.title': 'Intervalos',
            'card.note_intervals.description': 'Vamos praticar a identificação de intervalos musicais',
            'card.note_read.title': 'Leitura de partituras',
            'card.note_read.description': 'Pratique a leitura de partituras identificando notas',
            'card.scales.title': 'Escalas',
            'card.scales.description': 'Pratique a formação de escalas musicais',

            'scale.major': 'Maior',
            'scale.minor': 'Menor',
            'scale.harmonic_minor': 'Menor Harmônica',
            'scale.melodic_minor': 'Menor Melódica',
            'scale.pentatonic_major': 'Pentatônica Maior',
            'scale.pentatonic_minor': 'Pentatônica Menor',
            'scale.blues': 'Blues',
            'scale.whole_tone': 'Tom Inteiro',
            'scale.diminished': 'Diminuta',
        },
    },
    en: {
        translation: {
            'tone_one': '{{count}} tone',
            'tone_other': '{{count}} tones',
            'semitone_one': '{{count}} semitone',
            'semitone_other': '{{count}} semitones',
            'hits_zero': '{{count}} hits',
            'hits_one': '{{count}} hit',
            'hits_other': '{{count}} hits',
            'personal_best': 'Personal Best: {{count}}',
            'tones_and_semitones': '$t(tone, {"count": {{tones}} }) and $t(semitone, {"count": {{semitones}} })',
            'distance_in_semitones': 'Distance in semitones',
            'confirm': 'Confirm',
            'start': 'Start',

            'C': 'C',
            'D': 'D',
            'E': 'E',
            'F': 'F',
            'G': 'G',
            'A': 'A',
            'B': 'B',

            'card.note_names.title': 'Note Names',
            'card.note_names.description': 'Let\'s practice the names of musical notes',
            'card.note_distances.title': 'Note Distances',
            'card.note_distances.description': 'Say the distance between two notes in tones and semitones',
            'card.note_intervals.title': 'Intervals',
            'card.note_intervals.description': 'Let\'s practice identifying musical intervals',
            'card.note_read.title': 'Sheet Music Reading',
            'card.note_read.description': 'Practice sheet music reading by identifying notes',
            'card.scales.title': 'Scales',
            'card.scales.description': 'Practice building musical scales',

            'scale.major': 'Major',
            'scale.minor': 'Minor',
            'scale.harmonic_minor': 'Harmonic Minor',
            'scale.melodic_minor': 'Melodic Minor',
            'scale.pentatonic_major': 'Pentatonic Major',
            'scale.pentatonic_minor': 'Pentatonic Minor',
            'scale.blues': 'Blues',
            'scale.whole_tone': 'Whole Tone',
            'scale.diminished': 'Diminished',
        },
    },
    fr: {
        translation: {
            'tone_one': '{{count}} ton',
            'tone_other': '{{count}} tons',
            'semitone_one': '{{count}} demi-ton',
            'semitone_other': '{{count}} demi-tons',
            'hits_zero': '{{count}} hits',
            'hits_one': '{{count}} hit',
            'hits_other': '{{count}} hits',
            'personal_best': 'Record personnel : {{count}}',
            'tones_and_semitones': '$t(tone, {"count": {{tones}} }) et $t(semitone, {"count": {{semitones}} })',
            'distance_in_semitones': 'Distance en demi-tons',
            'confirm': 'Confirmer',
            'start': 'Démarrer',

            'C': 'Do',
            'D': 'Ré',
            'E': 'Mi',
            'F': 'Fa',
            'G': 'Sol',
            'A': 'La',
            'B': 'Si',

            'card.note_names.title': 'Noms des notes',
            'card.note_names.description': 'Pratiquons les noms des notes de musique',
            'card.note_distances.title': 'Distances entre les notes',
            'card.note_distances.description': 'Dites la distance entre deux notes en tons et demi-tons',
            'card.note_intervals.title': 'Intervalles',
            'card.note_intervals.description': 'Pratiquons l\'identification des intervalles musicaux',
            'card.note_read.title': 'Lecture de partitions',
            'card.note_read.description': 'Pratiquez la lecture de partitions en identifiant les notes',
            'card.scales.title': 'Gammes',
            'card.scales.description': 'Pratiquez la construction de gammes musicales',

            'scale.major': 'Majeur',
            'scale.minor': 'Mineur',
            'scale.harmonic_minor': 'Mineur Harmonique',
            'scale.melodic_minor': 'Mineur Mélodique',
            'scale.pentatonic_major': 'Pentatonique Majeure',
            'scale.pentatonic_minor': 'Pentatonique Mineure',
            'scale.blues': 'Blues',
            'scale.whole_tone': 'Tons Entiers',
            'scale.diminished': 'Diminuée',
        },
    },
};

const i18n = i18next
    .createInstance();

i18n
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

export default i18n;
