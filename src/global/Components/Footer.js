import { CookieBanner } from '@palmabit/react-cookie-law';

import '../CSS/Footer.css';

function Footer() {
  return (
    <footer>
        <CookieBanner
            wholeDomain={true}
            showMarketingOption={false}
            showStatisticsOption={false}

            styles={{
                dialog: {}
            }}

            message="Vi bruker informasjonskapsler (cookies) for å øke brukervennligheten."
            necessaryOptionText="Nødvendige"
            preferencesOptionText="Preferanser"
            privacyPolicyLinkText=""
            managePreferencesButtonText="Endre mine valg"
            savePreferencesButtonText="Lagre og lukk"
            acceptButtonText="Aksepter alle"

            onAccept = {() => {}}
            onAcceptPreferences = {() => {}}
            onAcceptStatistics = {() => {}}
            onAcceptMarketing = {() => {}}
        />
    </footer>
  );
}



export default Footer;
