import React from "react";

// 3rd-party Packages
import MaterialTable from "material-table";
import axios from "axios";
import { useSnackbar } from 'notistack';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';
import ValidationService from '../../../global/Services/ValidationService';

function UserOverview(props) {
    let [brukere, setBrukere] = React.useState([]);
    let [isLoading, setIsLoading] = React.useState(true);
    const { enqueueSnackbar } = useSnackbar();

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
                if(res.data.status === "success") {
                    setBrukere(res.data.results);
                    setIsLoading(false);
                } else {
                    enqueueSnackbar(res.data.message, { 
                        variant: res.data.status,
                        autoHideDuration: 5000,
                    });
                    setIsLoading(false);
                }
            });
    }
    
    const columns = [
        { title: "#", field: "brukerid", type: "numeric", editable: 'never' },
        { title: "Fornavn", field: "fnavn", validate: rowData => rowData.fnavn === '' ? { isValid: false, helperText: 'Fornavn kan ikke være tomt' } : true },
        { title: "Etternavn", field: "enavn", validate: rowData => rowData.enavn === '' ? { isValid: false, helperText: 'Etternavn kan ikke være tomt' } : true },
        { title: "Brukertype", field: "niva", lookup: { 1: 'Student', 2: 'Underviser', 3: 'Emneansvarlig', 4: 'Administrator' }, 
        },
        { title: "Telefon", field: "telefon", validate: rowData => /^([\+0-9\s]*)$/.test(rowData.telefon) || rowData.telefon == null ? true : { isValid: false, helperText: 'Telefon er ikke gyldig' } },
        { title: "E-post", field: "email", validate: rowData => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(rowData.email) || rowData.email === "" || rowData.email == null ? true : { isValid: false, helperText: 'E-post er ikke gyldig' } },
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
                const validering = ValidationService.validateUser(nyBruker);

                if(validering.success) {
                    try {
                        axios
                            .post(process.env.REACT_APP_APIURL + "/tools/newUser", {bruker : nyBruker, token : token.token})
                            // Utføres ved mottatt resultat
                            .then(res => {
                                if(res.data.status === "success") {
                                    enqueueSnackbar("Bruker opprettet, e-post med midlertidig passord sendt til oppgitt e-post", { 
                                        variant: res.data.status,
                                        autoHideDuration: 7000,
                                    });
                                    setBrukere([...brukere, nyBruker]);
                                    resolve();
                                } else {
                                    enqueueSnackbar(res.data.message, { 
                                        variant: res.data.status,
                                        autoHideDuration: 5000,
                                    });
                                    reject();
                                }
                            }).catch(e => {
                                enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                    variant: 'error',
                                    autoHideDuration: 5000,
                                });
                                reject();
                            });
                    } catch(e) {
                        enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                            variant: 'error',
                            autoHideDuration: 5000,
                        });
                        reject();
                    }
                } else {
                    enqueueSnackbar(validering.message, { 
                        variant: 'error',
                        autoHideDuration: 5000,
                    });
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
                    const validering = ValidationService.validateUser(nyBruker);
                    
                    if(validering.success) {
                        try {
                            axios
                                .post(process.env.REACT_APP_APIURL + "/tools/updateUser", {nyBruker : nyBruker, gammelBruker : gammelBruker, token : token.token})
                                // Utføres ved mottatt resultat
                                .then(res => {
                                    if(res.data.status === "success") {
                                        enqueueSnackbar(res.data.message, { 
                                            variant: res.data.status,
                                            autoHideDuration: 5000,
                                        });
                                        const oppdatertBrukere = [...brukere];
                                        const index = gammelBruker.tableData.id;
                                        oppdatertBrukere[index] = nyBruker;
                                        setBrukere([...oppdatertBrukere]);
        
                                        resolve();
                                    } else {
                                        enqueueSnackbar(res.data.message, { 
                                            variant: res.data.status,
                                            autoHideDuration: 5000,
                                        });
                                        reject();
                                    }
                                }).catch(e => {
                                    enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                        variant: 'error',
                                        autoHideDuration: 5000,
                                    });
                                    reject();
                                });
                        } catch(e) {
                            enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                variant: 'error',
                                autoHideDuration: 5000,
                            });
                            reject();
                        }
                    } else {
                        enqueueSnackbar(validering.message, { 
                            variant: 'error',
                            autoHideDuration: 5000,
                        });
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
                            if(res.data.status === "success") {
                                enqueueSnackbar(res.data.message, { 
                                    variant: res.data.status,
                                    autoHideDuration: 5000,
                                });
                                const oppdatertBrukere = [...brukere];
                                const index = bruker.tableData.id;
                                oppdatertBrukere.splice(index, 1);
                                setBrukere([...oppdatertBrukere]);

                                resolve();
                            } else {
                                enqueueSnackbar(res.data.message, { 
                                    variant: res.data.status,
                                    autoHideDuration: 5000,
                                });
                                resolve();
                            }
                        }).catch(e => {
                            enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                variant: 'error',
                                autoHideDuration: 5000,
                            });
                            reject();
                        });
                } catch(e) {
                    enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                        variant: 'error',
                        autoHideDuration: 5000,
                    });
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