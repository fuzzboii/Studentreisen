const courseReducer = (state = 0, action) => {
    switch(action.type){
        case 'TAB_COURSE':
            return state = action.payload;
        default:
            return state;
        }
};

export default courseReducer;