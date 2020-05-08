import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import config from './config';

firebase.initializeApp(config);

class Firebase {
    constructor() {
		this.auth = firebase.auth();
		this.db = firebase.firestore();
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        });
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    setDisplayName(name) {
        let user = this.auth.currentUser;
        user.updateProfile({ displayName: name });
    }

    changePassword(currentPassword, newPassword) {
        let credential = firebase.auth.EmailAuthProvider.credential(this.auth.currentUser.email, currentPassword);
        let user = this.getCurrentUser();
        user.reauthenticateWithCredential(credential)
        .then(function() {
            alert('successfully reauthenticated');
            user.updatePassword(newPassword)
            .then(function() {
                alert('password change successful')
            }).catch(function(error) {
                alert(error);
            });
        }).catch(function(error) {
            alert(error);
        });
    }

    async queryCustomDateRange(startDate, endDate) {
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
            .where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).orderBy('timestamp', 'desc').limit(5);
        let ret = [];
        let querySnapshot = await scansRef.get();
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    async queryUsers() {
        let usersRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('displayName');
        let ret = [];
        let querySnapshot = await usersRef.get();
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    async queryLastHourScans() {
        let range = new Date(Date.now() - 3600000); // 1 * 60 * 60 * 1000
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
            .where('timestamp', '>', range).orderBy('timestamp', 'desc').limit(50);
        let querySnapshot = await scansRef.get();
        let ret = []
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    async queryLastDayScans() {
        let range = new Date(Date.now() - 86400000); // 24 * 60 * 60 * 1000
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
            .where('timestamp', '>', range).orderBy('timestamp', 'desc').limit(50);
        let querySnapshot = await scansRef.get();
        let ret = []
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    async queryLastWeekScans() {
        let range = new Date(Date.now() - 604800000); // 24 * 7 * 60 * 60 * 1000
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
            .where('timestamp', '>', range).orderBy('timestamp', 'desc').limit(50);
        let querySnapshot = await scansRef.get();
        let ret = []
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    async queryMostRecentScans() {
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
            .orderBy('timestamp', 'desc').limit(10);
        let querySnapshot = await scansRef.get();
        let ret = []
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    deleteScan(docId) {
        this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans').doc(docId).delete();
    }
}

export default new Firebase();