import { PrismaClient, Role, LeadStatus, ApplicationStatus, DocumentStatus, AppointmentStatus, EventType, ContactStatus, ContactType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.contactSubmission.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.leadFollowup.deleteMany({});
  await prisma.leadNote.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.university.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create standard users
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const consultantPasswordHash = await bcrypt.hash('Consultant@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'saksham@educonsultpro.com',
      passwordHash: adminPasswordHash,
      firstName: 'Saksham',
      lastName: 'Prasai',
      role: Role.ADMIN,
      phone: '+977 9802481462',
    },
  });

  const consultant = await prisma.user.create({
    data: {
      email: 'consultant@educonsultpro.com',
      passwordHash: consultantPasswordHash,
      firstName: 'Arthur',
      lastName: 'Pendleton',
      role: Role.CONSULTANT,
      phone: '+15550101',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@educonsultpro.com',
      passwordHash: studentPasswordHash,
      firstName: 'Aaryan',
      lastName: 'Sharma',
      role: Role.STUDENT,
      phone: '+977 9812345678',
    },
  });

  // Create student profile
  await prisma.profile.create({
    data: {
      userId: studentUser.id,
      dateOfBirth: new Date('2003-05-15'),
      gender: 'Male',
      address: 'Koteshwor, Kathmandu, Nepal',
      passportNumber: 'NP1234567',
      currentQualification: 'Plus Two (GPA 3.6)',
      preferredCountry: 'Canada',
      preferredSubject: 'Computer Science',
      testType: 'IELTS',
      testScore: '7.5',
      visaStatus: 'Not Applied',
    },
  });

  console.log('Users seeded.');

  // 3. Create Countries
  const canada = await prisma.country.create({
    data: {
      name: 'Canada',
      slug: 'canada',
      description: 'Canada is globally recognized for its high academic standards, diverse communities, and post-study work opportunities.',
      requirements: 'Academic transcripts, proof of language proficiency (IELTS 6.5+ or equivalent), Statement of Purpose, and letters of recommendation.',
      visas: 'Study Permit (IRCC validation). Requires a Letter of Acceptance (LOA), proof of financial support (GIC of $20,635 CAD + tuition fee), and medical clearance.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const australia = await prisma.country.create({
    data: {
      name: 'Australia',
      slug: 'australia',
      description: 'Australia offers world-class education, vibrant city life, and excellent post-study work streams under the subclass 500 visa.',
      requirements: 'Academic qualifications, English score (IELTS 6.0+), Genuine Student (GS) statement, and Overseas Student Health Cover (OSHC).',
      visas: 'Student Visa (Subclass 500). Requires Confirmation of Enrolment (CoE), proof of financial capacity ($24,505 AUD/year), and OSHC.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1523482596682-cd93a6e54520?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const uk = await prisma.country.create({
    data: {
      name: 'United Kingdom',
      slug: 'united-kingdom',
      description: 'Home to historic academic institutions, the UK provides intensive, world-renowned degrees and a 2-year Graduate Route visa.',
      requirements: 'Academic certificates, IELTS Academic (6.0+), Reference letters, and personal statement.',
      visas: 'Student Visa (formerly Tier 4). Requires Confirmation of Acceptance for Studies (CAS), proof of financial resources (£1,334/month in London), and healthcare surcharge (IHS).',
      featured: true,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const usa = await prisma.country.create({
    data: {
      name: 'United States',
      slug: 'united-states',
      description: 'The USA offers the most diverse research universities and campus experiences, with OPT opportunities for STEM graduates.',
      requirements: 'Transcripts, Standardized tests (SAT/ACT/GRE/GMAT), English proficiency, Recommendation letters, and financial affidavits.',
      visas: 'F-1 Student Visa. Requires Form I-20 issued by an approved SEVP institution, SEVIS fee payment, and an embassy visa interview.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
    },
  });

  // Additional countries
  await prisma.country.create({
    data: {
      name: 'Germany',
      slug: 'germany',
      description: 'Germany is a hub of engineering excellence offering low or zero tuition fees at public universities.',
      requirements: 'Abitur equivalent qualification, German language proficiency (for German-taught programs) or English test, and Blocked Account.',
      visas: 'National Student Visa. Requires a Blocked Account (Sperrkonto) with at least €11,208 per year, admission letter, and health insurance.',
      featured: false,
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    },
  });

  console.log('Countries seeded.');

  // 4. Create Universities
  const uToronto = await prisma.university.create({
    data: {
      name: 'University of Toronto',
      slug: 'university-of-toronto',
      description: 'Ranked among the top universities globally, U of T is Canada’s leading research institution, offering diverse courses in Toronto, Ontario.',
      countryId: canada.id,
      website: 'https://www.utoronto.ca',
      ranking: 21,
      courses: ['Computer Science', 'Engineering', 'MBA', 'Medicine'],
      requirements: 'GPA 3.7+ (85%+), IELTS 7.0 (no band less than 6.5) or TOEFL 100+.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    },
  });

  const uMelb = await prisma.university.create({
    data: {
      name: 'University of Melbourne',
      slug: 'university-of-melbourne',
      description: 'Australia’s top research university located in the cultural capital of Melbourne, known for its high-impact research output.',
      countryId: australia.id,
      website: 'https://www.unimelb.edu.au',
      ranking: 14,
      courses: ['Information Technology', 'Civil Engineering', 'Finance', 'Law'],
      requirements: 'First-class honours degree or GPA 3.3+, IELTS 6.5 (no band less than 6.0).',
      featured: true,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    },
  });

  await prisma.university.create({
    data: {
      name: 'University of Oxford',
      slug: 'university-of-oxford',
      description: 'The oldest university in the English-speaking world, offering world-class collegiate tutorials and rich academic tradition.',
      countryId: uk.id,
      website: 'https://www.ox.ac.uk',
      ranking: 3,
      courses: ['Philosophy', 'Computer Science', 'Economics', 'Biosciences'],
      requirements: 'A*A*A* at A-levels, GPA 3.9+, IELTS 7.5 (no band less than 7.0) and competitive admissions test.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    },
  });

  await prisma.university.create({
    data: {
      name: 'Massachusetts Institute of Technology (MIT)',
      slug: 'mit',
      description: 'Located in Cambridge, Massachusetts, MIT is a world leader in scientific and technological research and education.',
      countryId: usa.id,
      website: 'https://www.mit.edu',
      ranking: 1,
      courses: ['Computer Science & AI', 'Mechanical Engineering', 'Physics', 'Finance'],
      requirements: 'Near-perfect academic scores, SAT/ACT, IELTS 7.5+ or TOEFL 105+, and exceptional portfolio/accomplishments.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1622397333309-3056849bc70b?auto=format&fit=crop&w=600&q=80',
    },
  });

  console.log('Universities seeded.');

  // 5. Create Applications
  await prisma.application.create({
    data: {
      studentId: studentUser.id,
      universityId: uToronto.id,
      program: 'M.S. in Computer Science',
      status: ApplicationStatus.DOCUMENT_SUBMITTED,
      notes: 'Initial documents (IELTS and Undergrad Transcripts) verified. Awaiting official evaluation.',
    },
  });

  await prisma.application.create({
    data: {
      studentId: studentUser.id,
      universityId: uMelb.id,
      program: 'Master of Information Technology',
      status: ApplicationStatus.PENDING,
      notes: 'Application registered. Awaiting upload of statement of purpose (SOP).',
    },
  });

  // 6. Create Documents
  await prisma.document.create({
    data: {
      studentId: studentUser.id,
      name: 'Aaryan_Sharma_Transcript.pdf',
      type: 'Academic Transcript',
      url: '/uploads/documents/sample_transcript.pdf',
      publicId: 'mock_sample_transcript',
      status: DocumentStatus.VERIFIED,
      remarks: 'All high school transcripts verified against source records.',
    },
  });

  await prisma.document.create({
    data: {
      studentId: studentUser.id,
      name: 'Aaryan_Sharma_IELTS.pdf',
      type: 'English Language Test Results',
      url: '/uploads/documents/sample_ielts.pdf',
      publicId: 'mock_sample_ielts',
      status: DocumentStatus.VERIFIED,
      remarks: 'IELTS score of 7.5 confirmed.',
    },
  });

  await prisma.document.create({
    data: {
      studentId: studentUser.id,
      name: 'Aaryan_Sharma_SOP.pdf',
      type: 'Statement of Purpose',
      url: '/uploads/documents/sample_sop.pdf',
      publicId: 'mock_sample_sop',
      status: DocumentStatus.PENDING,
      remarks: 'Under review by counselor Saksham.',
    },
  });
// 7. Create Appointments
  await prisma.appointment.create({
    data: {
      studentId: studentUser.id,
      consultantId: consultant.id,
      title: 'Study Abroad Orientation',
      description: 'Orientation session to discuss timelines and list of target universities in Canada and Australia.',
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 30,
      status: AppointmentStatus.SCHEDULED,
      meetLink: 'https://meet.google.com/abc-defg-hij',
    },
  });

  await prisma.appointment.create({
    data: {
      studentId: studentUser.id,
      consultantId: consultant.id,
      title: 'Visa Documentation Review',
      description: 'Comprehensive review of financial statements and study permit checklist.',
      dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      duration: 45,
      status: AppointmentStatus.COMPLETED,
      meetLink: 'https://meet.google.com/xyz-qprs-tuv',
    },
  });

  // 8. Create CRM Leads
  const lead1 = await prisma.lead.create({
    data: {
      firstName: 'Samantha',
      lastName: 'Miller',
      email: 'samantha.miller@example.com',
      phone: '+15550999',
      status: LeadStatus.NEW,
      source: 'WEBSITE',
      interestedCountry: 'United Kingdom',
      interestedService: 'University Admission Assistance',
      assignedToId: consultant.id,
    },
  });

  await prisma.leadNote.create({
    data: {
      leadId: lead1.id,
      content: 'Inquired through the contact form regarding Masters programs in Finance at UK universities. Seems highly motivated.',
      createdById: admin.id,
    },
  });

  await prisma.leadFollowup.create({
    data: {
      leadId: lead1.id,
      title: 'Call Samantha to verify qualifications',
      description: 'Discuss Bachelor GPA, target budget, and check if she has taken IELTS.',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      completed: false,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      firstName: 'Derrick',
      lastName: 'Choi',
      email: 'derrick.choi@example.com',
      phone: '+15550888',
      status: LeadStatus.CONTACTED,
      source: 'CAMPAIGN',
      interestedCountry: 'United States',
      interestedService: 'Student Visa Consulting',
      assignedToId: consultant.id,
    },
  });

  await prisma.leadNote.create({
    data: {
      leadId: lead2.id,
      content: 'Contacted Derrick on June 10. He is interested in STEM programs in the USA. Needs guidance on F-1 visa funds requirement.',
      createdById: consultant.id,
    },
  });

  console.log('CRM Leads seeded.');

  // 9. Create Scholarships
  await prisma.scholarship.create({
    data: {
      title: 'Lester B. Pearson International Scholarship',
      slug: 'lester-b-pearson-scholarship',
      description: 'The Lester B. Pearson International Scholarship Program at the University of Toronto provides an exceptional opportunity for outstanding international students to study at one of the world’s best universities.',
      amount: 'Full Tuition, Books, Incidental Fees, & Residence Support (4 years)',
      deadline: new Date('2026-11-30'),
      eligibility: 'Exceptional academic achievement, creative thinking, and demonstration of school leadership. Nominated by secondary school.',
      countryId: canada.id,
      universityId: uToronto.id,
      active: true,
    },
  });

  await prisma.scholarship.create({
    data: {
      title: 'Melbourne International Undergraduate Scholarship',
      slug: 'melbourne-undergrad-scholarship',
      description: 'Awarded to high-achieving international students in recognition of their excellent academic results.',
      amount: '$10,000 tuition fee remission or 50% / 100% fee remission',
      deadline: new Date('2026-12-15'),
      eligibility: 'International student, enrolled in an undergraduate degree at University of Melbourne, top academic scores.',
      countryId: australia.id,
      universityId: uMelb.id,
      active: true,
    },
  });

  // 10. Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: 'How to Write a Winning Statement of Purpose (SOP)',
      slug: 'how-to-write-winning-sop',
      excerpt: 'Learn the key strategies, paragraph structures, and mistakes to avoid when drafting your SOP for university admissions.',
      content: '<h2>Introduction</h2><p>Your Statement of Purpose is your primary tool to stand out among thousands of applicants. In this article, we outline the exact 5-paragraph model that top universities expect...</p><h3>1. The Hook</h3><p>Start with a powerful narrative about why you chose your field...</p>',
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      category: 'University Admissions',
      tags: ['SOP', 'Admissions Tips', 'College Essay'],
      published: true,
      featured: true,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Understanding the Canada Study Permit GIC Requirements',
      slug: 'canada-study-permit-gic-requirements',
      excerpt: 'Everything you need to know about the Guaranteed Investment Certificate (GIC) doubling to $20,635 CAD.',
      content: '<p>Effective recently, Immigration, Refugees and Citizenship Canada (IRCC) updated the cost-of-living financial requirement for study permit applications. The new rate stands at $20,635 CAD...</p>',
      coverImage: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
      category: 'Visa Regulations',
      tags: ['Canada', 'GIC', 'Visa Updates', 'Finance'],
      published: true,
      featured: false,
    },
  });

  // 11. Create Events
  await prisma.event.create({
    data: {
      title: 'Global University Admission Virtual Fair',
      slug: 'global-university-admission-virtual-fair',
      description: 'Connect directly with admissions representatives from top universities in Canada, Australia, and the UK. Gain insights into intake requirements and scholarship eligibility.',
      dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      location: 'Zoom Conference Link (Emailed upon registration)',
      type: EventType.ONLINE,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      capacity: 300,
    },
  });

  await prisma.event.create({
    data: {
      title: 'USA Student Visa Prep Seminar',
      slug: 'usa-student-visa-prep-seminar',
      description: 'Physical workshop covering standard F-1 visa interview questions, DS-160 forms, and financial sponsorship audits.',
      dateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      location: 'Main Auditorium, EduConsult Tower, Level 4',
      type: EventType.IN_PERSON,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      capacity: 50,
    },
  });

  // 12. Create Notifications
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      title: 'Document Approved',
      message: 'Your high school transcripts have been verified and approved.',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      title: 'Appointment Confirmed',
      message: 'Your study abroad orientation call with Arthur Pendleton is scheduled for 10:00 AM.',
      read: true,
    },
  });

  // 13. Create Sample Contact Submissions
  await prisma.contactSubmission.create({
    data: {
      name: 'Ryan Higgins',
      email: 'ryan.higgins@example.com',
      phone: '+15550444',
      subject: 'Inquiry about German language pathways',
      message: 'Hello, I want to pursue MS in Mechanical Engineering in Germany. Do you offer support for German language exams and blocked accounts?',
      status: ContactStatus.NEW,
      type: ContactType.GENERAL,
    },
  });

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
