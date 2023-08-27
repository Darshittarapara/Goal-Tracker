import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./config";

/**
 * @param path : ref to data store in firebase collection
 * @param payload: data 
 */

export const addDataToFirebaseStore = async (path: string, data: object) => {
    try {
        const response = await addDoc(collection(db, path), data);

        return response
    } catch (error) {
        return { error: error }
    }
}

/**
 * 
 * @param path 
 * @returns Array of a document
 */
export const getDocFromFirebase = async (path: string) => {
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
            console.log(`${doc.id} => ${doc.data()}`);
        });
        return data
    } catch (error) {
        return error
    }
}