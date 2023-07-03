const express = require("express");
const createMongoClient = require("../foodapp-backend/shared/mongo");
const app = express();
const PORT = 7071;
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const Excel = require("exceljs");
app.use(express.json());
app.use(cors());
app.get("/api/apiGetLunch", async (req, res) => {
  const { db } = await createMongoClient();
  const findBy = req.query;
  console.log("findBy : ", findBy);
  const users = await db.collection("lunch").find(findBy).toArray();
  users.sort((a, b) => {
    let fa = a.bcdid;
    let fb = b.bcdid;
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  console.log(users);
  res.send(users);
});
app.get("/api/apiGetUser", async (req, res) => {
  const { db } = await createMongoClient();
  const users = await db.collection("BCDusers").find().toArray();
  res.send(users);
});
app.get("/api/apiGetUserDetails", async (req, res) => {
  const { db } = await createMongoClient();
  const findBy = req.query;
  const users = await db.collection("BCDusers").find(findBy).toArray();
  res.send(users);
});
app.post("/api/apiSaveLunch", async (req, res) => {
  const user = req.body;
  const userWithId = { ...user, id: uuidv4() };
  const { db } = await createMongoClient();
  db.collection("lunch").insertOne(userWithId);
  res.send(user);
});
app.get("/api/apiGetUserLunch", async (req, res) => {
  const { db } = await createMongoClient();
  const findBy = req.query;
  const users = await db.collection("lunch").find(findBy).toArray();
  res.send(users);
});
app.post("/api/apiSendEmail", async (req, res) => {
  const filename = "Users.xlsx";
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet("Users");
  worksheet.columns = [
    { header: "Name", key: "name" },
    { header: "Booking Date", key: "date" },
    { header: "BCDID", key: "bcdid" },
    { header: "Booking Day", key: "day" },
  ];
  let data = req.body;
  data.forEach((e) => {
    worksheet.addRow(e);
  });
  const buffer = await workbook.xlsx.writeBuffer();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: "abhigyanmajumder07@gmail.com",
      pass: "zjizyrhczidnbaxy",
    },
  });
  let info = await transporter.sendMail({
    from: '"ABHIGYAN MAJUMDER" abhigyanmajumder07@gmail.com',
    to: [
      "abhigyan.majumder@blucocoondigital.com",
      "jaya.kar@blucocoondigital.com",
      "rishita.mukherjee@blucocoondigital.com",
    ],
    subject: "Registration for lunch",
    html: `Please click this email to confirm the email:`,
    attachments: [
      {
        filename,
        content: buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });
});
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
