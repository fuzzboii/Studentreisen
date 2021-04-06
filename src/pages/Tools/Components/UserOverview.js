import React from "react";

// 3rd-party Packages
import MaterialTable from "material-table";
import axios from "axios";

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';
import ValidationService from '../../../global/Services/ValidationService';

function UserOverview(props) {
    let [brukere, setBrukere] = React.useState([]);
    let [isLoading, setIsLoading] = React.useState(true);
    
    const token = {
        token: CookieService.get("authtoken")
    }

    if(isLoading && token !== undefined && Object.getOwnPropertyNames(brukere).length == 1 && props.activeTool == 0) {
        axios
            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
            // Axios serialiserer objektet til JSON selv
            .post(process.env.REACT_APP_APIURL + "/tools/getAllUserData", token)
            // Utføres ved mottatt resultat
            .then(res => {
                if(res.data.results) {
                    setIsLoading(false);
                    setBrukere(res.data.results);
                }
            });
    }
    
    const columns = [
        { title: "#", field: "brukerid", type: "numeric", editable: 'never' },
        { title: "Fornavn", field: "fnavn", validate: rowData => rowData.fnavn === '' ? { isValid: false, helperText: 'Fornavn kan ikke være tomt' } : true },
        { title: "Etternavn", field: "enavn", validate: rowData => rowData.enavn === '' ? { isValid: false, helperText: 'Etternavn kan ikke være tomt' } : true },
        { title: "Brukertype", field: "niva", lookup: { 1: 'Student', 2: 'Underviser', 3: 'Emneansvarlig', 4: 'Administrator', 
            validate: rowData => rowData.niva === 1 || rowData.niva === 2 || rowData.niva === 3 || rowData.niva === 4 ? { isValid: false, helperText: 'Brukertype er ikke gyldig' } : true }, 
        },
        { title: "Telefon", field: "telefon" },
        { title: "E-post", field: "email", validate: rowData => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(rowData.email) ? true : { isValid: false, helperText: 'E-post er ikke gyldig' } },
    ];
    
    const localization = {
        pagination: {
            labelDisplayedRows: "{from}-{to} av {count}",
            labelRowsSelect: "brukere",
            labelRowsPerPage: "Brukere per side:",
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
            addTooltip: "Legg til ny bruker",
            deleteTooltip: "Slett bruker",
            editTooltip: "Rediger bruker",
            emptyDataSourceMessage: "Ingen brukere å vise",
            filterRow: {
                filterTooltip: "Filter"
            },
            editRow: {
                deleteText: "Er du sikker på at du ønsker å slette denne brukeren?",
                cancelTooltip: "Avbryt",
                saveTooltip: "Godkjenn"
            }
        },
        toolbar: {
            searchTooltip: "Søk",
            searchPlaceholder: "Søk"
        }
    }

    const editable = {
        isEditable: bruker => bruker.niva !== 4, // Administrator skal ikke kunne endres
        isEditHidden: bruker => bruker.niva === 4,
        isDeletable: bruker => bruker.niva === 1, // Kun Studenter skal kunne slettes
        isDeleteHidden: bruker => bruker.niva !== 1,
        onRowAdd: nyBruker =>
            new Promise((resolve, reject) => {
                // Sjekk om feltene er OK, enkel test på brukertype, e-post og at alle feltene er tilstede
                if(ValidationService.validateUser(nyBruker)) {
                    try {
                        axios
                            .post(process.env.REACT_APP_APIURL + "/tools/newUser", {bruker : nyBruker, token : token.token})
                            // Utføres ved mottatt resultat
                            .then(res => {
                                if(res.data.success) {
                                    setBrukere([...brukere, nyBruker]);
                                    resolve();
                                } else {
                                    reject();
                                }
                            }).catch(e => {
                                reject();
                            });
                    } catch(e) {
                        reject();
                    }
                } else {
                    reject();
                }
            }
        ),
        onRowUpdate: (nyBruker, gammelBruker) =>
            new Promise((resolve, reject) => {
                if(nyBruker.fnavn === gammelBruker.fnavn && nyBruker.enavn === gammelBruker.enavn && nyBruker.email === gammelBruker.email && nyBruker.telefon === gammelBruker.telefon && nyBruker.niva.toString() === gammelBruker.niva.toString()) {
                    resolve();
                } else {
                    // Sjekk om feltene er OK, enkel test på brukertype, e-post og at alle feltene er tilstede
                    if(ValidationService.validateUser(nyBruker)) {
                        try {
                            axios
                                .post(process.env.REACT_APP_APIURL + "/tools/updateUser", {nyBruker : nyBruker, gammelBruker : gammelBruker, token : token.token})
                                // Utføres ved mottatt resultat
                                .then(res => {
                                    if(res.data.success) {
                                        const oppdatertBrukere = [...brukere];
                                        const index = gammelBruker.tableData.id;
                                        oppdatertBrukere[index] = nyBruker;
                                        setBrukere([...oppdatertBrukere]);
        
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                }).catch(e => {
                                    reject();
                                });
                        } catch(e) {
                            reject();
                        }
                    } else {
                        reject();
                    }
                }
            }
        ),
        onRowDelete: bruker =>
            new Promise((resolve, reject) => {
                try {
                    axios
                        .post(process.env.REACT_APP_APIURL + "/tools/deleteUser", {bruker : bruker, token : token.token})
                        // Utføres ved mottatt resultat
                        .then(res => {
                            if(res.data.success) {
                                const oppdatertBrukere = [...brukere];
                                const index = bruker.tableData.id;
                                oppdatertBrukere.splice(index, 1);
                                setBrukere([...oppdatertBrukere]);

                                resolve();
                            } else {
                                reject();
                            }
                        }).catch(e => {
                            reject();
                        });
                } catch(e) {
                    reject();
                }
            }
        )
    }

    return (
        <section id="tools_overview_section">
          <MaterialTable columns={columns} data={brukere} localization={localization} editable={editable} isLoading={isLoading} title="Brukeroversikt" />
        </section>
    );
}

export default UserOverview;