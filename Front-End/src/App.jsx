import { useEffect, useState } from 'react';
import './App.css'; 
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  const [student, setStudent] = useState([]); // สร้าง state สำหรับเก็บข้อมูลนักเรียน
  const [form, setForm] = useState({ id: '', name: '', age: '' }); // สร้าง state สำหรับฟอร์มเพิ่ม/แก้ไขนักเรียน
  const [editingId, setEditingId] = useState(null); // สร้าง state สำหรับเก็บ ID ของนักเรียนที่กำลังแก้ไข

  useEffect(() => {
    fetchStudents(); // เรียกใช้งานฟังก์ชัน fetchStudents เมื่อคอมโพเนนต์ถูกสร้างขึ้น
  }, []); // ใช้ [] เพื่อให้ effect นี้ทำงานครั้งเดียว

  const fetchStudents = async () => {
    // ฟังก์ชันสำหรับดึงข้อมูลนักเรียนจาก API
    axios.get('http://localhost:3000/students') // ส่งคำขอ GET ไปยัง API
      .then(res => {
        setStudent(res.data); // ตั้งค่า state ของนักเรียนด้วยข้อมูลที่ได้รับ
      })
      .catch(err => {
        console.error('Error fetching data: ', err); // แสดงข้อผิดพลาดถ้ามี
      });
  };

  const createStudent = async () => {
    // ฟังก์ชันสำหรับสร้างนักเรียนใหม่
    try {
      await axios.post('http://localhost:3000/students', form); // ส่งคำขอ POST พร้อมข้อมูลฟอร์ม
      await fetchStudents(); // เรียกดูข้อมูลใหม่หลังจากสร้างนักเรียน
      setForm({ id: '', name: '', age: '' }); // รีเซ็ตฟอร์ม
      $('#addStudentModal').modal('hide'); // ปิด modal หลังจากสร้างเสร็จ
    } catch (error) {
      console.error('Error creating student:', error); // แสดงข้อผิดพลาดถ้ามี
    }
  };

  const deleteStudent = async (id) => {
    // ฟังก์ชันสำหรับลบนักเรียนตาม ID
    try {
      await axios.delete(`http://localhost:3000/students/${id}`); // ส่งคำขอ DELETE ไปยัง API
      await fetchStudents(); // เรียกดูข้อมูลใหม่หลังจากลบ
    } catch (error) {
      console.error('Error deleting student:', error); // แสดงข้อผิดพลาดถ้ามี
    }
  };

  const handleEdit = (student) => {
    // ฟังก์ชันสำหรับตั้งค่าฟอร์มเพื่อแก้ไขนักเรียน
    setForm({ id: student.id, name: student.name, age: student.age }); // ตั้งค่าฟอร์มด้วยข้อมูลนักเรียนที่เลือก
    setEditingId(student.id); // ตั้งค่า ID สำหรับการแก้ไข
    $('#editStudentModal').modal('show'); // แสดง modal เมื่อแก้ไข
  };

  const updateStudent = async () => {
    // ฟังก์ชันสำหรับอัปเดตข้อมูลนักเรียน
    try {
      await axios.put(`http://localhost:3000/students/${editingId}`, form); // ส่งคำขอ PUT พร้อมข้อมูลฟอร์ม
      await fetchStudents(); // เรียกดูข้อมูลใหม่หลังจากอัปเดต
      setForm({ id: '', name: '', age: '' }); // รีเซ็ตฟอร์ม
      setEditingId(null); // ตั้งค่า ID สำหรับการแก้ไขเป็น null
      $('#editStudentModal').modal('hide'); // ปิด modal หลังจากอัปเดตเสร็จ
    } catch (error) {
      console.error('Error updating student:', error); // แสดงข้อผิดพลาดถ้ามี
    }
  };

  return (
    <div className='container'> {/* สร้าง div สำหรับห่อหุ้มเนื้อหาทั้งหมด */}
      <h1>Student Management</h1> {/* แสดงหัวเรื่อง */}

      <button className="btn btn-primary mt-3 mb-3" onClick={() => { setEditingId(null); $('#addStudentModal').modal('show'); }}>
        Create {/* ปุ่มสำหรับเปิด modal เพื่อสร้างนักเรียนใหม่ */}
      </button>

      <table className="table table-bordered"> {/* สร้างตารางเพื่อแสดงข้อมูลนักเรียน */}
        <thead> {/* หัวตาราง */}
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody> {/* เนื้อหาของตาราง */}
          {student.map((student) => ( // ทำการวนลูปผ่านข้อมูลนักเรียน
            <tr key={student.id}> {/* ใช้ ID ของนักเรียนเป็น key */}
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEdit(student)}>Edit</button> {/* ปุ่มแก้ไข */}
                <button className="btn btn-danger ms-2" onClick={() => deleteStudent(student.id)}>Delete</button> {/* ปุ่มลบ */}
              </td>
            </tr>
          ))} 
        </tbody>
      </table>

      {/* Modal สำหรับเพิ่มนักเรียน */}
      <div className="modal fade" id="addStudentModal" tabIndex="-1" role="dialog" aria-labelledby="addStudentModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header"> {/* หัวข้อของ modal */}
              <h5 className="modal-title" id="addStudentModalLabel">Add Student</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"> {/* ปุ่มปิด modal */}
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body"> {/* เนื้อหาของ modal */}
              <input
                type="text"
                name="id"
                placeholder="ID"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })} // อัปเดต state ของฟอร์มเมื่อมีการเปลี่ยนแปลง
                className="form-control"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} // อัปเดต state ของฟอร์มเมื่อมีการเปลี่ยนแปลง
                className="form-control"
              />
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })} // อัปเดต state ของฟอร์มเมื่อมีการเปลี่ยนแปลง
                className="form-control"
              />
            </div>
            <div className="modal-footer"> {/* ส่วนท้ายของ modal */}
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> {/* ปุ่มปิด modal */}
              <button type="button" className="btn btn-primary" onClick={createStudent}> {/* ปุ่มสำหรับเพิ่มนักเรียน */}
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal สำหรับแก้ไขนักเรียน */}
      <div className="modal fade" id="editStudentModal" tabIndex="-1" role="dialog" aria-labelledby="editStudentModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header"> {/* หัวข้อของ modal */}
              <h5 className="modal-title" id="editStudentModalLabel">Edit Student</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"> {/* ปุ่มปิด modal */}
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body"> {/* เนื้อหาของ modal */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} // อัปเดต state ของฟอร์มเมื่อมีการเปลี่ยนแปลง
                className="form-control"
              />
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })} // อัปเดต state ของฟอร์มเมื่อมีการเปลี่ยนแปลง
                className="form-control"
              />
            </div>
            <div className="modal-footer"> {/* ส่วนท้ายของ modal */}
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> {/* ปุ่มปิด modal */}
              <button type="button" className="btn btn-primary" onClick={updateStudent}> {/* ปุ่มสำหรับอัปเดตนักเรียน */}
                Update Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; // ส่งออกคอมโพเนนต์ App
