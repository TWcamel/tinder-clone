import React, { useState, useContext } from 'react';
import Matches from '.';
import useLocalStorage from '../../hooks/useLocalStorage';
import MatchesService from '../../services/matchesService';

const MatchesContext: React.Context<any> = React.createContext({});

export const useMatches: Function = () => useContext(MatchesContext);

export const MatchesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}): any => {
    const [matches, setMatches] = useLocalStorage('matches', []);
    const [selectedMatchedIndex, setSelectedMatchedIndex] = useState(0);

    const createMatch: Function = (
        id: string,
        name: string,
        currentUserEmail: string,
    ) => {
        (async () => {
            const match = await MatchesService.createMatchPair(
                currentUserEmail,
                id,
            );
            if (match.ok)
                setMatches((prevMatches: any) => {
                    return [...prevMatches, { id, name }];
                });
            else alert('Match pair have been created!');
        })();
    };

    const formattedMatches = matches.map((match: any, index: number) => {
        return {
            ...match,
            isSelected: index === selectedMatchedIndex,
        };
    });

    const value = {
        matches: formattedMatches,
        selectMatchIndex: setSelectedMatchedIndex,
        createMatch,
    };

    return (
        <MatchesContext.Provider value={value}>
            {children}
        </MatchesContext.Provider>
    );
};
