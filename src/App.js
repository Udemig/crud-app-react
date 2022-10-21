import React, { useEffect, useState } from "react";

import axios from "axios";

import EditStudentModal from "./components/EditStudentModal";
//crud - create, read, update, delete

function App() {
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stdNumber, setStdNumber] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [stdClass, setStdClass] = useState("");
  const [didUpdate, setDidUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    id: "",
    studentNumber: "",
    name: "",
    surname: "",
    class: "",
  });

  useEffect(() => {
    //Read
    axios
      .get("http://localhost:3004/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [didUpdate]);

  //CREATE
  const handleAdd = (event) => {
    event.preventDefault();
    if (stdNumber === "" || name === "" || surname === "" || stdClass === "") {
      alert("Bütün alanlar zorunludur!");
      return;
    }
    const hasStudent = students.find(
      (item) => item.studentNumber === stdNumber
    );
    if (hasStudent !== undefined) {
      alert("Bu numarada öğrenci zaten kayıtlıdır.");
      return;
    }
    const newStudent = {
      id: String(new Date().getTime()),
      studentNumber: stdNumber,
      name: name,
      surname: surname,
      class: stdClass,
    };
    axios
      .post("http://localhost:3004/students", newStudent)
      .then((response) => {
        setStudents([...students, newStudent]);
        setShowAddForm(false);
        setName("");
        setStdClass("");
        setStdNumber("");
        setSurname("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //DELETE
  const handleDelete = (studentId) => {
    axios
      .delete(`http://localhost:3004/students/${studentId}`)
      .then((response) => {
        setDidUpdate(!didUpdate);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //erken kaçış
  if (students === null) {
    return <h1>Loading...</h1>;
  }

  var filteredStudents = [];
  filteredStudents = students.filter((item) => {
    if (
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.surname.toLowerCase().includes(searchText.toLowerCase())
    )
      return true;
  });

  return (
    <div>
      <nav className="navbar navbar-light bg-primary navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            CRUD APP
          </a>
        </div>
      </nav>
      <div className="container my-5">
        <div className="d-flex justify-content-between">
          <input
            type="text"
            className="form-control w-75"
            placeholder="Type to search..."
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          />
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
            }}
            className="btn btn-primary">
            Öğrenci Ekle
          </button>
        </div>
        {showAddForm === true && (
          <form onSubmit={handleAdd} className="w-50 mx-auto">
            <div className="mb-3">
              <label for="stdNum" class="form-label">
                Öğrenci Numarası
              </label>
              <input
                value={stdNumber}
                onChange={(event) => setStdNumber(event.target.value)}
                type="text"
                id="stdNum"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label for="name" class="form-label">
                Adı
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                id="name"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label for="surname" class="form-label">
                Soyadı
              </label>
              <input
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
                type="text"
                id="surname"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label for="class" class="form-label">
                Sınıfı
              </label>
              <input
                value={stdClass}
                onChange={(event) => setStdClass(event.target.value)}
                type="text"
                id="class"
                className="form-control"
              />
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-outline-primary" type="submit">
                Kaydet
              </button>
            </div>
          </form>
        )}
        <table class="table">
          <thead>
            <tr>
              <th scope="col">ÖğrenciNo</th>
              <th scope="col">Adı</th>
              <th scope="col">Soyadı</th>
              <th scope="col">Sınıfı</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.studentNumber}</td>
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.class}</td>
                <td>
                  <button
                    onClick={() => {
                      handleDelete(student.id);
                    }}
                    className="btn btn-sm btn-danger">
                    Sil
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setSelectedStudent(student);
                    }}
                    className="btn btn-sm btn-secondary">
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <EditStudentModal
          didUpdate={didUpdate}
          setDidUpdate={setDidUpdate}
          students={students}
          selectedStudent={selectedStudent}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}

export default App;
