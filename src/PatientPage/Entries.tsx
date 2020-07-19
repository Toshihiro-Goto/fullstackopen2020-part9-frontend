import React, { FC } from 'react';
import { Entry } from '../types';
import EntryDetail from './EntryDetail';
import DiagnosisList from './DiagnosisList';

const Entries: FC<{ entries: Entry[] }> = ({ entries }) => {
    return (
        <>
            <h2>entries</h2>
            {entries.length === 0 ?
                <p>no entries</p> :
                entries.map((entry) => (
                    <React.Fragment key={entry.id}>
                        <EntryDetail entry={entry} />
                        <DiagnosisList diagnosisCodes={entry.diagnosisCodes} />
                    </React.Fragment>
                ))
            }
        </>
    );
};

export default Entries;
