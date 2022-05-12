import React from 'react';
import { Tab, Nav, Button } from 'react-bootstrap';

export const Sidebar: React.FC = (props: {}) => {
    return (
        <div className='d-flex flex-column'>
            <Tab.Container
                id='left-tabs-example'
                defaultActiveKey='conversations'
                onSelect={(eventKey: any) => {
                    console.log(eventKey);
                }}
            >
                <Nav variant='tabs' className='justfy-content-center'>
                    <Nav.Item>
                        <Nav.Link eventKey='conversations'>
                            <Button variant='danger'>conversations</Button>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Tab.Container>
        </div>
    );
};
