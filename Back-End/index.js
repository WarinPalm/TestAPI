const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Middle ware สำหรับตรวจสอบว่ามีข้อมูลครบมั้ย
const validateStudent =(req, res, next)=> {
    const { id, name, age } = req.body;
    // ตรวจสอบว่า id, name, และ age ถูกส่งมาครบรึป่าว
    if (!id || !name || !age ) {
        return res.status(400).send('Invalid data');
    }
    next();
}
const students = [
    {id:65112274, name: "Warin", age:20},
    {id:65112275, name: "Palm", age:21},
    {id:65112276, name: "Por", age:22}
];

app.get('/students',(req, res)=>{
    res.send(students);
});
app.get('/students/:id', (req, res)=>{ //สำหรับดึงข้อมูลตาม id 
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if(student){ //หากมีให้แสดงข้อมูลของคนๆนั้น
        res.send(student);
    }
    else{
        res.status(404).send('Error 404 : Student not found');
    }
})
app.post('/students', validateStudent, (req, res) => { //สำหรับการเพิ่มข้อมูลนักศึกษาใหม่ๆเข้าไป
    const { id, name, age } = req.body; 
    students.push({ id, name, age }); //ให้ตัวแปรทุกตัวที่ req body เข้าไปใน array ของ Students
    res.send(`Id: ${id}, Name: ${name}, Age: ${age}`); //แสดงหน้า console ว่าเพิ่มแล้วใน postman
});
app.put('/students/:id', (req, res) => { //สำหรับแก้ไขข้อมูลของนักศึกษาผ่าน id
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (student) { //หากมีให้ทำตามเงื่อนไข
        const { name, age } = req.body; //รับชื่อและอายุที่ใส่เข้ามาผ่าน req body
        if(name){ //เช็คว่าหากมี
            student.name = name; //เปลี่ยนชื่อ
        }
        if(age){ //เช็คว่าหากมี
            student.age = age; //เปลี่ยนอายุ
        }
        res.send(`Updated Student: Id: ${student.id}, Name: ${student.name}, Age: ${student.age}`);
    } 
    else {
        res.status(404).send('Error 404 : Student not found');
    }
});
app.delete('/students/:id', (req, res) => { //สำหรับลบข้อมูลของนักศึกษาผ่าน id
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id); //เช็คว่านักศึกษาคนนั้นอยู่ที่ index ที่เท่าไหร่ใน array Students
    if (index >= 0) { // หาก index ที่ได้มามีค่ามากกว่าเท่ากับ 0 เพื่อ confirm ว่ามีจริงใน array ให้ทำตามเงื่อนไข
        students.splice(index, 1); //ลบนักศึกษาคนนั้น แค่คนเดียว
        res.send("Student has been deleted"); //แสดงผ่าหน้า console Postman ว่าลบแล้ว
    } else {
        res.status(404).send('Error 404 : Student not found');
    }
});
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});
