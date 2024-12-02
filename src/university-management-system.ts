enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
    enrolledStudents: number[];
}

interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeValue;
    date: Date;
    semester: Semester;
}

class UniversityManagementSystem {
    students: Student[] = [];
    courses: Course[] = [];
    grades: Grade[] = [];
    private nextStudentId = 1;
    private nextCourseId = 1;

    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = { id: this.nextStudentId++, ...student };
        this.students.push(newStudent);
        return newStudent;
    }

    createCourse(course: Omit<Course, "id" | "enrolledStudents">): Course {
        const newCourse: Course = { id: this.nextCourseId++, enrolledStudents: [], ...course };
        this.courses.push(newCourse);
        return newCourse;
    }

    registerForCourse(studentId: number, courseId: number): void {
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

    setGrade(studentId: number, courseId: number, grade: GradeValue): void {
        const course = this.courses.find((c) => c.id === courseId);
        if (!course || !course.enrolledStudents.includes(studentId)) {
            throw new Error("Student is not registered for this course.");
        }

        const newGrade: Grade = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        this.grades.push(newGrade);
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((student) => student.faculty === faculty);
    }

    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter((grade) => grade.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter((course) => course.faculty === faculty && course.semester === semester);
    }

    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return 0;
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
