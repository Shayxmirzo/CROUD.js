let Teachers_part = document.getElementById("Teachers_part");
let StudentsPart = document.getElementById("StudentsPart");
let addTeacher = document.getElementById("addTeacher");
let modal = document.getElementById("modal");
let modalContent = document.getElementById("modalContent");
let email = document.getElementById("email");
let teacherFullname = document.getElementById("teacherFullname");
let avatar = document.getElementById("avatar");
let salary = document.getElementById("salary");
let subject = document.getElementById("subject");
let floating_phone = document.getElementById("floating_phone");
let experience = document.getElementById("experience");
let search = document.getElementById("search");
let teachersSorter = document.getElementById("teachersSorter");
let addStudent = document.getElementById("addStudent");
let modalStu = document.getElementById("modalStu");
let modalContentStu = document.getElementById("modalContentStu");
let StudentsSorter = document.getElementById("StudentsSorter");
let SearchStu = document.getElementById("searchStu");
let teacherselect = document.getElementById("teacherselect");
let studentEmail = document.getElementById("studentEmail");
let studentName = document.getElementById("studentName");
let studentAvatar = document.getElementById("studentAvatar");
let studentAge = document.getElementById("studentAge");
let studentAddress = document.getElementById("studentAddress");
let parentName = document.getElementById("parentName");
let selectID = null;
let selectStuID = null;

async function getData(url) {
  
  try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/${url}`);
    let material = res?.data;
    if(url === "teachers"){
       
           forTeachers(Teachers_part, material)
    }
    if(url === "students"){
    
     
      let iwork = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers`);
      iwork.data.map((el) =>{
        teacherselect.innerHTML +=`
        <option value="${el.id}">${el.teacherName}</option>
        `
      })
       forStudents(StudentsPart, material) 
    }
    
  }catch(err){
    console.log(err);
    
  }
}
function forTeachers(content, data){
    content.innerHTML ="";
    data.map((el) =>{
        content.innerHTML += `
        <a href="./teacherpage.html?id=${el.id}" class="w-full h-[84px] px-2 flex items-center justify-between bg-[white] rounded-[15px] border border-[gray]">
        <div class="flex items-center gap-3">
            <div class="w-13 h-13 bg-[gray] overflow-hidden rounded-full">
                <img src="${el.avatar}" alt="">
            </div>
            <div class="">
                <h1 class="text-[22px] text-[black] font-bold">${el.teacherName}</h1>
                <p class="text-[14px] text-[gray]">${el.subject}</p>
                <p class="text-[14px] text-[gray]">${el.phoneNumber}</p>
            </div>
        </div>
        <div>
            <button onClick="editTeacher(event,${el.id})" class="p-3 bg-[blue] border border-[gray] text-[white] rounded-[15px]">Edit</button>
            <button onClick="deleteTeacher(event,${el.id})" class="p-3 bg-[red] border border-[gray] text-[white] rounded-[15px]">Delete</button>
        </div>
    </a>
        `
    })
}
function forStudents(content, data){
     content.innerHTML ="";
    data.map((el) =>{
        content.innerHTML += `
        <div class="w-full h-[84px] px-2 flex items-center justify-between bg-[white] rounded-[15px] border border-[gray]">
        <div class="flex items-center gap-3">
            <div class="w-13 h-13 bg-[gray] overflow-hidden rounded-full">
                <img src="${el.avatar}" alt="">
            </div>
            <div class="">
                <h1 class="text-[22px] text-[black] font-bold">${el.studentName}</h1>
                <p class="text-[14px] text-[gray]">${el.email}</p>
                <p class="text-[14px] text-[gray]">${el.parentName}</p>
            </div>
        </div>
        <div>
            <button onClick="editStudent('${el.id}')" class="p-3 bg-[blue] border border-[gray] text-[white] rounded-[15px]">Edit</button>
            <button onClick="deletestudent('${el.teacherId}', '${el.id}')" class="p-3 bg-[red] border border-[gray] text-[white] rounded-[15px]">Delete</button>
        </div>
    </div>
        `
    })
}
getData("teachers")
getData("students")
async function deleteTeacher(event,id) {
    event.preventDefault();  
  event.stopPropagation();
  try {
    let check = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students`);
  
    let filteredstu = check.data.filter((el) => el.teacherId == id);

    console.log("Students found for this teacher:", filteredstu);
    
    if (filteredstu.length > 0) {
      alert('This teacher has students. Please delete the students before deleting the teacher');
    } else {
      await axios.delete(
        `https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${id}`
      );
      await getData("teachers");
    }

  } catch (err) {
    console.log(err);
  }
}
async function deletestudent(tId,id) {
  console.log("Student ID:", id);

  try {
    await axios.delete(
      `https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${tId}/students/${id}`
    );

    await getData("students");
    await getStudent()
  } catch (err) {
    console.log(err);
  }
}
if (addTeacher) {
  addTeacher.addEventListener("click", function () {
    modal.classList.remove("hidden");
  });
}
if (addStudent) {
  addStudent.addEventListener("click", function () {
    modalStu.classList.remove("hidden");
  });
}
if(modal){
  modal.addEventListener("click",  function(){
  modal.classList.add("hidden")
});
}
if(modalStu){
  modalStu.addEventListener("click", function(){
  modalStu.classList.add("hidden")
})
}
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
modalContentStu.addEventListener("submit",async function(e){
  e.preventDefault();
  let StudentInfo = {};
  StudentInfo.email = e.target[0].value;
  StudentInfo.studentName = e.target[1].value;
  StudentInfo.avatar = e.target[2].value;
  StudentInfo.age = e.target[3].value;
  StudentInfo.address = e.target[4].value;
  StudentInfo.parentName = e.target[5].value;
  StudentInfo.teacherId = e.target[6].value;

  try{
    selectStuID ? await axios.put(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students/${selectStuID}`, StudentInfo) :
  await axios.post(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students`, StudentInfo);

   await getData("students");
   await getStudent()
   e.target.reset();
   selectStuID = null;
  }catch(err){
    console.log(err);
    
  }
  StudentsSorter.value = "Normal";
  modalStu.classList.add("hidden")
});

}
if(teachersSorter){
teachersSorter.addEventListener("change",async function(e){
  try{
    if(e.target.value === "Normal"){
      getData("teachers");
      return
    }
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers?sortBy=teacherName&order=${e.target.value}`);
    forTeachers(Teachers_part, res.data)
  }catch(err){
    console.log(err);
  }
});
}
if(StudentsSorter){
  StudentsSorter.addEventListener("change",async function(e){
  try{
    if(e.target.value === "Normal"){
      getData("students");
      return
    }
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students?sortBy=studentName&order=${e.target.value}`);
    forStudents(StudentsPart, res.data)
  }catch(err){
    console.log(err);
  }
});
}
if(search){
search.addEventListener("input", async function(e){
  try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers?teacherName=${e.target.value}`);
    forTeachers(Teachers_part, res?.data)
  }catch(err){
    console.log(err);
  }
});
}
if(SearchStu){
SearchStu.addEventListener("input", async function(e){
  try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students?studentName=${e.target.value}`);
    forStudents(StudentsPart, res?.data)
  }catch(err){
    console.log(err);
  }
});
}
async function editTeacher(event,id) {
  event.preventDefault();  
  event.stopPropagation();
  modal.classList.remove("hidden");
  selectID = id;
  try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${id}`);
    email.value = res?.data.email;
    teacherFullname.value = res?.data.teacherName;
    avatar.value = res?.data.avatar;
    salary.value = res?.data.salary;
    subject.value = res?.data.subject;
    floating_phone.value = res?.data.phoneNumber;
    experience.value = res?.data.experience;
  }catch(err){
    console.log(err);
    
  }
};
async function editStudent(id) {
   modalStu.classList.remove("hidden");
  selectStuID = id;
  try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/students/${id}`);
    studentEmail.value = res?.data.email;
    studentName.value = res?.data.studentName;
    studentAvatar.value = res?.data.avatar;
    studentAge.value = res?.data.age;
    studentAddress.value = res?.data.address;
    parentName.value = res?.data.parentName;
    teacherselect.value = res?.data.teacherId;
  }catch(err){
    console.log(err);
    
  }
}
