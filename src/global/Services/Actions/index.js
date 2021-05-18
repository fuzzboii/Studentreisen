// Funksjoner for å ta imot data og lagre den lokalt, 
// slik at den kan hentes ved en senere anledning

// Funksjon kalles på i CourseNav, og RelevantFieldNav
export const tabCourse = position => {
    return {
        type: 'TAB_COURSE',
        payload: position
    };
};

// Funksjon kalles på i SeminarNav
export const tabSeminar = position => {
    return {
        type: 'TAB_SEMINAR',
        payload: position
    };
};
