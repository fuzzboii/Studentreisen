import React from "react";
import { useHistory } from "react-router-dom";

// 3rd-party Packages
import MaterialTable from "material-table";
import axios from "axios";
import PublicIcon from '@material-ui/icons/Public';
import { useSnackbar } from 'notistack';
import moment from 'moment';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';

function SeminarOverview(props) {
    let [seminar, setSeminar] = React.useState([]);
    let [isLoading, setIsLoading] = React.useState(true);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    
    const token = {
        token: CookieService.get("authtoken")
    }

    if(isLoading && token !== undefined && Object.getOwnPropertyNames(seminar).length == 1 && props.activeTool == 2) {
        axios
            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
            // Axios serialiserer objektet til JSON selv
            .post(process.env.REACT_APP_APIURL + "/tools/getAllSeminarData", token)
            // Utføres ved mottatt resultat
            .then(res => {
                if(res.data.status === "success") {
                    setIsLoading(false);
                    setSeminar(res.data.results);
                } else {
                    enqueueSnackbar(res.data.message, { 
                        variant: res.data.status,
                        autoHideDuration: 5000,
                    });
                    setIsLoading(false);
                }
            });
    }
    
    const kolonner = [
        { title: "Navn", field: "navn" },
        { title: "Arrangør", field: "arrangornavn" },
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
    
    const redigerbar = {
        isEditable: () => false,
        isEditHidden: () => true,
        isDeletable: seminar => {
            const sluttdato = new Date(seminar.varighet);
            const naa = new Date(); 
            if(sluttdato <= naa) {
                return true;
            } else {
                return false;
            }
        },
        isDeleteHidden:  seminar => {
            const sluttdato = new Date(seminar.varighet);
            const naa = new Date(); 
            if(sluttdato > naa) {
                return true;
            } else {
                return false;
            }
        },
        onRowDelete: seminarData =>
            new Promise((resolve, reject) => {
                try {
                    axios
                        .post(process.env.REACT_APP_APIURL + "/tools/deleteSeminar", {seminarid : seminarData.seminarid, sluttdato : seminarData.varighet, token : token.token})
                        // Utføres ved mottatt resultat
                        .then(res => {
                            if(res.data.status === "success") {
                                const oppdatertSeminar = [...seminar];
                                const index = seminarData.tableData.id;
                                oppdatertSeminar.splice(index, 1);
                                setSeminar([...oppdatertSeminar]);
                                
                                enqueueSnackbar(res.data.message, { 
                                    variant: res.data.status,
                                    autoHideDuration: 3000,
                                });

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
                                variant: "error",
                                autoHideDuration: 5000,
                            });

                            reject();
                        });
                } catch(e) {
                    enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                        variant: "error",
                        autoHideDuration: 5000,
                    });

                    reject();
                }
            }
        )
    }


    return (
        <section id="tools_overview_section">
            <MaterialTable columns={kolonner} data={seminar} localization={lokalisering} editable={redigerbar} isLoading={isLoading} title="Seminaroversikt" actions={[
                    {
                        icon: 'add_box',
                        tooltip: 'Nytt seminar',
                        isFreeAction: true,
                        onClick: () => {
                            history.push("/seminar/new");
                        }
                    },
                    seminarData => ({
                        icon: 'edit',
                        tooltip: 'Rediger seminar',
                        hidden: seminarData.varighet <= moment().format('YYYY-MM-DDTHH:mm:ss') || seminarData.tilgjengelighet !== 1,
                        onClick: (e, seminarData) => {
                            history.push("/seminar/seminarkommende=" + seminarData.seminarid);
                        }
                    }),
                    seminarData => ({
                        icon: () => <PublicIcon />,
                        tooltip: 'Avpubliser seminar',
                        hidden: seminarData.tilgjengelighet !== 1,
                        onClick: () => {
                            new Promise((resolve, reject) => {
                                try {
                                    setIsLoading(true);
                                    axios
                                        .post(process.env.REACT_APP_APIURL + "/tools/publicizeSeminar", {seminarid : seminarData.seminarid, tilgjengelighet: 0, token : token.token})
                                        // Utføres ved mottatt resultat
                                        .then(res => {
                                            if(res.data.status === "success") {

                                                const oppdatertSeminar = [...seminar];
                                                const index = seminarData.tableData.id;

                                                if(seminarData.tilgjengelighet == 1) {
                                                    oppdatertSeminar[index].tilgjengelighet = 0;
                                                } else {
                                                    oppdatertSeminar[index].tilgjengelighet = 1;
                                                }

                                                enqueueSnackbar(res.data.message, { 
                                                    variant: "info",
                                                    autoHideDuration: 3000,
                                                });
                                                
                                                setIsLoading(false);
                                                setSeminar([...oppdatertSeminar]);
                
                                                resolve();
                                            } else {
                                                enqueueSnackbar(res.data.message, { 
                                                    variant: res.data.status,
                                                    autoHideDuration: 5000,
                                                });

                                                setIsLoading(false);
                                                reject();
                                            }
                                        }).catch(e => {
                                            enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                                variant: "error",
                                                autoHideDuration: 5000,
                                            });

                                            setIsLoading(false);
                                            reject();
                                        });
                                } catch(e) {
                                    enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                        variant: "error",
                                        autoHideDuration: 5000,
                                    });

                                    setIsLoading(false);
                                    reject();
                                }
                            });
                        }
                    }),
                    seminarData => ({
                        icon: () => <PublicIcon color="disabled"/>,
                        tooltip: 'Publiser seminar',
                        hidden: seminarData.tilgjengelighet == 1,
                        onClick: () => {
                            new Promise((resolve, reject) => {
                                try {
                                    setIsLoading(true);
                                    axios
                                        .post(process.env.REACT_APP_APIURL + "/tools/publicizeSeminar", {seminarid : seminarData.seminarid, tilgjengelighet: 1, token : token.token})
                                        // Utføres ved mottatt resultat
                                        .then(res => {
                                            if(res.data.status === "success") {
                                                const oppdatertSeminar = [...seminar];
                                                const index = seminarData.tableData.id;

                                                if(seminarData.tilgjengelighet == 1) {
                                                    oppdatertSeminar[index].tilgjengelighet = 0;
                                                } else {
                                                    oppdatertSeminar[index].tilgjengelighet = 1;
                                                }

                                                enqueueSnackbar(res.data.message, { 
                                                    variant: "info",
                                                    autoHideDuration: 3000,
                                                });
                                                
                                                setIsLoading(false);
                                                setSeminar([...oppdatertSeminar]);
                
                                                resolve();
                                            } else {
                                                enqueueSnackbar(res.data.message, { 
                                                    variant: res.data.status,
                                                    autoHideDuration: 5000,
                                                });
                                                
                                                setIsLoading(false);

                                                reject();
                                            }
                                        }).catch(e => {
                                            enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                                variant: "error",
                                                autoHideDuration: 5000,
                                            });
                                            
                                            setIsLoading(false);

                                            reject();
                                        });
                                } catch(e) {
                                    enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
                                        variant: "error",
                                        autoHideDuration: 5000,
                                    });

                                    setIsLoading(false);

                                    reject();
                                }
                            });
                        }
                    })
                ]}
            />
        </section>
    );
}

export default SeminarOverview;