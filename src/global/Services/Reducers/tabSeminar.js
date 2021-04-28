const seminarReducer = (state = 0, action) => {
    switch(action.type){
        case 'TAB_SEMINAR':
            return state = action.payload;
        default:
            return state;
        }
};

export default seminarReducer;