const faker = require("faker");
const Bootcamp = require("../model/bootcamp");
const Course = require("../model/course");

function getCareers() {
  const careers = [
    "Web Development",
    "Mobile Development",
    "UI/UX",
    "Data Science",
    "Business",
    "Other"
  ];
  const numCareers = Math.floor(Math.random() * 2) + 1;
  const result = [];

  for (let i = 1; i <= numCareers; i++) {
    const newCareer = careers[Math.floor(Math.random() * 6)];
    if (!result.includes(newCareer)) {
      result.push(newCareer);
    }
  }
  return result;
}

const seedDB = async () => {
  await Bootcamp.deleteMany();

  for (const i of new Array(20)) {
    const bootcamp = {
      name: faker.commerce.productName(),
      description: faker.company.catchPhraseDescriptor(),
      website: faker.internet.url(),
      phone: faker.phone.phoneNumberFormat(2),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      housing: faker.random.boolean(),
      jobAssistance: faker.random.boolean(),
      jobGuarantee: faker.random.boolean(),
      acceptGi: faker.random.boolean(),
      averageCost: faker.random.number(),
      photo: faker.image.image(),
      careers: getCareers()
    };

    await Bootcamp.create(bootcamp);
  }

  console.log(`bootcamps seeded`);
  //////////////////////
  await Course.deleteMany();

  for (const i of new Array(20)) {
    const course = {
      title: faker.commerce.productName(),
      description: faker.company.catchPhraseDescriptor(),
      tuition: faker.random.number(),
      weeks: faker.random.number(),
      minimumSkill: "beginner",
      scholarshipsAvailable: faker.random.boolean(),
      bootcamp: await Bootcamp.findOne().skip(Math.floor(Math.random * 20))
    };

    await Course.create(course);
  }

  console.log(`courses seeded`);
};

module.exports = seedDB;
