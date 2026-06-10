let Teachers_part = document.getElementById("Teachers_part");
let StudentsPart = document.getElementById("StudentsPart")
async function getData(url) {
  try{
    let res = await axios.get(`https://6a26c767a84f9d39e907e1b6.mockapi.io/${url}`);
    let material = res.data;
    if(url === "teachers"){
        console.log(material);
        
           forTeachers(Teachers_part, material)
    }
    if(url === "students"){
       forStudents(StudentsPart, material) 
    }
    
  }catch(err){
    console.log(err);
    
  }
}
function forTeachers(content, data){
    content.innerHTML = "";
    data.map((el) =>{
        content.innerHTML += `
        <div class="w-full h-[84px] px-2 flex items-center justify-between bg-[white] rounded-[15px] border border-[gray]">
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
            <button class="p-3 bg-[blue] border border-[gray] text-[white] rounded-[15px]">Edit</button>
            <button onClick="deleteTeacher(${el.id})" class="p-3 bg-[red] border border-[gray] text-[white] rounded-[15px]">Delete</button>
        </div>
    </div>
        `
    })
}
function forStudents(content, data){
     content.innerHTML = "";
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
            <button class="p-3 bg-[blue] border border-[gray] text-[white] rounded-[15px]">Edit</button>
            <button onClick="deletestudent(${el.id})" class="p-3 bg-[red] border border-[gray] text-[white] rounded-[15px]">Delete</button>
        </div>
    </div>
        `
    })
}
getData("teachers")
getData("students")
async function deleteTeacher(id) {
  try {
    await axios.delete(
      `https://6a26c767a84f9d39e907e1b6.mockapi.io/teachers/${id}`
    );

    await getData("teachers");

  } catch (err) {
    console.log(err);
  }
}
async function deletestudent(id) {
  console.log("Student ID:", id);

  try {
    await axios.delete(
      `https://6a26c767a84f9d39e907e1b6.mockapi.io/students/${id}`
    );

    await getData("students");
  } catch (err) {
    console.log(err.response);
  }
}