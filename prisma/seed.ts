import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // CLEAR DATA
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.finance.deleteMany();

  // GRADE
  const gradeLevels = [1, 2, 3, 4, 5, 6];
  const createdGrades = [];
  for (const level of gradeLevels) {
    const grade = await prisma.grade.create({
      data: { level },
    });
    createdGrades.push(grade);
  }

  // CLASS
  const classNames = ["1A", "2A", "3A", "4A", "5A", "6A"];
  const createdClasses = [];
  for (let i = 0; i < classNames.length; i++) {
    const classItem = await prisma.class.create({
      data: { name: classNames[i], gradeId: createdGrades[i].id, capacity: 20 },
    });
    createdClasses.push(classItem);
  }

  // ADMIN
  await prisma.admin.create({
    data: { id: "admin1", username: "admin1" },
  });
  await prisma.admin.create({
    data: { id: "admin2", username: "admin2" },
  });

  // SUBJECT
  const subjectNames = [
    "Mathematics", "Science", "English", "History", "Geography",
    "Physics", "Chemistry", "Biology", "Computer Science", "Art"
  ];
  const createdSubjects = [];
  for (const name of subjectNames) {
    const subject = await prisma.subject.create({
      data: { name },
    });
    createdSubjects.push(subject);
  }

  // TEACHER
  const teachers = [
    { id: "teacher1", username: "sarah_jenkins", name: "Sarah", surname: "Jenkins", email: "sarah@school.com", phone: "1234567891", address: "123 Maple St", bloodType: "A+", sex: UserSex.FEMALE, birthday: new Date("1985-05-12") },
    { id: "teacher2", username: "michael_smith", name: "Michael", surname: "Smith", email: "michael@school.com", phone: "1234567892", address: "456 Oak Ave", bloodType: "O-", sex: UserSex.MALE, birthday: new Date("1980-11-23") },
    { id: "teacher3", username: "emily_clark", name: "Emily", surname: "Clark", email: "emily@school.com", phone: "1234567893", address: "789 Pine Ln", bloodType: "B+", sex: UserSex.FEMALE, birthday: new Date("1990-02-15") },
    { id: "teacher4", username: "david_brown", name: "David", surname: "Brown", email: "david@school.com", phone: "1234567894", address: "321 Cedar Rd", bloodType: "AB+", sex: UserSex.MALE, birthday: new Date("1988-08-30") },
    { id: "teacher5", username: "linda_white", name: "Linda", surname: "White", email: "linda@school.com", phone: "1234567895", address: "654 Birch Ct", bloodType: "A-", sex: UserSex.FEMALE, birthday: new Date("1982-04-05") },
  ];

  for (const teacher of teachers) {
    await prisma.teacher.create({
      data: {
        ...teacher,
        subjects: { connect: [{ id: createdSubjects[Math.floor(Math.random() * createdSubjects.length)].id }] },
        classes: { connect: [{ id: createdClasses[Math.floor(Math.random() * createdClasses.length)].id }] },
      },
    });
  }

  // PARENT
  const parents = [
    { id: "parent1", username: "robert_wilson", name: "Robert", surname: "Wilson", email: "robert@mail.com", phone: "9876543211", address: "111 Park Ave" },
    { id: "parent2", username: "jennifer_davis", name: "Jennifer", surname: "Davis", email: "jennifer@mail.com", phone: "9876543212", address: "222 Hill St" },
    { id: "parent3", username: "william_taylor", name: "William", surname: "Taylor", email: "william@mail.com", phone: "9876543213", address: "333 Lake Rd" },
    { id: "parent4", username: "elizabeth_moore", name: "Elizabeth", surname: "Moore", email: "elizabeth@mail.com", phone: "9876543214", address: "444 River Dr" },
    { id: "parent5", username: "james_miller", name: "James", surname: "Miller", email: "james@mail.com", phone: "9876543215", address: "555 Forest Ave" },
  ];

  for (const parent of parents) {
    await prisma.parent.create({ data: parent });
  }

  // STUDENT
  const students = [
    { id: "student1", username: "alice_wilson", name: "Alice", surname: "Wilson", email: "alice@school.com", phone: "1112223331", address: "111 Park Ave", bloodType: "O+", sex: UserSex.FEMALE, parentId: "parent1", gradeId: createdGrades[0].id, classId: createdClasses[0].id, birthday: new Date("2015-06-10") },
    { id: "student2", username: "bob_davis", name: "Bob", surname: "Davis", email: "bob@school.com", phone: "1112223332", address: "222 Hill St", bloodType: "A+", sex: UserSex.MALE, parentId: "parent2", gradeId: createdGrades[1].id, classId: createdClasses[1].id, birthday: new Date("2014-07-15") },
    { id: "student3", username: "charlie_taylor", name: "Charlie", surname: "Taylor", email: "charlie@school.com", phone: "1112223333", address: "333 Lake Rd", bloodType: "B-", sex: UserSex.MALE, parentId: "parent3", gradeId: createdGrades[2].id, classId: createdClasses[2].id, birthday: new Date("2013-08-20") },
    { id: "student4", username: "diana_moore", name: "Diana", surname: "Moore", email: "diana@school.com", phone: "1112223334", address: "444 River Dr", bloodType: "AB-", sex: UserSex.FEMALE, parentId: "parent4", gradeId: createdGrades[3].id, classId: createdClasses[3].id, birthday: new Date("2012-09-25") },
    { id: "student5", username: "ethan_miller", name: "Ethan", surname: "Miller", email: "ethan@school.com", phone: "1112223335", address: "555 Forest Ave", bloodType: "O-", sex: UserSex.MALE, parentId: "parent5", gradeId: createdGrades[4].id, classId: createdClasses[4].id, birthday: new Date("2011-10-30") },
  ];

  for (const student of students) {
    await prisma.student.create({ data: student });
  }

  // LESSON
  const days: Day[] = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY];
  for (const day of days) {
    for (let i = 1; i <= 6; i++) {
      await prisma.lesson.create({
        data: {
          name: `Lesson ${i}`,
          day: day,
          startTime: new Date(new Date().setHours(8 + i, 0, 0, 0)),
          endTime: new Date(new Date().setHours(9 + i, 0, 0, 0)),
          subjectId: createdSubjects[i % createdSubjects.length].id,
          classId: createdClasses[i % createdClasses.length].id,
          teacherId: `teacher${(i % 5) + 1}`,
        },
      });
    }
  }

  // FEE
  for (const student of students) {
    await prisma.fee.create({
      data: {
        amount: 50000, 
        amountPaid: 0,
        status: "PENDING",
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        description: "Term 1 School Fee",
        studentId: student.id,
        parentId: student.parentId,
      }
    });

    await prisma.fee.create({
      data: {
        amount: 20000,
        amountPaid: 10000,
        status: "PARTIAL",
        dueDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        description: "Transport Fee",
        studentId: student.id,
        parentId: student.parentId,
      }
    });
  }

  // ANNOUNCEMENT
  const announcements = [
    { title: "School Picnic", description: "The annual school picnic will be held on Friday at Central Park.", date: new Date(), classId: createdClasses[0].id },
    { title: "Parent-Teacher Meeting", description: "PTM for Grade 4 is scheduled for next Monday.", date: new Date(), classId: createdClasses[3].id },
    { title: "Science Fair", description: "All students are invited to participate in the Science Fair next month.", date: new Date() },
    { title: "Holiday Announcement", description: "School will be closed this Friday for a public holiday.", date: new Date() },
    { title: "Sports Day", description: "Preparations for the upcoming sports day begin this Tuesday.", date: new Date(), classId: createdClasses[1].id },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
  }

  // FINANCE
  const financeData = [
    { name: "Jan", income: 5000, expense: 2000, date: new Date("2024-01-01") },
    { name: "Feb", income: 4500, expense: 2500, date: new Date("2024-02-01") },
    { name: "Mar", income: 6000, expense: 3000, date: new Date("2024-03-01") },
    { name: "Apr", income: 5500, expense: 2200, date: new Date("2024-04-01") },
    { name: "May", income: 7000, expense: 3500, date: new Date("2024-05-01") },
    { name: "Jun", income: 6500, expense: 2800, date: new Date("2024-06-01") },
  ];

  for (const finance of financeData) {
    await prisma.finance.create({ data: finance });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
