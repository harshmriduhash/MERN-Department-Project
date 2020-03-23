import {ADD_PENDING_REQUEST,ADD_APPROVED_REQUEST,REMOVE_PENDING_REQUEST,
        ADD_INCOMING_REQUEST,REMOVE_INCOMING_REQUEST,SET_PENDING_REQUESTS,SET_APPROVED_REQUESTS,
        SET_INCOMING_REQUESTS,SET_REJECTED_REQUESTS,ADD_REJECTED_REQUEST} 
        from './types'
import axios from 'axios';



export const addPendingRequest = (request) =>({
   type: ADD_PENDING_REQUEST,
    request
})

export const addApprovedRequest = (request) =>({
    type:ADD_APPROVED_REQUEST,
    request
})

export const removePendingRequest = (id) =>({
    type: REMOVE_PENDING_REQUEST,
    id
})



export const removeIncomingRequest = (id) =>({
    type: REMOVE_INCOMING_REQUEST,
    id
})


export const setPendingRequests = (requests) =>({
    type: SET_PENDING_REQUESTS,
    requests
})

export const setApprovedRequests = (requests) =>({
    type: SET_APPROVED_REQUESTS,
    requests
})

export const setIncommingRequests = (requests) =>({
    type: SET_INCOMING_REQUESTS,
    requests
})

export const setRejectedRequests = (requests) =>({
    type: SET_REJECTED_REQUESTS,
    requests
})




export const createRequest = (data) => dispatch =>{
    return axios.post('/api/request',data).then(res =>{
        if(res.data.success){
            dispatch(addPendingRequest(res.data.request))
        }
        return res;
    })
}

export const updateRequest = (id,data) => dispatch =>{
    return axios.put(`/api/request/${id}`,data).then(res =>{
        if(res.data.success){
            dispatch(removeIncomingRequest(id))
        }
        return res;
    })
}

export const deleteRequest = (id) => dispatch =>{
    return axios.delete(`/api/request/${id}`).then(res =>{
        if(res.data.success){
            dispatch(removePendingRequest(id))
        }
        return res;
    })
}



export const getPendingRequests = () => dispatch =>{
    return axios.get(`/api/request/pending`).then(res =>{
        if(res.data.success){
            dispatch(setPendingRequests(res.data.requests))
        }
        return res;
    })
}


export const getApprovedRequests = () => dispatch =>{
    return axios.get(`/api/request/approved`).then(res =>{
        if(res.data.success){
            dispatch(setApprovedRequests(res.data.requests))
        }
        return res;
    })
}


export const getIncomingRequests = (departmentId) => dispatch =>{
    return axios.get(`/api/request/${departmentId}/incoming`).then(res =>{
        if(res.data.success){
            dispatch(setIncommingRequests(res.data.requests))
        }
        return res;
    })
}


export const getRejectedRequests = () => dispatch =>{
    return axios.get(`/api/request/rejected`).then(res =>{
        if(res.data.success){
            dispatch(setRejectedRequests(res.data.requests))
        }
        return res;
    })
}



// export const addIncomingRequest = (request) => dispatch =>{
//     socket.on('create-request', (data) => {
//         console.log("------------------socket data--------------\n",data)
//         dispatch({type:ADD_INCOMING_REQUEST, request})
//     })
// }
    


