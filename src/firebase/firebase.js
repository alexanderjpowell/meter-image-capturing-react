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

    async reauthenticateUserWithPassword(password) {
        let credential = firebase.auth.EmailAuthProvider.credential(this.auth.currentUser.email, password);
        return await this.getCurrentUser().reauthenticateWithCredential(credential);
    }

    async changePassword(newPassword) {
        return await this.getCurrentUser().updatePassword(newPassword);
    }

    async queryCustomDateRange(startDate, endDate) {
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans')
            .where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).orderBy('timestamp', 'desc');//.limit(5);
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
            .where('timestamp', '>', range).orderBy('timestamp', 'desc');//.limit(50);
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
            .where('timestamp', '>', range).orderBy('timestamp', 'desc');//.limit(50);
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
            .where('timestamp', '>', range).orderBy('timestamp', 'desc');//.limit(50);
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
                .orderBy('timestamp', 'desc').limit(100);
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
        if (oldData['machineId'] !== newData['machineId']) {
            updates['machineId'] = newData['machineId'];
        }
        if (oldData['progressive1'] !== newData['progressive1']) {
            updates['progressive1'] = newData['progressive1'];
        }
        if (oldData['progressive2'] !== newData['progressive2']) {
            updates['progressive2'] = newData['progressive2'];
        }
        if (oldData['progressive3'] !== newData['progressive3']) {
            updates['progressive3'] = newData['progressive3'];
        }
        if (oldData['progressive4'] !== newData['progressive4']) {
            updates['progressive4'] = newData['progressive4'];
        }
        if (oldData['progressive5'] !== newData['progressive5']) {
            updates['progressive5'] = newData['progressive5'];
        }
        if (oldData['progressive6'] !== newData['progressive6']) {
            updates['progressive6'] = newData['progressive6'];
        }
        if (oldData['progressive7'] !== newData['progressive7']) {
            updates['progressive7'] = newData['progressive7'];
        }
        if (oldData['progressive8'] !== newData['progressive8']) {
            updates['progressive8'] = newData['progressive8'];
        }
        if (oldData['progressive9'] !== newData['progressive9']) {
            updates['progressive9'] = newData['progressive9'];
        }
        if (oldData['progressive10'] !== newData['progressive10']) {
            updates['progressive10'] = newData['progressive10'];
        }
        if (oldData['location'] !== newData['location']) {
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
                return -1;
            });
        return fileRef;
    }

    async getUploadFileSize() {
        let fileRef = await this.storage.ref().child(this.getCurrentUserUid() + '.csv').getMetadata()
            .then(function(metadata) {
                return metadata.size;
            }).catch(function(error) {
                return -1;
            });
        return fileRef;
    }

    async getUploadFileData() {
        let doc = this.db.collection('formUploads').doc(this.auth.currentUser.uid);
        let counts = await doc.get().then(function(doc) {
            let ret = [-1, -1, -1]; // Return -1 if no document found
            if (doc.exists) {
                ret[0] = doc.data().uploadArray.length;
                ret[1] = doc.data().rowCount;
                ret[2] = doc.data().timestamp.toDate().toDateString();
            }
            return ret;
        });
        return counts;
    }

    setToDoListener() {
        return this.db.collection('formUploads').doc(this.auth.currentUser.uid);/*
            .onSnapshot(function(doc) {
                console.log("Current data: ", doc.data());
            });*/
    }

    getDisplayResetValues() {
        try {
            let doc = this.db.collection('users').doc(this.auth.currentUser.uid);
            return doc.get().then(function(doc) {
                if (doc.exists && 'displayResetValues' in doc.data()) {
                    //console.log(typeof(doc.data()));
                    return doc.data().displayResetValues;
                }
                return false;
            }).catch(function(error) {
                return false;
            });
        } catch (error) {   
            return false;
        }
    }

    setDisplayResetValues(value) {
        this.db.collection('users').doc(this.auth.currentUser.uid).update({ displayResetValues: value });
    }

    getResetTime() {
        let doc = this.db.collection('users').doc(this.auth.currentUser.uid);
        let ret = new Date();
        ret.setHours(12);
        ret.setMinutes(0);
        return doc.get().then(function(doc) {
            if (doc.exists && 'resetTime' in doc.data()) {
                return doc.data().resetTime.toDate();
            }
            return ret;
        }).catch(function(error) {
            return ret;
        });
    }

    setResetTime(time) {
        this.db.collection('users').doc(this.auth.currentUser.uid).update({ resetTime: time });
    }

    async getDocsOnDate(year, month, day, resetHours, resetMinutes) {
        let startDate, endDate;
        startDate = new Date(year, month, day, resetHours, resetMinutes);
        endDate = new Date(new Date(startDate).getTime() + 60 * 60 * 24 * 1000); // Add 24 hours
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans');
        let query = scansRef.where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).orderBy('timestamp', 'desc').limit(10);
        let curDayScans = [];
        await query.get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                curDayScans.push(doc.data());
            });
        }).catch(function(error) {
            console.log(error);
        });

        // Now calculate previous day
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        query = scansRef.where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).orderBy('timestamp', 'desc').limit(10);
        let prevDayScans = [];
        await query.get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                prevDayScans.push(doc.data());
            });
        }).catch(function(error) {
            console.log(error);
        });
        //

        // curDayScans is now an array of documents of the selected date, order by date
        // for each of these documents, we need to pair it with docs from the previous 
        // date that match the machine id.  The previous days scans are in prevDayScans
        let ret = [];
        let i = 0;
        curDayScans.forEach(function(curDoc) {
            ret.push([curDoc]);
            prevDayScans.forEach(function(prevDoc) {
                if (curDoc.machine_id === prevDoc.machine_id) {
                    ret[i].push(prevDoc);
                }
            });
            i++;
        });
        // ret looks like {{doc, doc}, {doc, doc}, {doc, doc, ...}} // mostly pairs but potentially 
        // more than 2 values in each element of the parent array.  The first value in each is the 
        // current day's value, and subsequent values are those that match the machine id

        let out = [];
        for (let i = 0; i < ret.length; i++) {
            if (ret[i].length === 2) {
                for (let j = 1; j <= 10; j++) {
                    // also check if values aren't empty strings
                    if (j === 1 && ret[i][0].progressive1 && ret[i][1].progressive1) {
                        if (!isNaN(ret[i][1].progressive1) && !isNaN(ret[i][0].progressive1)) {
                            let prev = +ret[i][1].progressive1;
                            let cur = +ret[i][0].progressive1;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change//,
                                //outlier: change > 0.005 * 10000
                            });
                        }
                    } else if (j === 2 && ret[i][0].progressive2 && ret[i][1].progressive2) {
                        if (!isNaN(ret[i][1].progressive2) && !isNaN(ret[i][0].progressive2)) {
                            let prev = +ret[i][1].progressive2;
                            let cur = +ret[i][0].progressive2;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 3 && ret[i][0].progressive3 && ret[i][1].progressive3) {
                        if (!isNaN(ret[i][1].progressive3) && !isNaN(ret[i][0].progressive3)) {
                            let prev = +ret[i][1].progressive3;
                            let cur = +ret[i][0].progressive3;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 4 && ret[i][0].progressive4 && ret[i][1].progressive4) {
                        if (!isNaN(ret[i][1].progressive4) && !isNaN(ret[i][0].progressive4)) {
                            let prev = +ret[i][1].progressive4;
                            let cur = +ret[i][0].progressive4;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 5 && ret[i][0].progressive5 && ret[i][1].progressive5) {
                        if (!isNaN(ret[i][1].progressive5) && !isNaN(ret[i][0].progressive5)) {
                            let prev = +ret[i][1].progressive5;
                            let cur = +ret[i][0].progressive5;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 6 && ret[i][0].progressive6 && ret[i][1].progressive6) {
                        if (!isNaN(ret[i][1].progressive6) && !isNaN(ret[i][0].progressive6)) {
                            let prev = +ret[i][1].progressive6;
                            let cur = +ret[i][0].progressive6;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 7 && ret[i][0].progressive7 && ret[i][1].progressive7) {
                        if (!isNaN(ret[i][1].progressive7) && !isNaN(ret[i][0].progressive7)) {
                            let prev = +ret[i][1].progressive7;
                            let cur = +ret[i][0].progressive7;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 8 && ret[i][0].progressive8 && ret[i][1].progressive8) {
                        if (!isNaN(ret[i][1].progressive8) && !isNaN(ret[i][0].progressive8)) {
                            let prev = +ret[i][1].progressive8;
                            let cur = +ret[i][0].progressive8;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 9 && ret[i][0].progressive9 && ret[i][1].progressive9) {
                        if (!isNaN(ret[i][1].progressive9) && !isNaN(ret[i][0].progressive9)) {
                            let prev = +ret[i][1].progressive9;
                            let cur = +ret[i][0].progressive9;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    } else if (j === 10 && ret[i][0].progressive10 && ret[i][1].progressive10) {
                        if (!isNaN(ret[i][1].progressive10) && !isNaN(ret[i][0].progressive10)) {
                            let prev = +ret[i][1].progressive10;
                            let cur = +ret[i][0].progressive10;
                            let change = cur - prev;
                            out.push({ 
                                location: ret[i][0].location,
                                machine_id: ret[i][0].machine_id,
                                prog_name: 'Major',
                                base: 10000,
                                increment: 0.5,
                                prev_day_val: prev,
                                cur_day_val: cur,
                                change: change
                            });
                        }
                    }
                }
            }
        }

        // out is an array of objects like:
        // [ {location: ..., machine_id: ..., ..., change: ...}, {...} ]
        return out;
    }
}

export default new Firebase();