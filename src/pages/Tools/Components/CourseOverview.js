import React from "react";

// 3rd-party Packages
import MaterialTable from "material-table";
import axios from "axios";

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';

function CourseOverview(props) {
    let [kurs, setKurs] = React.useState([]);
    let [isLoading, setIsLoading] = React.useState(true);
    
    const token = {
        token: CookieService.get("authtoken")
    }

    if(isLoading && token !== undefined && Object.getOwnPropertyNames(kurs).length == 1 && props.activeTool == 1) {
        axios
            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
            // Axios serialiserer objektet til JSON selv
            .post(process.env.REACT_APP_APIURL + "/tools/getAllCourseData", token)
            // Utføres ved mottatt resultat
            .then(res => {
                if(res.data.results) {
                    setIsLoading(false);
                    setKurs(res.data.results);
                }
            });
    }
    
    const kolonner = [
        { title: "Emnekode", field: "emnekode" },
        { title: "Navn", field: "navn" },
        { title: "Semester", field: "semester" },
        { title: "Studiepoeng", field: "studiepoeng", type: "numeric" }
    ];
    
    const lokalisering = {
        pagination: {
            labelDisplayedRows: "{from}-{to} av {count}",
            labelRowsSelect: "kurs",
            labelRowsPerPage: "Kurs per side:",
            firstAriaLabel: "Første side", 
            firstTooltip: "Første side", 
            previousAriaLabel: "Forrige side",
            previousTooltip: "Forrige side",
            nextAriaLabel: "Neste side",
            nextTooltip: "Neste side",
            lastAriaLabel: "Siste side",
            lastTooltip: "Siste side",
        },
        header: {
            actions: "Valg"
        },
        body: {
            deleteTooltip: "Slett kurs",
            emptyDataSourceMessage: "Ingen kurs å vise",
            filterRow: {
                filterTooltip: "Filter"
            },
            editRow: {
                deleteText: "Er du sikker på at du ønsker å slette dette kurset?",
                cancelTooltip: "Avbryt",
                saveTooltip: "Godkjenn"
            }
        },
        toolbar: {
            searchTooltip: "Søk",
            searchPlaceholder: "Søk"
        }
    }

    return (
        <section id="tools_overview_section">
            <MaterialTable columns={kolonner} data={kurs} localization={lokalisering} isLoading={isLoading} title="Kursoversikt" actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Rediger kurs',
                        onClick: (e, kursData) => {
                            console.log("Gå til redigering for " + kursData.emnekode + "\nHusk at all data er med her (kursData.beskrivelse, kursData.lenke osv), trenger ikke hente på nytt");
                        }
                    },
                    {
                        icon: 'add_box',
                        tooltip: 'Nytt kurs',
                        isFreeAction: true,
                        onClick: () => {
                            console.log("Gå til oppretting av nytt kurs");
                        }
                    }
                ]}
            />
        </section>
    );
}

export default CourseOverview;