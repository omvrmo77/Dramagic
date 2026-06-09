const STUDENTS = [
  { id: "stu-a-001", code: "DRG-A-001-X9K2", full_name: "Adam Youssef", classLetter: "A" },
  { id: "stu-a-002", code: "DRG-A-002-L4P7", full_name: "Lina Mostafa", classLetter: "A" },
  { id: "stu-a-003", code: "DRG-A-003-Q8M1", full_name: "Youssef Karim", classLetter: "A" },
  { id: "stu-a-004", code: "DRG-A-004-T6R3", full_name: "Malak Samir", classLetter: "A" },
  { id: "stu-a-005", code: "DRG-A-005-Z2B9", full_name: "Seif Tamer", classLetter: "A" },
  { id: "stu-a-006", code: "DRG-A-006-N5C8", full_name: "Nour Ahmed", classLetter: "A" },
  { id: "stu-b-001", code: "DRG-B-001-A7K5", full_name: "Mariam Ali", classLetter: "B" },
  { id: "stu-b-002", code: "DRG-B-002-P3D6", full_name: "Omar Hassan", classLetter: "B" },
  { id: "stu-b-003", code: "DRG-B-003-W9S4", full_name: "Hana Adel", classLetter: "B" },
  { id: "stu-b-004", code: "DRG-B-004-C2V8", full_name: "Yassin Hany", classLetter: "B" },
  { id: "stu-b-005", code: "DRG-B-005-M6Q1", full_name: "Jana Emad", classLetter: "B" },
  { id: "stu-b-006", code: "DRG-B-006-F5N2", full_name: "Ali Tarek", classLetter: "B" },
  { id: "stu-c-001", code: "DRG-C-001-R8Y6", full_name: "Nour Ahmed", classLetter: "C" },
  { id: "stu-c-002", code: "DRG-C-002-H4L9", full_name: "Malak Samir", classLetter: "C" },
  { id: "stu-c-003", code: "DRG-C-003-S7A1", full_name: "Kareem Omar", classLetter: "C" },
  { id: "stu-c-004", code: "DRG-C-004-D3T5", full_name: "Farida Wael", classLetter: "C" },
  { id: "stu-c-005", code: "DRG-C-005-J9P2", full_name: "Youssef Sameh", classLetter: "C" },
  { id: "stu-c-006", code: "DRG-C-006-G1X7", full_name: "Leila Amr", classLetter: "C" },
  { id: "stu-d-001", code: "DRG-D-001-K6U3", full_name: "Seif Tamer", classLetter: "D" },
  { id: "stu-d-002", code: "DRG-D-002-V2E8", full_name: "Salma Khaled", classLetter: "D" },
  { id: "stu-d-003", code: "DRG-D-003-B9R4", full_name: "Ziad Mostafa", classLetter: "D" },
  { id: "stu-d-004", code: "DRG-D-004-L1M7", full_name: "Kenzy Ahmed", classLetter: "D" },
  { id: "stu-d-005", code: "DRG-D-005-P8C2", full_name: "Amir Hossam", classLetter: "D" },
  { id: "stu-d-006", code: "DRG-D-006-X4Q9", full_name: "Laila Fares", classLetter: "D" }
];

const cardsGrid = document.getElementById("cardsGrid");

cardsGrid.innerHTML = STUDENTS.map((student) => `
  <article class="id-card">
    <div class="card-top">
      <div class="logo-row">
        <div class="logo-mark">D</div>
        <div>
          <strong>Dramagic</strong>
          <span>Attendance ID</span>
        </div>
      </div>
    </div>

    <div class="card-body">
      <img class="qr-img" src="assets/qr/${clean(student.code)}.png" alt="QR code for ${clean(student.full_name)}" />
      <div class="student-name">${clean(student.full_name)}</div>
      <div class="student-class">Class ${clean(student.classLetter)}</div>
      <div class="student-code">${clean(student.code)}</div>
    </div>
  </article>
`).join("");

function clean(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
