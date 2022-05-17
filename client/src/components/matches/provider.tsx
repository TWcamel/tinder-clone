import React, { useState, useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const MatchesContext: React.Context<any> = React.createContext({});

export const useMatches: Function = () => useContext(MatchesContext);

export const MatchesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}): any => {
    const [matches, setMatches] = useLocalStorage('matches', []);
    const [selectedMatchedIndex, setSelectedMatchedIndex] = useState(0);

    const createMatch: Function = (id: string, name: string) => {
        setMatches((prevMatches: any) => {
            return [...prevMatches, { id, name }];
        });
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
