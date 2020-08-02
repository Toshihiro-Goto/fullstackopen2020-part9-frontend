import React, { FC, useState } from 'react';
import { Button } from "semantic-ui-react";
import axios from 'axios';
import EntryDetail from './EntryDetail';
import AddEntryModal, { } from './AddEntryModal';
import { EntryFormValues } from './AddEntryModal/AddEntryForm';
import DiagnosisList from './DiagnosisList';
import { Entry } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue, addEntry } from '../state';
import { useParams } from "react-router-dom";

const Entries: FC<{ entries: Entry[] }> = ({ entries }) => {
    const [, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const submitNewEntry = async (values: EntryFormValues) => {
        try {
            const { data: newEntry } = await axios.post<Entry>(
                `${apiBaseUrl}/patients/${id}/entries`,
                values
            );
            dispatch(addEntry(id, newEntry));
            closeModal();
        } catch (e) {
            console.error(e.response.data);
            setError(e.response.data.error);
        }
    };

    return (
        <>
            <h2>entries</h2>
            <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
            />
            <Button onClick={() => openModal()}>Add New Entry</Button>
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
