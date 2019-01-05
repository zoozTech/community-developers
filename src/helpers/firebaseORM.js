export default class firebaseORM {
  constructor(firebase, database) {
    if (!typeof firebase === "object") throw "Firebase is required";
    this.database = database;
    this.firebase = firebase;
  }

  find = () => {
    let array = [];
    return new Promise((resolve, reject) => {
      this.firebase
        .database()
        .ref(`/${this.database}`)
        .once("value")
        .then(snapshot => {
          let objs = snapshot.val() || [];
          Object.keys(objs).forEach(name => {
            array = array.concat(objs[name]);
          });

          resolve(array);
        });
    });
  };

  findOne = id => {
    return new Promise((resolve, reject) => {
      this.firebase
        .database()
        .ref(`/${this.database}/${id}`)
        .once("value")
        .then(snapshot => {
          if (snapshot.val()) resolve(snapshot.val());
          reject();
        });
    });
  };

  findAndUpdate = (id, options) => {
    return new Promise((resolve, reject) => {
      this.firebase
        .database()
        .ref(`/${this.database}/${id}`)
        .set(options)
        .then(resolve)
        .catch(reject);
    });
  };
}
