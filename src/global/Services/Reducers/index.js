import {combineReducers} from 'redux';
import courseReducer from './tabCourse';
import seminarReducer from './tabSeminar';

// Kombinerer alle reducers
const allReducers = combineReducers({
    course_tab_position: courseReducer,
    seminar_tab_position: seminarReducer,
});

export default allReducers;
