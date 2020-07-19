import React, { FC, useState, useEffect, ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Icon, Card, SemanticICONS, SemanticCOLORS } from "semantic-ui-react";
import axios from "axios";
import { useStateValue, addPatient, setDiagnosisList } from "../state";
import { Patient, Gender, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckRating, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";
import { assertNever } from '../utils';

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
            <EntryDetails entry={entry} />
            <DiagnosisList diagnosisCodes={entry.diagnosisCodes} />
          </React.Fragment>
        ))
      }
    </>
  );
};
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

const EntryDetails: FC<{ entry: Entry }> = ({ entry }) => {
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
export default PatientPage;
