import React, { useState, useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import MatchesService from '../../services/matchesService';
import LikesService from '../../services/likesService';
import { getLocalStorage } from '../../utils/localStorage';
import AwsService from '../../services/awsService';
import { toast } from 'react-toastify';

interface IMatch {
    name: string;
    email: string;
    id: string;
    avatar: string;
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
    const [userId, setUserId] = React.useState('');
    const [matches, setMatches] = useLocalStorage('matches', []);
    const [selectedMatchedIndex, setSelectedMatchedIndex] = useState(0);

    const fetchMatches = React.useCallback(async () => {
        if (matches.length === 0 && userId) {
            const _matches = await MatchesService.getMatches(userId);
            if (_matches.ok) {
                Array.prototype.forEach.call(_matches.data, (match: IMatch) => {
                    const promise = new Promise((resolve, reject) => {
                        AwsService.getAvatarFromS3(match.avatar).then(
                            (base64: string) => {
                                setMatches((prevMatches: IMatches[]) => [
                                    ...prevMatches,
                                    {
                                        id: match.email,
                                        name: match.name,
                                        avatar: base64,
                                    },
                                ]);
                            },
                        );
                    });
                });
            }
        }
    }, [userId, setMatches, matches]);

    React.useEffect(() => {
        const id: any = getLocalStorage('userId');
        setUserId(id);
        fetchMatches();
    }, [fetchMatches]);

    const userSwipBehavoir: Function = async (
        user: string,
        person: { email: string; name: string; avatar: string },
        choice: string,
    ) => {
        const match = await LikesService.createLikesToken(
            user,
            person.email,
            choice === 'right',
        );
        if (match.data.ok && match.data.message === 'its a match!') {
            toast.success(`${person.name} also likes you, it's a match!`);
            setMatches((prevMatches: any) => {
                prevMatches = prevMatches.filter(
                    ({ id }: IMatch) => id !== person.email,
                );
                return [
                    ...prevMatches,
                    {
                        id: person.email,
                        name: person.name,
                        avatar: person.avatar,
                    },
                ];
            });
        }
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
        userSwipBehavoir,
    };

    return (
        <MatchesContext.Provider value={value}>
            {children}
        </MatchesContext.Provider>
    );
};
