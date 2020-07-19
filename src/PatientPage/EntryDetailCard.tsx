import React, { FC, ReactElement } from 'react';
import { Card, Icon, SemanticICONS } from 'semantic-ui-react';
import { Entry } from '../types';

const EntryDetailCard: FC<{ entry: Entry; iconName: SemanticICONS; element?: ReactElement }> = ({ entry, iconName, element }) => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    {entry.date}
                    < Icon name={iconName} size="large" />
                    {entry.type === "OccupationalHealthcare" && entry.employerName}
                </Card.Header>
                <Card.Description>
                    <p>{entry.description}</p>
                    {element}
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

export default EntryDetailCard;
