import '../Styles/privacy.css';
import React from 'react';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'



function Privacy() {
    return (  
        <div className="main_privacy">
            <Grid id="privacy_grid">
                <Card>
                    <CardContent>
                        <h1>Personsvern erklæring for studentreisen.no </h1>
                            <h2>Her beskriver vi hvordan vi samler inn og bruker informasjon om besøk på våre nettsider. </h2>
                                <p>Det er Datatilsynet som er klageinstans ved feil i behandlinger av personopplysninger, 
                                    men har du spørsmål knyttet til personvern på våre nettsider kan du gjerne kontakte oss på e-postadressen 
                                    personvern@studentreisen.no. 
                                </p>
                            <h2>Cookies</h2>
                                <p>Studentreisen.no benytter seg av informasjonskapsler (cookies). 
                                    Dette er filer med informasjon som blir lagret på din enhet for at nettsiden skal fungere så gunstig som mulig. 
                                    Førsteparts informasjonskapsler blir lagret fordi disse er nødvendige for at nettsiden skal fungere. 
                                    Dette er en nøkkel som forteller oss at du er logget inn og som på vår server kan knyttes til 
                                    brukeren som tilhører deg. Ingen informasjon om deg som bruker blir lagret i denne informasjonskapselen. 
                                    Vi har for øyeblikket ingen tredjeparts informasjonskapsler på denne nettsiden. Det er informasjonskapsler 
                                    som kan brukes til markedsføring, analyser og personalisering, noe du ville bli bedt om å godkjenne 
                                    hvis dette skulle bli implementert ved et senere tidspunkt, i henhold til GDPR. 
                                    Våre informasjonskapsler er satt til å bli slettet etter 72 timer. </p>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );

}

export default Privacy;