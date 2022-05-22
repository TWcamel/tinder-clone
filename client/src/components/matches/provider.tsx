import React, { useState, useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import MatchesService from '../../services/matchesService';
import LikesService from '../../services/likesService';

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
            const match = await LikesService.createLikesToken(
                currentUserEmail,
                id,
            );
            if (match.ok)
                setMatches((prevMatches: any) => {
                    return [...prevMatches, { id, name }];
                });
            else alert('You liked her!');
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
