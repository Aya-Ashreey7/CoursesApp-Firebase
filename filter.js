
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, query, where ,getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged ,signOut} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWQR42Z63qDYmiHqMGzotRGz6oqGnS1qo",
    authDomain: "courseapp-firestoredb.firebaseapp.com",
    projectId: "courseapp-firestoredb",
    storageBucket: "courseapp-firestoredb.firebasestorage.app",
    messagingSenderId: "154405664464",
    appId: "1:154405664464:web:0188213a35dfe99fda90d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth();

const auth = getAuth(app);
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    }
});
// =========================== filter data =======================

async function DisplayFilredData(field, operation, value) {
    try {
        if (!currentUser) {
            alert("User not signed in yet.");
            // console.log("User not signed in yet.");
            return;
        }
        let filteredTableBody = document.getElementById("courseTableBody");
        filteredTableBody.innerHTML = ""; // Clear previous results

        // Convert value based on field type
        let convertedValue = value;
        if (field === "hours" || field === "finalMark") {
            convertedValue = Number(value);
        } else if (field === "available") {
            convertedValue = value === "true";
        }


        let q = query(collection(db, 'Courses'), where(field, operation, convertedValue));
        const snapshot = await getDocs(q);

        // filteredTableBody.innerHTML = "";

        if (snapshot.empty) {
            const row = document.createElement("tr");
            row.innerHTML =
                '<td colspan="4" class="text-center">No matching courses found</td>';
            filteredTableBody.appendChild(row);
        } else {
            snapshot.forEach((doc) => {
                const course = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                          <td>${course.name}</td>
                          <td>${course.hours}</td>
                          <td>${course.finalMark}</td>
                          <td>${course.available ? "True" : "False"}</td>
                      `;
                filteredTableBody.appendChild(row);
            });
        }

    } catch (error) {

        console.log("Error fetching filtered data:", error);

    }
}
 // =========================== logout =======================

async function Logout() {

    //  await createUserWithEmailAndPassword(auth, email, password)
    try {
        await signOut(auth);

        // Redirect once signup is successfu
        location.assign("signIn.html");

    } catch (error) {
        console.error("Error signing out:", error.message);
    }

}


onAuthStateChanged(auth, (user) => {
    const signInNav = document.getElementById("signInNav");
    const signUpNav = document.getElementById("signUpNav");
    const signOutNav = document.getElementById("signOutNav");
    const userEmailNav = document.getElementById("userEmailNav");
    const userEmailSpan = document.getElementById("userEmail");

    if (user) {
        signInNav.classList.add("d-none");
        signUpNav.classList.add("d-none");
        signOutNav.classList.remove("d-none");
        userEmailNav.classList.remove("d-none");
        userEmailSpan.textContent = user.email;
    } else {
        signInNav.classList.remove("d-none");
        signUpNav.classList.remove("d-none");
        signOutNav.classList.add("d-none");
        userEmailNav.classList.add("d-none");
        userEmailSpan.textContent = "";
    }
})




export { DisplayFilredData,Logout,filterCourses }
