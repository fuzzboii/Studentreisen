import React from "react";

// 3rd-party Packages
import MaterialTable from "material-table";
import axios from "axios";

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';

function SeminarOverview(props) {
    let [seminar, setSeminar] = React.useState([]);
    
    const token = {
        token: CookieService.get("authtoken")
    }

    if(token !== undefined && Object.getOwnPropertyNames(seminar).length == 1) {
        axios
            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
            // Axios serialiserer objektet til JSON selv
            .post(process.env.REACT_APP_APIURL + "/tools/getAllSeminarData", token)
            // Utføres ved mottatt resultat
            .then(res => {
                if(res.data.results) {
                    setSeminar(res.data.results);
                }
            });
    }
    
    const kolonner = [
        { title: "Navn", field: "navn" },
        { title: "Arrangør", field: "arrangor" },
        { title: "Adresse", field: "adresse" },
        { title: "Startdato", field: "oppstart", type: "datetime" }
    ];
    
    const lokalisering = {
        pagination: {
            labelDisplayedRows: "{from}-{to} av {count}",
            labelRowsSelect: "seminar",
            labelRowsPerPage: "Seminar per side:",
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
            deleteTooltip: "Slett seminar",
            emptyDataSourceMessage: "Ingen seminar å vise",
            filterRow: {
                filterTooltip: "Filter"
            },
            editRow: {
                deleteText: "Er du sikker på at du ønsker å slette dette seminaret?",
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
        <section id="section_overview">
            <MaterialTable columns={kolonner} data={seminar} localization={lokalisering} title="Seminaroversikt" actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Rediger seminar',
                        onClick: (e, seminarData) => {
                            console.log("Gå til redigering for " + seminarData.seminarid + "\nHusk at all data er med her (seminarData.beskrivelse, seminarData.varighet osv), trenger ikke hente på nytt");
                        }
                    },
                    {
                        icon: 'add',
                        tooltip: 'Nytt seminar',
                        isFreeAction: true,
                        onClick: () => {
                            console.log("Gå til oppretting av nytt seminar");
                        }
                    }
                ]}
            />
        </section>
    );
}

export default SeminarOverview;