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
                    <InputLabel>Fornavn</InputLabel>
                    <Input variant="outlined" autoFocus={true} margin="dense" value={props.value} onChange={e => props.onChange(e.target.value)} />
                </FormControl>
            ) 
        },
        { title: "Etternavn", field: "enavn", 
            editComponent: props => (
                <FormControl>
                    <InputLabel>Etternavn</InputLabel> 
                    <Input variant="outlined" margin="dense" value={props.value} onChange={e => props.onChange(e.target.value)} />
                </FormControl>
            )  
        },
        { title: "Brukertype", field: "niva", lookup: { 1: 'Student', 2: 'Underviser', 3: 'Emneansvarlig', 4: 'Administrator' } 
        },
        { title: "Telefon", field: "telefon", type: "numeric", editable: 'never' },
        { title: "E-post", field: "email", 
        editComponent: props => ( 
            <FormControl>
                <InputLabel>E-post</InputLabel> 
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
        onRowAddCancelled: bruker => console.log('Row adding cancelled'),
        onRowUpdateCancelled: bruker => console.log('Row editing cancelled'),
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
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                console.log("Oppdater");
                console.log(newData);
                console.log(oldData);



                setTimeout(() => {
                    //const dataUpdate = [...data];
                    //const index = oldData.tableData.id;
                    //dataUpdate[index] = newData;
                    //setData([...dataUpdate]);

                    //resolve("lol");
                    reject("lol2");
                }, 1000);
            }).then((val) => console.log("eh? " + val)),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                console.log("Slett");
                console.log(oldData);
                setTimeout(() => {
                    //const dataDelete = [...data];
                    //const index = oldData.tableData.id;
                    //dataDelete.splice(index, 1);
                    //setData([...dataDelete]);

                    resolve();
                }, 1000);
            })
    }

    return (
        <div style={{ maxWidth: "100%" }}>
          <MaterialTable columns={columns} data={brukere} localization={localization} editable={editable} title="Brukeroversikt" />
        </div>
    );
}

export default UserOverview;