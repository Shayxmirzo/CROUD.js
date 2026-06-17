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
let forOnepagestu = document.getElementById("forOnepagestu");

function renderComments(commentsArray) {
  if (!commentsContainer) return;
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
      if (teacherAvatar) teacherAvatar.src = teacher.avatar; 
      if (headerTeacherName) headerTeacherName.textContent = teacher.teacherName;
      if (teacherEmail) teacherEmail.textContent = teacher.email;
      if (teacherExperience) teacherExperience.textContent = `${teacher.experience} Months`;
      if (teacherSalary) teacherSalary.textContent = `$${teacher.salary}/mo`;
      
      renderComments(teacher.comments);
    }
    
  } catch (err) {
    console.error("Error fetching the teacher data:", err);
  }
}
fetchSingleTeacher();


if (commentForm) {
  commentForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    if (!commentInput) return;
    
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
}


async function getStudent() {
  try {
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students`);
    let material = res?.data;
    
    // FILTER: Only keep students that match this teacher's ID
    let filteredStu = material.filter((el) => el.teacherId == thefirst);
    
    console.log("Filtered students for this teacher:", filteredStu);
    
    // Pass the FILTERED list to your function
    if (typeof forStudents === "function" && forOnepagestu) {
       forStudents(forOnepagestu, filteredStu); 
    } 
  } catch (err) {
    console.log("API Error fetching students:", err);
  }
}
getStudent();


function forStudents(container, data) {
  if (!container) return;
  container.innerHTML = "";
  
  if (data.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-500 italic">No students assigned to this teacher yet.</p>`;
    return;
  }

  data.forEach(student => {
    container.innerHTML += `
      <div class="w-full h-[84px] px-2 flex items-center justify-between bg-[white] rounded-[15px] border border-[gray] mb-2">
        <div class="flex items-center gap-3">
            <div class="w-13 h-13 bg-[gray] overflow-hidden rounded-full flex items-center justify-center">
                <img src="${student.avatar || 'https://via.placeholder.com/50'}" alt="" class="w-full h-full object-cover">
            </div>
            <div>
                <h1 class="text-[22px] text-[black] font-bold">${student.studentName || 'Unknown Student'}</h1>
                <p class="text-[14px] text-[gray]">${student.email || 'No Email'}</p>
                <p class="text-[14px] text-[gray]">${student.parentName || 'No Parent Info'}</p>
            </div>
        </div>
        <div>
            <button onClick="editStudent('${student.id}')" class="p-3 bg-[blue] border border-[gray] text-[white] rounded-[15px]">Edit</button>
            <button onClick="deletestudent('${student.teacherId}', '${student.id}')" class="p-3 bg-[red] border border-[gray] text-[white] rounded-[15px]">Delete</button>
        </div>
      </div>
    `;
  });
}



if (typeof modalContentStu !== "undefined" && modalContentStu) {
  modalContentStu.addEventListener("click", function(e){
    e.stopPropagation();
  });
  modalContentStu.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    let StudentInfo = {
      email: document.getElementById("studentEmailInput")?.value || e.target[0].value,
      studentName: document.getElementById("studentNameInput")?.value || e.target[1].value,
      avatar: document.getElementById("studentAvatarInput")?.value || e.target[2].value,
      age: document.getElementById("studentAgeInput")?.value || e.target[3].value,
      address: document.getElementById("studentAddressInput")?.value || e.target[4].value,
      parentName: document.getElementById("studentParentInput")?.value || e.target[5].value,
      teacherId: thefirst 
    };

    try {
      if (typeof selectStuID !== "undefined" && selectStuID) {
        await axios.put(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students/${selectStuID}`, StudentInfo);
      } else {
        await axios.post(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students`, StudentInfo);
      }

      await getStudent();
      e.target.reset();
      if (typeof selectStuID !== "undefined") selectStuID = null;
      if (window.StudentsSorter) StudentsSorter.value = "Normal";
      if (typeof modalStu !== "undefined") modalStu.classList.add("hidden");

    } catch(err) {
      console.error("Critical error during student update submission:", err);
    }
  });
}