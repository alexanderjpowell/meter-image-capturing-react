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
        this.storageMonthlyReportsBucket = firebase.app().storage("gs://monthly-change-reports");
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

    async getUpperThreshold() {
        let doc = this.db.collection('users').doc(this.auth.currentUser.uid);
        let ret = 0;
        return doc.get().then(function(doc) {
            if (doc.exists && 'upperThreshold' in doc.data()) {
                return doc.data().upperThreshold;
            }
            return ret;
        }).catch(function(error) {
            return ret;
        });
    }

    setUpperThreshold(threshold) {
        this.db.collection('users').doc(this.auth.currentUser.uid).set({ upperThreshold: threshold }, { merge: true });
    }

    async getLowerThreshold() {
        let doc = this.db.collection('users').doc(this.auth.currentUser.uid);
        let ret = 0;
        return doc.get().then(function(doc) {
            if (doc.exists && 'lowerThreshold' in doc.data()) {
                return doc.data().lowerThreshold;
            }
            return ret;
        }).catch(function(error) {
            return ret;
        });
    }

    setLowerThreshold(threshold) {
        this.db.collection('users').doc(this.auth.currentUser.uid).set({ lowerThreshold: threshold }, { merge: true });
    }

    async getDocsOnDate(year, month, day, resetHours, resetMinutes) {
        // First calculate current day
        let startDate, endDate;
        startDate = new Date(year, month, day, resetHours, resetMinutes);
        endDate = new Date(new Date(startDate).getTime() + 60 * 60 * 24 * 1000); // Add 24 hours
        let scansRef = this.db.collection('users').doc(this.auth.currentUser.uid).collection('scans');
        let query = scansRef.where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).orderBy('timestamp', 'desc');//.limit(10);
        let curDayScans = [];
        await query.get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                curDayScans.push(doc.data());
            });
        }).catch(function(error) {
            console.log(error);
        });
        //console.log(curDayScans);

        // Now calculate previous day
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        query = scansRef.where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).orderBy('timestamp', 'desc');//.limit(10);
        let prevDayScans = [];
        await query.get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                prevDayScans.push(doc.data());
            });
        }).catch(function(error) {
            console.log(error);
        });
        //

        let lowerThreshold = await this.getLowerThreshold();
        let upperThreshold = await this.getUpperThreshold();

        // curDayScans is now an array of documents of the selected date, order by date
        // for each of these documents, we need to pair it with docs from the previous 
        // date that match the machine id.  The previous days scans are in prevDayScans

        let ret = [];
        let match;
        for (let i = 0; i < curDayScans.length; i++) {
            match = false;
            for (let j = 0; j < prevDayScans.length; j++) {
                if (curDayScans[i].machine_id === prevDayScans[j].machine_id) {
                    let changes = this.compare(curDayScans[i], prevDayScans[j], lowerThreshold, upperThreshold);
                    changes.forEach(function(change) {
                        ret.push(change);
                    });
                    match = true;
                    break;
                }
            }
            // Add no match found
            if (!match) {
                let changes = this.compareNoMatch(curDayScans[i]);
                changes.forEach(function(change) {
                    ret.push(change);
                });
            }
            //
        }
        //console.log(ret);
        return ret;
    }

    compareNoMatch(cur) {
        let ret = [];
        let curProgressives = [cur.progressive1, cur.progressive2, cur.progressive3, cur.progressive4, cur.progressive5, cur.progressive6, cur.progressive7, cur.progressive8, cur.progressive9, cur.progressive10];
        let bases = [cur.base1, cur.base2, cur.base3, cur.base4, cur.base5, cur.base6, cur.base7, cur.base8, cur.base9, cur.base10];
        let increments = [cur.increment1, cur.increment2, cur.increment3, cur.increment4, cur.increment5, cur.increment6, cur.increment7, cur.increment8, cur.increment9, cur.increment10];

        for (let i = 0; i < 10; i++) {
            let curVal = +curProgressives[i];
            let base = +bases[i];
            let increment = +increments[i];
            let change = "-";
            //let underflow = false;
            let exception = false;
            if (!isNaN(curVal) && !isNaN(base) && !isNaN(increment)) {
                ret.push({
                    location: cur.location,
                    machine_id: cur.machine_id,
                    //prog_name: 'Major',
                    base: base,
                    increment: increment,
                    cur_day_val: curVal,
                    prev_day_val: "No Match Found",
                    change: change,
                    //underflow: underflow,
                    exception: exception,
                    progressive_index: i + 1,
                });
            }
        }
        return ret;
    }

    // Pair is an array with two elements: [curDoc, prevDoc]
    compare(cur, prev, lowerThreshold, upperThreshold) {
        let ret = [];

        let curProgressives = [cur.progressive1, cur.progressive2, cur.progressive3, cur.progressive4, cur.progressive5, cur.progressive6, cur.progressive7, cur.progressive8, cur.progressive9, cur.progressive10];
        let prevProgressives = [prev.progressive1, prev.progressive2, prev.progressive3, prev.progressive4, prev.progressive5, prev.progressive6, prev.progressive7, prev.progressive8, prev.progressive9, prev.progressive10];
        let bases = [cur.base1, cur.base2, cur.base3, cur.base4, cur.base5, cur.base6, cur.base7, cur.base8, cur.base9, cur.base10];
        let increments = [cur.increment1, cur.increment2, cur.increment3, cur.increment4, cur.increment5, cur.increment6, cur.increment7, cur.increment8, cur.increment9, cur.increment10];

        let curVal, prevVal, base, increment, change, exception;
        for (let i = 0; i < 10; i++) {
            if (curProgressives[i] === "" || isNaN(curProgressives[i]) || prevProgressives[i] === "" || isNaN(prevProgressives[i])) {
                continue;
            }
            curVal = +curProgressives[i];
            prevVal = +prevProgressives[i];
            if (bases[i] === undefined) {
                base = "-";
            } else {
                base = bases[i];
            }
            if (increments[i] === undefined) {
                increment = "-";
            } else {
                increment = increments[i];
            }
            change = this.round((curVal - prevVal) / prevVal * 100);
            exception = false;
            if (change >= 0) {
                exception = change >= upperThreshold;
            } else {
                exception = Math.abs(change) >= lowerThreshold;
            }
            //let exception = ((curVal - prevVal) <= (base * increment * 0.01 - lowerThreshold)) || ((curVal - prevVal) >= (base * increment * 0.01 + upperThreshold)); // Convert % to decimal
            //let underflow = (curVal - prevVal) <= (base * increment * 0.01);
            //if (!isNaN(curVal) && !isNaN(prevVal) && !isNaN(base) && !isNaN(increment)) {
            if (!isNaN(curVal) && !isNaN(prevVal)) {
                ret.push({
                    location: cur.location,
                    machine_id: cur.machine_id,
                    //prog_name: 'Major',
                    base: base,
                    increment: increment,
                    cur_day_val: curVal,
                    prev_day_val: prevVal,
                    change: change,
                    //underflow: underflow,
                    exception: exception,
                    progressive_index: i + 1,
                });
            }
        }
        return ret;
    }

    round(number) {
        return Math.round((number + Number.EPSILON) * 100) / 100;
    }

    async getMonthlyReports() {
        var listRef = this.storageMonthlyReportsBucket.ref().child(this.getCurrentUserUid());
        var list = await listRef.listAll();//.then(function(res) {
        return list.items;
    }
}

export default new Firebase();