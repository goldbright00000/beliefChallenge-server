
/**
 *  Created by saad.sami on 04/04/2019.
 */

/*
* Util-response.js
*/

const _ = require('lodash');

let ResponseWrapper = (status, message, statusCode, data = {}) => {

    let _res = {
        response: {
            status: status,
            message: message
        },
        statusCode: statusCode
    }
    if (message === 'requiredAll')
        _res.response['message'] = "Please fill all the required fields";

    if (message == 'fetchSuccess')
        _res.response['message'] = "Fetched successfully";

    if (message == 'createSuccess')
        _res.response['message'] = "Created successfully";

    if (message == 'updateSuccess')
        _res.response['message'] = "Updated successfully";

    if (message == 'removeSuccess')
        _res.response['message'] = "Removed successfully";

    if (message == 'alreadyExist')
        _res.response['message'] = "Data is already exist";

    if (message == 'alreadyExistPin')
        _res.response['message'] = "One post is already pined";

    if (message == 'EmailNotSend')
        _res.response['message'] = "Somthing went wrong";

    if (message == 'inValidEmail')
        _res.response['message'] = "Please provide a valid email address";

    if (message == 'LoginSuccess')
        _res.response['message'] = "User Login Successfully";


    if (message == 'notFound')
        _res.response['message'] = "Data not found";

    if (data && Object.keys(data).length || Array.isArray(data)) {
        _res.response['data'] = data.data;
        if (data.data.length && data.count)
            _res.response['count'] = data.count
    }

    return _res;
}

let DataOmit = (data, omitArray) => {
    data['data'] = _.omit(data.data.toObject(), omitArray)
    return data;
}

module.exports = {
    _responseWrapper: ResponseWrapper,
    _dataOmit: DataOmit
};