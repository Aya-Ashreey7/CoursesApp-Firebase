
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, addDoc, collection, onSnapshot, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWQR42Z63qDYmiHqMGzotRGz6oqGnS1qo",
    authDomain: "courseapp-firestoredb.firebaseapp.com",
    projectId: "courseapp-firestoredb",
    storageBucket: "courseapp-firestoredb.firebasestorage.app",
    messagingSenderId: "154405664464",
    appId: "1:154405664464:web:0188213a35dfe99fda90d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var formBtn = document.getElementById("formBtn");
// const form = document.getElementById("courseForm");
// const errorBox = document.getElementById("errorMessages");



async function addCourseData(event) {
    event.preventDefault(); // Prevent form submission
    var id = document.getElementById("cID").value;
    var name = document.getElementById("cName").value;
    var mark = document.getElementById("finalMark").value;
    var hours = document.getElementById("hours").value;
    var available = document.getElementById("course-available").checked;
    //   validation 
    const errors = [];
    const errorBox = document.getElementById("errorMessages");
    if (name === "") errors.push(" Course name is required.");
    if (isNaN(mark) || parseFloat(mark) <= 0) errors.push(" Final mark must be a positive number.");
    if (isNaN(hours) || parseFloat(hours) < 6) errors.push(" Hours must be 6 or more.");

    if (errors.length > 0) {
        errorBox.innerHTML = errors.join("<br>");
        errorBox.classList.remove("d-none");
        return;
    } else {
        errorBox.classList.add("d-none");
    }
    //  end validation 

    var courseData = {
        Name: name,
        finalMarks: mark,
        Hours: hours,
        Available: available
    }
    if (id == "") {
        var res = await addDoc(collection(db, 'Courses'), courseData)
        console.log(res);
        alert("Course added successfully");
        clear();
    }
    else {
        updateDoc(doc(db, 'Courses', id), courseData)
        alert("Course updated successfully");
        formBtn.textContent = "Add Course";
        clear();

    }

}
function clear() {
    document.getElementById("cID").value = "";
    document.getElementById("cName").value = "";
    document.getElementById("finalMark").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("course-available").checked = false;

}

onSnapshot(collection(db, 'Courses'), function name(snapshot) {
    console.log(snapshot.docs);
    var courses = []
    for (const doc of snapshot.docs) {
        // console.log(doc.id, doc.data());
        courses.push({ id: doc.id, ...doc.data() });

    }
    console.log(courses);
    DisplayCourses(courses);
})
function DisplayCourses(courses) {
    var table = document.getElementById("courseTableBody");
    table.innerHTML = ""; 
    for (const crs of courses) {
        table.innerHTML += `
        <tr>
            <td>${crs.Name}</td>
            <td>${crs.finalMarks}</td>
            <td>${crs.Hours}</td>
            <td>${crs.Available}</td>
            <td>  <button class="btn btn-sm btn-success" onclick="editCourse('${crs.id}','${crs.Name}','${crs.finalMarks}','${crs.Hours}','${crs.Available}')">Edit</button>
         </td>
         <td><button class="btn btn-sm btn-danger" onclick="deleteCourse('${crs.id}')">Delete</button></td>

        </tr>`;
    }
}
// ==================================================
async function deleteCourse(id) {

    var agree = confirm("Are you sure you want to delete this course?")
    if (agree) {
        await deleteDoc(doc(db, 'Courses', id))
        alert("Course deleted successfully")
    }

}
// =================================================

function editCourse(id, name, finalMarks, hours, available) {
    document.getElementById("cID").value = id;
    document.getElementById("cName").value = name;
    document.getElementById("finalMark").value = finalMarks;
    document.getElementById("hours").value = hours;
    document.getElementById("course-available").checked = available;
    formBtn.textContent = "Update Course";

}
// =========================== logout =======================
const auth = getAuth(app);

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

export { addCourseData, DisplayCourses, deleteCourse, editCourse, Logout };