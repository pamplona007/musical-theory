import { useCallback, useEffect, useRef, useState } from 'react';

type UseLevelingProps = {
    levelCap?: number;
    levelMin?: number;
    experienceCap?: number;
    experienceMin?: number;
    localStorageKey?: string;
};

const useLeveling = ({
    levelCap = 3,
    levelMin = 0,
    experienceCap = 5,
    experienceMin = -3,
    localStorageKey,
}: UseLevelingProps = {}) => {
    const localStorageValues = localStorageKey ? JSON.parse(localStorage.getItem(localStorageKey) || '{}') : {};

    const [level, setLevel] = useState<number>(localStorageValues?.level || levelMin);
    const [consecutiveSuccess, setConsecutiveSuccess] = useState<number>(localStorageValues?.consecutiveSuccess || 0);
    const [personalBest, setPersonalBest] = useState<number>(localStorageValues?.personalBest || 0);
    const experience = useRef<number>(localStorageValues?.experience || 0);

    const updateExperience = useCallback((success: boolean) => {
        if (success) {
            setConsecutiveSuccess((consecutiveSuccess) => consecutiveSuccess + 1);
            experience.current = Math.min(experience.current + 1, experienceCap);
            return;
        }

        setConsecutiveSuccess(0);

        if (0 < experience.current) {
            experience.current = 0;
            return;
        }

        experience.current = Math.max(experience.current - 1, experienceMin);
    }, [experienceCap, experienceMin]);

    const updateLevel = useCallback(() => {
        if (experience.current >= experienceCap) {
            setLevel((level) => Math.min(level + 1, levelCap));
            experience.current = 0;
            return;
        }

        if (experience.current <= experienceMin) {
            setLevel((level) => Math.max(level - 1, levelMin));
            experience.current = 0;
        }
    }, [experienceCap, experienceMin, levelCap, levelMin]);

    const update = useCallback((success: boolean) => {
        updateExperience(success);
        updateLevel();
    }, [updateExperience, updateLevel]);

    useEffect(() => {
        if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify({
                level,
                experience: experience.current,
                consecutiveSuccess,
                personalBest,
            }));
        }
    }, [consecutiveSuccess, level, localStorageKey, personalBest]);

    useEffect(() => {
        if (consecutiveSuccess > personalBest) {
            setPersonalBest(consecutiveSuccess);
        }
    }, [consecutiveSuccess, personalBest]);

    return {
        level,
        experience,
        update,
        personalBest,
        consecutiveSuccess,
    };
};

export default useLeveling;
