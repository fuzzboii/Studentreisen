import { CookieBanner } from '@palmabit/react-cookie-law';
import '../CSS/Footer.css';
import { Link } from 'react-router-dom';

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
      <div className='footer-container'>
        <div className='links-section'>
            <div className='footer-link'>
              <h2>Om oss</h2>
              <Link to=''>Link noe her</Link>
            </div>

            <div className='footer-link'>
              <h2>Hjelp</h2>
              <Link to=''>Link noe her</Link>
            </div>

            <div className='footer-link'>
              <h2>Personvern</h2>
              <Link to='/'>Link noe her</Link>
            </div>
            
            <div className='footer-link'>
              <h2>Nettsider</h2>
              <Link to='/'>USN</Link>
            </div>
        </div>
        <section className='copyright-section'>
          <small className='website-copyright'>Universitetet i Sørøst-Norge © 2021</small>
        </section>
      </div>
    </footer>
  );
}



export default Footer;
