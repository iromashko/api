describe("Bootcamp API", () => {
  const getItems = () =>
    cy
      .request("/api/v1/bootcamps")
      .its("body")
      .its("data");

  it("Server alive", () => {
    cy.request("/api/v1/bootcamps")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("List bootcamps", () => {
    getItems().should("have.length", 5);
  });

  it("List courses", () => {
    cy.request("/api/v1/courses")
      .its("body")
      .its("data")
      .should("have.length", 20);
  });

  it("Response have pagination", () => {
    cy.request("GET", "/api/v1/bootcamps")
      .its("body")
      .should("have.property", "pagination");
  });

  it("Response have counter", () => {
    cy.request("GET", "/api/v1/bootcamps")
      .its("body")
      .should("have.property", "count");
  });

  it("Bootcamps have properties", () => {
    getItems().each(value =>
      expect(value).to.have.all.keys(
        "location",
        "photo",
        "careers",
        "housing",
        "jobAssistance",
        "jobGuarantee",
        "acceptGi",
        "_id",
        "name",
        "description",
        "website",
        "phone",
        "email",
        "averageCost",
        "createdAt",
        "slug",
        "__v"
      )
    );
  });

  it("Create bootcamp", () => {
    const bootcamp = {
      name: "Test Cypress",
      _id: "1337842d5bf1fc6900a11fb3",
      description:
        "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
      website: "https://devworks.com",
      phone: "(111) 111-1111",
      email: "enroll@devworks.com",
      address: "233 Bay State Rd Boston MA 02215",
      careers: ["Web Development", "UI/UX", "Business"],
      housing: true,
      jobAssistance: true,
      jobGuarantee: false,
      acceptGi: true,
      averageCost: 13343
    };
    cy.request("POST", "/api/v1/bootcamps", bootcamp).then(response => {
      expect(response.body).to.have.property("success", true);
    });
  });

  it("Update bootcamp", () => {
    const bootcamp = {
      name: "Name Updated"
    };
    cy.request(
      "PUT",
      "/api/v1/bootcamps/1337842d5bf1fc6900a11fb3",
      bootcamp
    ).then(response => {
      expect(response.body).to.have.property("success", true);
    });
  });

  it("Delete bootcamp", () => {
    cy.request("DELETE", "/api/v1/bootcamps/1337842d5bf1fc6900a11fb3").then(
      response => {
        expect(response.body).to.have.property("success", true);
        expect(response.body).to.have.property("data", "bootcamp deleted");
      }
    );
  });

  it("Limit query", () => {
    cy.request("GET", "/api/v1/bootcamps?limit=3")
      .its("body")
      .its("data")
      .should("have.length", 3);
  });

  it("Select query", () => {
    cy.request("GET", "/api/v1/bootcamps?select=name,description")
      .its("body")
      .its("data")
      .should("have.length", 5)
      .each(value =>
        expect(value).to.have.all.keys("_id", "name", "description")
      );
  });
});
