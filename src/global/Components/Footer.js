import { CookieBanner } from '@palmabit/react-cookie-law';
import '../CSS/Footer.css';
import { Link } from 'react-router-dom';

//Footer som viser et cookie banner dersom du er på siden første gang, og en footer som viser lenker man ikke benytter for ofte.
function Footer() {
  return (
    <footer>
      <CookieBanner
          wholeDomain={true}
          showMarketingOption={false}
          showStatisticsOption={false}
          showPreferencesOption={false}

          styles={{
              dialog: {}
          }}

          message="Vi bruker informasjonskapsler (cookies) kun for lagring av din innlogget økt, ved å fortsette å bruke siden godkjenner du dette."
          necessaryOptionText="Nødvendige"
          privacyPolicyLinkText="Les mer om personvernet her"
          managePreferencesButtonText="Endre mine valg"
          savePreferencesButtonText="Lagre og lukk"
          acceptButtonText="Aksepter"

          onAccept = {() => {}}
          onAcceptPreferences = {() => {}}
          onAcceptStatistics = {() => {}}
          onAcceptMarketing = {() => {}}
      />
      
      <div className='footer-container'>
        <div className='links-section'>
            <div className='footer-link'>
              <h2>Om oss</h2>
              <Link to='/about'>Les her</Link>
            </div>

            <div className='footer-link'>
              <h2>Kontakt</h2>
              <a href="mailto:usnstudentreisen@gmail.com">Send e-post</a>
            </div>

            <div className='footer-link'>
              <h2>Personvern</h2>
              <Link to='/privacy'>Les her</Link>
            </div>
            
            <div className='footer-link'>
              <h2>Nettsider</h2>
              <a href="https://usn.no">USN</a>
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
