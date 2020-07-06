import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon, SemanticICONS } from "semantic-ui-react";
import axios from "axios";
import { useStateValue, addPatient } from "../state";
import { Patient, Gender, Entry } from "../types";
import { apiBaseUrl } from "../constants";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const patientInState = Object.values(patients).find((p) => p.id === id);
    if (patientInState != null) return setPatient(patientInState);

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
  }, [id, patients, dispatch]);

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

const Entries: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  return (
    <>
      <h2>entries</h2>
      {entries &&
        entries.map((entry) => (
          <>
            <p>
              {entry.date} {entry.description}
            </p>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li>{code}</li>
              ))}
            </ul>
          </>
        ))}
    </>
  );
};

export default PatientPage;
