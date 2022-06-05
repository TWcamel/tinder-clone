import React, { useState, useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import MatchesService from '../../services/matchesService';
import LikesService from '../../services/likesService';

interface IMatch {
    name: string;
    email: string;
    id: string;
}
interface IMatches extends IMatch {
    matchedUser: IMatch[];
    user: IMatch[];
}

const MatchesContext: React.Context<any> = React.createContext({});

export const useMatches: Function = () => useContext(MatchesContext);

export const MatchesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}): any => {
    const [userId] = useLocalStorage('userId');
    const [matches, setMatches] = useLocalStorage('matches', []);
    const [selectedMatchedIndex, setSelectedMatchedIndex] = useState(0);

    const fetchMatches = React.useCallback(async () => {
        if (matches.length === 0) {
            const _matches = await MatchesService.getMatches(userId);
            Array.prototype.forEach.call(
                _matches.data,
                async ({ matchedUser, user }: IMatches) => {
                    let formattedMatchedUser = { name: '', id: '' };

                    if (matchedUser[0].email === userId) {
                        formattedMatchedUser.name = user[0].name;
                        formattedMatchedUser.id = user[0].email;
                    } else if (user[0].email === userId) {
                        formattedMatchedUser.name = matchedUser[0].name;
                        formattedMatchedUser.id = matchedUser[0].email;
                    }
                    setMatches((prevState: any) => [
                        ...prevState.filter(
                            ({ id }: IMatch) => id !== formattedMatchedUser.id,
                        ),
                        formattedMatchedUser,
                    ]);
                },
            );
        }
    }, [userId, setMatches, matches]);

    React.useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    const createMatch: Function = (
        id: string,
        name: string,
        currentUserEmail: string,
    ) => {
        (async () => {
            const match = await LikesService.createLikesToken(
                id,
                currentUserEmail,
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
