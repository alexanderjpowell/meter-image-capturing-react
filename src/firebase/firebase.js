import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import 'firebase/storage';
import config from './config';

firebase.initializeApp(config);

class Firebase {
    constructor() {
		this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.storage = firebase.app().storage("gs://to-do-files");
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

    getCurrentUserUid() {
        return this.auth.currentUser.uid;
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
        let ret = [];
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
        let ret = [];
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
        let ret = [];
        querySnapshot.forEach(function(doc) {
            ret.push(doc);
        });
        return ret;
    }

    async queryMostRecentScans() {
        let ret = [];
        try {
            let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
                .orderBy('timestamp', 'desc').limit(10);
            let querySnapshot = await scansRef.get();
            querySnapshot.forEach(function(doc) {
                ret.push(doc);
            });
            return ret;
        } catch (error) {
            return ret;
        }
    }

    async queryAllUserNames() {
        let ret = []
        try {
            let userNamesRef = this.db.collection('users')
                                        .doc(this.auth.currentUser.uid)
                                        .collection('displayNames')
                                        .limit(1000);
            let querySnapshot = await userNamesRef.get();
            querySnapshot.forEach(function(doc) {
                ret.push(doc)
            });
            return ret;
        } catch (error) {
            return ret;
        }
    }

    updateScan(oldData, newData) {
        let updates = {};
        if (oldData['machineId'] != newData['machineId']) {
            updates['machineId'] = newData['machineId'];
        }
        if (oldData['progressive1'] != newData['progressive1']) {
            updates['progressive1'] = newData['progressive1'];
        }
        if (oldData['progressive2'] != newData['progressive2']) {
            updates['progressive2'] = newData['progressive2'];
        }
        if (oldData['progressive3'] != newData['progressive3']) {
            updates['progressive3'] = newData['progressive3'];
        }
        if (oldData['progressive4'] != newData['progressive4']) {
            updates['progressive4'] = newData['progressive4'];
        }
        if (oldData['progressive5'] != newData['progressive5']) {
            updates['progressive5'] = newData['progressive5'];
        }
        if (oldData['progressive6'] != newData['progressive6']) {
            updates['progressive6'] = newData['progressive6'];
        }
        if (oldData['progressive7'] != newData['progressive7']) {
            updates['progressive7'] = newData['progressive7'];
        }
        if (oldData['progressive8'] != newData['progressive8']) {
            updates['progressive8'] = newData['progressive8'];
        }
        if (oldData['progressive9'] != newData['progressive9']) {
            updates['progressive9'] = newData['progressive9'];
        }
        if (oldData['progressive10'] != newData['progressive10']) {
            updates['progressive10'] = newData['progressive10'];
        }
        if (oldData['location'] != newData['location']) {
            updates['location'] = newData['location'];
        }

        this.db.collection('users')
            .doc(this.auth.currentUser.uid)
            .collection('scans')
            .doc(oldData.docId)
            .update(updates);

    }

    deleteScan(docId) {
        this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans').doc(docId).delete();
    }

    addUserName(username, pincode) {
        let newData = { 'displayName': username, 'pinCode': pincode };
        this.db.collection('users')
                .doc(this.auth.currentUser.uid)
                .collection('displayNames')
                .doc(username)
                .set(newData);
    }

    updateUserName(oldusername, newusername, newpincode) {
        let newData = { 'displayName': newusername, 'pinCode': newpincode };
        this.db.collection('users')
                .doc(this.auth.currentUser.uid)
                .collection('displayNames')
                .doc(oldusername)
                .update(newData);
    }

    deleteUserName(username) {
        this.db.collection('users').doc(this.auth.currentUser.uid).collection('displayNames').doc(username).delete();
    }

    async uploadFile(file) {
        let rootStorageRef = this.storage.ref();
        let fileName = this.getCurrentUserUid() + '.csv';
        let uploadTask = await rootStorageRef.child(fileName).put(file).then(function(snapshot) { return snapshot; });
        return uploadTask;

        /*uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            }, function(error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log('storage/unauthorized');
                        break;
                    case 'storage/canceled':
                        console.log('storage/canceled');
                        break;
                    case 'storage/unknown':
                        console.log('storage/unknown');
                        break;
                    default:
                        break;
                }
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    //return downloadURL;
                });
            });*/
    }

    async getToDoFileURL() {
        let fileRef = await this.storage.ref().child(this.getCurrentUserUid() + '.csv').getDownloadURL()
            .then(function(url) {
                return url;
            }).catch(function(error) {
                return null;
            });
        return fileRef;
    }

    async getUploadFileSize() {

    }

    async getUploadFileData() {
        let doc = this.db.collection('formUploads').doc(this.auth.currentUser.uid);
        let counts = await doc.get().then(function(doc) {
            let ret = [-1, -1, -1]; // Return -1 if no document found
            if (doc.exists) {
                ret[0] = doc.data().uploadArray.length;
                ret[1] = doc.data().rowCount;
                ret[2] = doc.data().timestamp;
            }
            return ret;
        });
        return counts;
    }
}

export default new Firebase();