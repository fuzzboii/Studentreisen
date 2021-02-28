import { Button } from './'

function HeroSection(){
    return (
        <div className='hero-container'>
            <h1>STUDENTREISEN</h1>
            <p>Noe undertekst her</p>
            <div className="hero-btns">
                <Button className='btns' buttonStyle='btn--outline'
                buttonSize='btn--large'
                >
                 GET STARTED  
                </Button>
            </div>
        </div>
    )
}

export default HeroSection