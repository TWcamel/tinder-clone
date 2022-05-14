import React, { useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const MatchesContext: React.Context<any> = React.createContext({});

export const useMatches: Function = () => useContext(MatchesContext);

export const MatchesProvider: React.FC<{ children: any }> = ({
    children,
}): any => {
    const [matches, setMatches] = useLocalStorage('matches', []);

    const createMatch: Function = (id: string, name: string) => {
        setMatches((prevMatches: any) => {
            return [...prevMatches, { id, name }];
        });
    };

    return (
        <MatchesContext.Provider value={{ matches, createMatch }}>
            {children}
        </MatchesContext.Provider>
    );
};
