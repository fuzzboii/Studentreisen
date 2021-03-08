function Reset() {
    const token = window.location.pathname.substring(7);

    // Relativ enkel regex som sjekker om stringen inneholder A-F og 0-9 (Maksimale verdier for HEX), tester så om stringen er på 40 char
    if (/^[0-9a-fA-F]+$/.test(token) && token.length == 40) {
        console.log("Ok, kan fortsette");
    } else {
        console.log("Ikke gyldig token, vises uansett om token er feil eller ikke der i det hele tatt");
    }

    return (
        <div>
            <h1>Reset for {token}</h1>
        </div>
    );
}

export default Reset;
