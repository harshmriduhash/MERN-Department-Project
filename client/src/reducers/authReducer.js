import { SET_CURRENT_USER, SET_USERS, SET_NOTIFICATIONS,SET_NOTIFICATION_ALERT, ADD_NOTIFICATION } from '../actions/types';


const initialState = {
    isAuthenticated: false,
    user: {},
    users:[],
    notifications:[],
    showNotificationAlert:false
};


export default function (state = initialState, action) {
    console.log(action)
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: action.payload.id ? true : false,
                user: action.payload
            };
      
        case SET_USERS:
        return{
            ...state,
            users:action.users
        }
        case SET_NOTIFICATIONS:
          return{
              ...state,
              notifications:action.notifications
          }
        case SET_NOTIFICATION_ALERT:
            return{
                ...state,
                showNotificationAlert:action.alert
            }
        case ADD_NOTIFICATION:
            return{
                ...state,
                notifications:[action.notification, ...state.notifications]
            }

        default:
            return state
    }
}
