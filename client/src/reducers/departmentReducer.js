import { SET_DEPARTMENTS } from '../actions/types';


const initialState = {
    departments:[]
};


export default function (state = initialState, action) {
    switch (action.type) {
        case SET_DEPARTMENTS:
            console.log(action);
            return {
                departments:action.departments
            };
        default:
            return state
    }
}
