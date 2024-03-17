import {
    isExpired,
    decodeToken,
    useJwt
} from "react-jwt";
import {
    JWT_SECRET
} from './config';

const data = {
    status: false,
    token: ""
}

const verifyToken = function(token) {
    if (!token) {
        data.status = false;
        return data;
    }
    let decodedToken;
    try {
        decodedToken = decodeToken(token, JWT_SECRET);
        const isMyTokenExpired = isExpired(token, JWT_SECRET);

        data.status = isMyTokenExpired ? false : true;
        data.token = decodedToken;
        if (decodedToken.role != 'CUSTOMER') {
            return data;
        } else {
            data.status = false;
            return data;
        }
    } catch (err) {
        data.status = false;
        return data;
    }

    if (!decodedToken) {
        data.status = false;
        return data;
    }
}

export default verifyToken;