import firebase, { firebaseAuth } from "../helpers/firebase";
import firebaseORM from "../helpers/firebaseORM";
export default new firebaseORM(firebase, "users");
