"use strict";
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var GradeValue;
(function (GradeValue) {
    GradeValue[GradeValue["Excellent"] = 5] = "Excellent";
    GradeValue[GradeValue["Good"] = 4] = "Good";
    GradeValue[GradeValue["Satisfactory"] = 3] = "Satisfactory";
    GradeValue[GradeValue["Unsatisfactory"] = 2] = "Unsatisfactory";
})(GradeValue || (GradeValue = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.nextStudentId = 1;
        this.nextCourseId = 1;
    }
    enrollStudent(student) {
        const newStudent = Object.assign({ id: this.nextStudentId++ }, student);
        this.students.push(newStudent);
        return newStudent;
    }
    createCourse(course) {
        const newCourse = Object.assign({ id: this.nextCourseId++, enrolledStudents: [] }, course);
        this.courses.push(newCourse);
        return newCourse;
    }
    registerForCourse(studentId, courseId) {
        console.log("Ищем курс с ID:", courseId);
        console.log("Список доступных курсов:", this.courses);
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) {
            throw new Error("Course not found.");
        }
        if (course.enrolledStudents.includes(studentId)) {
            throw new Error("Student is already registered for this course.");
        }
        if (course.enrolledStudents.length >= course.maxStudents) {
            throw new Error("Course is already full.");
        }
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            throw new Error("Student not found.");
        }
        if (student.faculty !== course.faculty) {
            throw new Error("Student cannot register for a course from a different faculty.");
        }
        course.enrolledStudents.push(studentId);
    }
    setGrade(studentId, courseId, grade) {
        const course = this.courses.find((c) => c.id === courseId);
        if (!course || !course.enrolledStudents.includes(studentId)) {
            throw new Error("Student is not registered for this course.");
        }
        const newGrade = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        this.grades.push(newGrade);
    }
    getStudentsByFaculty(faculty) {
        return this.students.filter((student) => student.faculty === faculty);
    }
    getStudentGrades(studentId) {
        return this.grades.filter((grade) => grade.studentId === studentId);
    }
    getAvailableCourses(faculty, semester) {
        return this.courses.filter((course) => course.faculty === faculty && course.semester === semester);
    }
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const total = studentGrades.reduce((sum, grade) => sum + grade.grade, 0);
        return total / studentGrades.length;
    }
}
// Пример использования:
const ums = new UniversityManagementSystem();
// Создаем студента
const student = ums.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Law,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "L-202"
});
// Создаем курс
const course = ums.createCourse({
    name: "Constitutional Law",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Law,
    maxStudents: 30
});
// Регистрируем студента на курс
ums.registerForCourse(student.id, course.id);
// Выставляем оценку
ums.setGrade(student.id, course.id, GradeValue.Excellent);
// Выводим информацию
console.log("Список студентов на факультете права:", ums.getStudentsByFaculty(Faculty.Law));
console.log("Оценки студента:", ums.getStudentGrades(student.id));
console.log("Средний балл студента:", ums.calculateAverageGrade(student.id));
