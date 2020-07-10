import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon, SemanticICONS } from "semantic-ui-react";
import axios from "axios";
import { useStateValue, addPatient, setDiagnosisList } from "../state";
import { Patient, Gender, Entry, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const PatientPage: FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const patientInState = Object.values(patients).find((p) => p.id === id);
    if (patientInState) return setPatient(patientInState);

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(patientFromApi);
        dispatch(addPatient(patientFromApi));
      } catch (e) {
        console.log(e);
      }
    };
    fetchPatient();
  }, [dispatch, id, patients]);

  const mapToIconName = (gender: Gender): SemanticICONS => {
    enum GenderIconName {
      female = "woman",
      male = "man",
      other = "other gender",
    }
    return GenderIconName[gender];
  };

  return patient ? (
    <>
      <h1>
        {patient.name}
        <Icon name={mapToIconName(patient.gender)} />
      </h1>
      <p>ssn:{patient.ssn}</p>
      <p>occupation:{patient.occupation}</p>
      <Entries entries={patient.entries} />
    </>
  ) : null;
};


const Entries: FC<{ entries: Entry[] }> = ({ entries }) => {
  return (
    <>
      <h2>entries</h2>
      {entries.length === 0 ?
        <p>no entries</p> :
        entries.map((entry) => (
          <React.Fragment key={entry.id}>
            <p>{entry.date} {entry.description}</p>
            {entry.diagnosisCodes &&
              <DiagnosisList diagnosisCodes={entry.diagnosisCodes} />
            }
          </React.Fragment>
        ))
      }
    </>
  );
};

const DiagnosisList: FC<{ diagnosisCodes: string[] }> = ({ diagnosisCodes }) => {
  const [state, dispatch] = useStateValue();
  const [entryDiagnoses, setEntryDiagnoses] = useState<Diagnosis[]>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(Object.values(state.diagnoses));

  useEffect(() => {
    const throwNewError = (message: string) => { throw new Error(message); };

    const findEntryDiagnosesByCode = (diagnoses: Diagnosis[]) => {
      return diagnosisCodes.map(code => {
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

  return (
    <ul>
      {entryDiagnoses?.map(({ code, name }) => (
        <li key={code}>{code} {name}</li>
      ))}
    </ul>
  );
};
export default PatientPage;
