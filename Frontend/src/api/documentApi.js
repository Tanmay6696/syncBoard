import axios from "axios";

const API_URL = "http://localhost:8084/api/documents";


export const getDocuments = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`);
};


export const createDocument = (userId, document) => {
    return axios.post(
        `${API_URL}/user/${userId}`,
        document
    );
};


export const updateDocumentPosition = (
    id,
    xPosition,
    yPosition
) => {

    return axios.put(
        `${API_URL}/${id}/position`,
        {
            xPosition,
            yPosition
        }
    );
};


export const deleteDocument = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};