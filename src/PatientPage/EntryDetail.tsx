import React, { FC } from "react";
import { Icon, SemanticCOLORS } from "semantic-ui-react";
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckRating } from "../types";
import { assertNever } from '../utils';
import EntryDetailCard from './EntryDetailCard';

const HealthCheckEntryDetail: FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    const getColorByRating = (rating: HealthCheckRating): SemanticCOLORS => {
        let result: SemanticCOLORS;
        switch (rating) {
            case HealthCheckRating.Healthy:
                result = "green";
                break;
            case HealthCheckRating.LowRisk:
                result = "yellow";
                break;
            case HealthCheckRating.HighRisk:
                result = "orange";
                break;
            case HealthCheckRating.CriticalRisk:
                result = "red";
                break;
            default:
                assertNever(rating);
                throw new Error("The rating is not exist in HealthCheckRating.");
        }
        return result;
    };

    return (
        <EntryDetailCard
            entry={entry}
            iconName="doctor"
            element={<Icon name="heart" color={getColorByRating(entry.healthCheckRating)} />}
        />
    );
};

const HospitalEntryDetail: FC<{ entry: HospitalEntry }> = ({ entry }) => {
    return (
        <EntryDetailCard
            entry={entry}
            iconName="doctor"
            element={<p>discharge: {entry.discharge.date}, {entry.discharge.criteria}</p>} />
    );
};

const OccupationalHealthcareEntryDetail: FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
    return (
        <EntryDetailCard
            entry={entry}
            iconName="stethoscope"
        />
    );
};

const EntryDetail: FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
        case "HealthCheck":
            return <HealthCheckEntryDetail entry={entry} />;
        case "Hospital":
            return <HospitalEntryDetail entry={entry} />;
        case "OccupationalHealthcare":
            return <OccupationalHealthcareEntryDetail entry={entry} />;
        default:
            assertNever(entry);
            throw new Error("The entry's type is wrong.");
    }
};

export default EntryDetail;
