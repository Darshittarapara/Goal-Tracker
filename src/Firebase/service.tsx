import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./config";

/**
 * @param path : ref to data store in firebase collection
 * @param payload: data 
 */

export const addDataToFirebaseStore = async (path: string, data: object, subPath = "") => {
    try {
        const modifiedCollection = subPath ? collection(db, path, subPath) : collection(db, path)
        const response = await addDoc(modifiedCollection, data);
        return response
    } catch (error) {
        return { error: error }
    }
}

/**
 * @param path : ref to data store in firebase collection
 * @param docId: document id in a firebase
 * @param payload: data 
 */

export const updateDocsToFirebaseStore = async (collectionPath: string, docId: string, payload: object) => {
    try {
        const response = await updateDoc(doc(db, collectionPath, docId), payload);
        return response;
    } catch (error) {
        return { error: error }
    }
}
/**
 * 
 * @param path 
 * @returns Array of a document
 */
export const getDocsFromFirebase = async (path: string) => {
    try {
        /**Change interface when you work on listing */
        const data: any = [];
        const response = await getDocs(collection(db, path));
        console.log(response)
        response.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            })
            console.log(doc.id, doc.data());
        });
        return data
    } catch (error) {
        return error
    }
}