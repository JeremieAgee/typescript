// Import the functions you need from the SDKs you need
import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
} from "firebase/firestore/lite";
import { Firestore } from "firebase/firestore";
/**
 *Utility Function that gets all documents from a Firestore Database
 * @param {database} db An instance of a Cloud Firestore Database
 * @returns {array} An array of objects from the collection
 */
async function getUsers(db: Firestore){
	try {
		const snapshot = await getDocs(collection(db, "users"));
		const collectionList = snapshot.docs.map((doc) => (doc.data()
		));
		return collectionList;
	} catch (error) {
		console.log(error);
	}
}
/**
 * Utility Function that adds a document to a Google Cloud Firestore Database
 * @param {database} db An instance of a Cloud Firestore Database
 * @param {object} collectionObject  An object representing a collection document
 * @returns {string} Return the id of the object that was added
 */
async function addUser(db: Firestore, collectionObject: object){
	try {
		const docRef = await addDoc(
			collection(db, "user"),
			collectionObject
		);
		console.log(`${collectionObject} was added to the collection`, docRef.id);
		return docRef.id;
	} catch (e) {
		console.log("Failed to add ", e);
	}
}
/**
 * Utility Function that deletes a document from a Google Cloud Firestore Database
 * @param {database} db An instance of a Cloud Firestore Database
 * @param {string} objectId The Id of the document you are deleting
 */
async function removUser(db: Firestore, objectId: string) {
	try {
		deleteDoc(doc(db, "user", objectId));
		console.log("Successfully removed document");
	} catch (e) {
		console.log(objectId);
		console.log("Failed to delete", e);
	}
}

export {
	getUsers,
	addUser,
	removUser,
};