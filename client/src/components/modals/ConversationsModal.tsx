import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useMatches } from '../matches/provider';
import { useConversations } from '../conversations/provider';

export default function NewConversationModal({
    closeModal,
}: {
    closeModal: any;
}) {
    const [selectedMatchedIds, setSelectedMatchedIds]: [any, Function] =
        useState([]);
    const { matches } = useMatches();
    const { createConversation } = useConversations();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('selectedMatchedIds', selectedMatchedIds);
        createConversation(selectedMatchedIds);
        closeModal();
    };

    const handleCheckboxChange = (matchId: []) => {
        setSelectedMatchedIds((prevSelectedMatchedIds: any[]) => {
            if (prevSelectedMatchedIds.includes(matchId)) {
                return prevSelectedMatchedIds.filter(
                    (prevId) => matchId !== prevId,
                );
            } else {
                return [...prevSelectedMatchedIds, matchId];
            }
        });
    };

    return (
        <>
            <Modal.Header closeButton>Create Conversation</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {matches.map((match: any) => {
                        return (
                            <Form.Group controlId={match.id} key={match.id}>
                                <Form.Check
                                    type='checkbox'
                                    value={selectedMatchedIds.includes(
                                        match.id,
                                    )}
                                    label={match.name}
                                    onChange={() =>
                                        handleCheckboxChange(match.id)
                                    }
                                />
                            </Form.Group>
                        );
                    })}
                    <Button type='submit'>Create</Button>
                </Form>
            </Modal.Body>
        </>
    );
}
