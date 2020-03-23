import {SET_DEPARTMENTS} from './types'
import axios from 'axios';



export const setDepartments = (departments) =>({
    type:"SET_DEPARTMENTS",
    departments
})

export const getDepartments = () => dispatch =>{
    return axios.get('/api/department/getDepartments').then(res =>{
        if(res.data.success){
            dispatch(setDepartments(res.data.departments))
        }
        return res;
    })
}



export const getDepartmentsForReq = () => dispatch =>{
    return axios.get('/api/department/getDepartmentsForReq').then(res =>{
        if(res.data.success){
            dispatch(setDepartments(res.data.departments))
        }
        return res;
    })
}

