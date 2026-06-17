let path = new URLSearchParams(window.location.search);
let thefirst = path.get("id");

let teacherAvatar = document.getElementById("teacherAvatar");
let headerTeacherName = document.getElementById("headerTeacherName");
let teacherEmail = document.getElementById("teacherEmail");
let teacherExperience = document.getElementById("teacherExperience");
let teacherSalary = document.getElementById("teacherSalary");
let commentInput = document.getElementById("commentInput");
let submitCommentBtn = document.getElementById("submitCommentBtn");
let commentForm = document.getElementById("commentForm");
let commentsContainer = document.getElementById("commentsContainer");

function renderComments(commentsArray) {

  commentsContainer.innerHTML = "";

  if (!commentsArray || commentsArray.length === 0) {
    commentsContainer.innerHTML = `<p id="noCommentsText" class="text-xs text-gray-400 italic">No comments posted yet.</p>`;
    return;
  }


  commentsArray.forEach((singleComment) => {
    commentsContainer.innerHTML += `
      <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-gray-700">User Comment</span>
        </div>
        <p class="text-xs text-gray-600 leading-normal">
          ${singleComment}
        </p>
      </div>
    `;
  });
}

async function fetchSingleTeacher() {
  if (!thefirst) {
    console.error("No teacher ID found in the URL parameter!");
    return;
  }

  try {
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${thefirst}`);
    let teacher = res.data;
    
    if (teacher) {
      teacherAvatar.src = teacher.avatar; 
      headerTeacherName.textContent = teacher.teacherName;
      teacherEmail.textContent = teacher.email;
      teacherExperience.textContent = `${teacher.experience} Months`;
      teacherSalary.textContent = `$${teacher.salary}/mo`;
      

      renderComments(teacher.comments);
    }
    
  } catch (err) {
    console.error("Error fetching the teacher data:", err);
  }
}

fetchSingleTeacher();

commentForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  
  let usertext = commentInput.value.trim();
  if (!usertext) return; 

  try {
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${thefirst}`);
    let teacher = res.data;

    if (!teacher.comments) {
      teacher.comments = [];
    }

    teacher.comments.push(usertext);


    await axios.put(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${thefirst}`, teacher);
    commentInput.value = ""; 
    
    renderComments(teacher.comments);

  } catch (err) {
    console.error("Error updating teacher comments:", err);
  }
});
async function getStudent(){
      try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students`);
    let material = res?.data;
    let filtered_material = material.filter((el) => el.teacherId == thefirst)

       forStudents(StudentsPart, filtered_material) 
  }catch(err){
    console.log(err);
    
  }
}
getStudent()
if(modalContent){
  modalContent.addEventListener("click", function(e){
  e.stopPropagation()
});
modalContent.addEventListener("submit",async function(e){
  e.preventDefault();
  let teacherInfo = {};
  teacherInfo.email = e.target[0].value;
  teacherInfo.teacherName = e.target[1].value;
  teacherInfo.avatar = e.target[2].value;
  teacherInfo.salary = e.target[3].value;
  teacherInfo.subject = e.target[4].value;
  teacherInfo.phoneNumber = e.target[5].value;
  teacherInfo.experience = e.target[6].value;

  try{
    selectID ? await axios.put(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${selectID}`, teacherInfo) :
  await axios.post(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers`, teacherInfo);

   await getData("teachers");
   e.target.reset();
   selectID = null;
  }catch(err){
    console.log(err);
    
  }
  teachersSorter.value = "Normal";
  modal.classList.add("hidden")
});
}
if(modalContentStu){
    modalContentStu.addEventListener("click", function(e){
  e.stopPropagation()
});
modalContentStu.addEventListener("submit", async function(e) {
  e.preventDefault();
  
  // Use explicit IDs or grab directly from the form elements by name/id
  let StudentInfo = {
    email: document.getElementById("studentEmailInput")?.value || e.target[0].value,
    studentName: document.getElementById("studentNameInput")?.value || e.target[1].value,
    avatar: document.getElementById("studentAvatarInput")?.value || e.target[2].value,
    age: document.getElementById("studentAgeInput")?.value || e.target[3].value,
    address: document.getElementById("studentAddressInput")?.value || e.target[4].value,
    parentName: document.getElementById("studentParentInput")?.value || e.target[5].value,
    teacherId: thefirst // Crucial: Use the current teacher ID variable directly!
  };

  try {
    if (selectStuID) {
      await axios.put(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students/${selectStuID}`, StudentInfo);
    } else {
      await axios.post(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students`, StudentInfo);
    }

    // Refresh the list layout for this specific teacher profile
    await getStudent();
    
    // Reset form elements
    e.target.reset();
    selectStuID = null;
    
    // Safely reset sorting options if they exist
    if (window.StudentsSorter) StudentsSorter.value = "Normal";
    
    // Close the modal cleanly
    modalStu.classList.add("hidden");

  } catch(err) {
    // If anything fails inside the try block, this console error will show you exactly why!
    console.error("Critical error during student update submission:", err);
  }
})};