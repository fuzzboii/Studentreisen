import React from "react";

// 3rd-party Packages
import MaterialTable from "material-table";
import axios from "axios";

import { FormControl, InputLabel, Input } from '@material-ui/core';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';
import ValidationService from '../../../global/Services/ValidationService';

function UserOverview(props) {
    let [brukere, setBrukere] = React.useState([]);
    
    const token = {
        token: CookieService.get("authtoken")
    }

    if(token !== undefined && Object.getOwnPropertyNames(brukere).length == 1) {
        axios
            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
            // Axios serialiserer objektet til JSON selv
            .post(process.env.REACT_APP_APIURL + "/tools/getAllUserData", token)
            // Utføres ved mottatt resultat
            .then(res => {
                if(res.data.results) {
                    setBrukere(res.data.results);
                }
            });
    }
    
    const columns = [
        { title: "#", field: "brukerid", type: "numeric", editable: 'never' },
        { title: "Fornavn", field: "fnavn", 
            editComponent: props => ( 
                <FormControl>
                    <InputLabel>Fornavn *</InputLabel>
                    <Input variant="outlined" autoFocus={true} margin="dense" value={props.value} onChange={e => props.onChange(e.target.value)} />
                </FormControl>
            ) 
        },
        { title: "Etternavn", field: "enavn", 
            editComponent: props => (
                <FormControl>
                    <InputLabel>Etternavn *</InputLabel> 
                    <Input variant="outlined" margin="dense" value={props.value} onChange={e => props.onChange(e.target.value)} />
                </FormControl>
            )  
        },
        { title: "Brukertype", field: "niva", lookup: { 1: 'Student', 2: 'Underviser', 3: 'Emneansvarlig', 4: 'Administrator' } 
        },
        { title: "Telefon", field: "telefon", type: "numeric", 
            editComponent: props => ( 
                <FormControl>
                    <InputLabel>Telefon</InputLabel> 
                    <Input type="tel" variant="outlined" margin="dense" value={props.value} onChange={e => props.onChange(e.target.value)} />
                </FormControl> 
            )   
        },
        { title: "E-post", field: "email", 
            editComponent: props => ( 
                <FormControl>
                    <InputLabel>E-post *</InputLabel> 
                    <Input type="email" variant="outlined" margin="dense" value={props.value} onChange={e => props.onChange(e.target.value)} />
                </FormControl> 
            )  
        }
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
        <section id="section_overview">
          <MaterialTable columns={columns} data={brukere} localization={localization} editable={editable} title="Brukeroversikt" />
        </section>
    );
}

export default UserOverview;