import React, { FC, useEffect, useState } from 'react';
import axios from "axios";
import { useStateValue, setDiagnosisList } from '../state';
import { apiBaseUrl } from "../constants";
import { Diagnosis } from "../types";

const DiagnosisList: FC<{ diagnosisCodes?: string[] }> = ({ diagnosisCodes }) => {
    const [state, dispatch] = useStateValue();
    const [entryDiagnoses, setEntryDiagnoses] = useState<Diagnosis[]>();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(Object.values(state.diagnoses));

    useEffect(() => {
        const throwNewError = (message: string) => { throw new Error(message); };

        const findEntryDiagnosesByCode = (diagnoses: Diagnosis[]) => {
            return diagnosisCodes?.map(code => {
                return diagnoses.find(d => d.code === code) ??
                    throwNewError("Diagnosis code is missing or wrong");
            });
        };

        if (Object.keys(diagnoses).length !== 0) {
            setEntryDiagnoses(findEntryDiagnosesByCode(diagnoses));
            return;
        }

        const fetchDiagnosis = async () => {
            try {
                const { data: diagnosesFromApi } = await axios.get<Diagnosis[]>(
                    `${apiBaseUrl}/diagnoses`
                );
                dispatch(setDiagnosisList(diagnosesFromApi));
                setDiagnoses(diagnosesFromApi);
                setEntryDiagnoses(findEntryDiagnosesByCode(diagnosesFromApi));

            } catch (e) {
                console.log(e);
            }
        };
        fetchDiagnosis();

    }, [diagnoses, diagnosisCodes, dispatch]);

    return diagnosisCodes ? (
        <ul>
            {entryDiagnoses?.map(({ code, name }) => (
                <li key={code}>{code} {name}</li>
            ))}
        </ul>
    ) : null;
};

export default DiagnosisList;
