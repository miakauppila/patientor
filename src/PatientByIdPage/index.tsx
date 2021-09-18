import React from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Container, Icon } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";

const PatientByIdPage = () => {
    const [{ patientsFullData }, dispatch] = useStateValue();
    const [error, setError] = React.useState<string | undefined>();

    const { id } = useParams<{ id: string }>();
    const foundPatient = patientsFullData[id];
    console.log('foundPatient:', foundPatient);

    //only fetch data if patientFullData not found
    React.useEffect(() => {
        if (foundPatient) return;
        const fetchPatientById = async (id: string) => {
            console.log('do fetch');
            try {
                const { data: patientData } = await axios.get<Patient>(
                    `${apiBaseUrl}/patients/${id}`
                );
                dispatch({ type: "SET_PATIENT_FULL_DATA", payload: patientData });
            } catch (e) {
                console.error(e.response?.data || 'Unknown Error');
                setError(e.response?.data?.error || 'Unknown error');
            }
        };
        void fetchPatientById(id);
    }, [id]);

    const getGenderIcon = (gender: string) => {
        if (gender === 'male') {
            return 'mars';
        }
        else if (gender === 'female') {
            return 'venus';
        }
        else {
            return 'genderless';
        }
    };

    if (error) {
        return (
            <div className="App">
                <Container>
                    {error}
                </Container>
            </div>
        );
    }
    if (!foundPatient) {
        return (
            <div className="App">
                <Container>
                    Searching patient data
                </Container>
            </div>
        );
    }
    return (
        <div className="App">
            <Container>
                <h3>{foundPatient.name}
                    <Icon name={getGenderIcon(foundPatient.gender)} size='large' /></h3>
                <div>
                    <b>SSN:</b> {foundPatient.ssn}
                </div>
                <div>
                    <b>Occupation:</b> {foundPatient.occupation}
                </div>
            </Container>
        </div>
    );
};

export default PatientByIdPage;
