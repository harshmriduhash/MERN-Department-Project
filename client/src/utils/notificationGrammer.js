const NotificationGrammer = (action, param1, param2,text) => {
    let obj = {
        "CREATE_REQUEST":`${param1} has created the request "${text}" for ${param2}`,
        "REQUEST_APPROVED":`${param2} has approved the request "${text}" created by ${param1}`,
        "REQUEST_REJECTED":`${param2} has rejected the request "${text}" created by ${param1}`,
        "DELETE_PENDING_REQUEST":`${param1} has deleted the request "${text}" created for ${param2}`

    }

    return obj[action]
}


export default NotificationGrammer;