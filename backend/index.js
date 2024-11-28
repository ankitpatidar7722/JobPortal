const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const salt = 10;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "JobPortal",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});

app.post("/postdata-user", upload.single("profilePhoto"), (req, res) => {
  // Generate salt for password hashing
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.json({ Error: "Internal server error" });
    }

    // Prepare SQL query
    const sql =
      "INSERT INTO JobSeeker (JsFName, JsLName, JsEmail, AdharId, DOB, Phone, Gen, Resume, JsExpYear, pwd, ProfilePhoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.adhar,
      req.body.dob,
      req.body.phone,
      req.body.gender,
      req.body.url, // Assuming URL for resume
      req.body.experience,
      hash, // Storing hashed password in the database
      req.file.buffer, // Profile photo as BLOB data
    ];
    // Execute SQL query
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.json({ Error: "Internal server error" });
      }
      const token = jwt.sign({ id: result.insertId, type: "user" }, "key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      res.json({ Status: "Success", token });
    });
  });
});

app.post("/postdata-hr", upload.single("logo"), (req, res) => {
  // console.log("File:", req.file); // Check if the file is received
  // console.log("Body:", req.body);
  if (!req.file) return res.json({ Error: "No file uploaded" });

  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });

    // const adminId = Math.floor(Math.random() * 5) + 1;
    const adminId = 1;
    const sql =
      "INSERT INTO hr (HrName, HrEmail, HrPwd, AdharId, CompName, CompAdd, CompPhone, CompWeb, CompanyLogo, AdminId,isVerify) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.adhar,
      req.body.CompName,
      req.body.CompAdd,
      req.body.CompPhone,
      req.body.web,
      req.file.buffer,
      adminId,
      0,
    ];

    db.query(sql, values, (error, response) => {
      if (error) {
        console.error(error);
        return res.json({ Error: "Inserting error in server" });
      }
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login-user", (req, res) => {
  const sql = "SELECT * FROM jobseeker where JsEmail=?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].pwd,
        (err, response) => {
          if (err)
            return res.json({ Error: "Password compare error in server" });
          if (response) {
            const id = data[0].JsId;
            const token = jwt.sign({ id, type: "user" }, "key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            const profilePhoto = generateImageUrl(data[0].ProfilePhoto);

            data[0].ProfilePhoto = profilePhoto;
            return res.json({ Status: "Success", token, info: data[0] });
          } else {
            return res.json({ Error: "Password not correct" });
          }
        }
      );
    } else {
      return res.json({ Error: "Email not exist" });
    }
  });
});

app.post("/login-hr", (req, res) => {
  // console.log(req.body);
  const sql = "SELECT * from hr where HrEmail=?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Error in server " });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].HrPwd,
        (err, resposne) => {
          if (err) return res.json({ Error: "Error in password compare" });
          if (resposne) {
            const id = data[0].HrID;
            const token = jwt.sign({ id, type: "hr" }, "key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            // const companyLogoBuffer = data[0].companyLogo;
            // const base64Data = companyLogoBuffer.toString("base64");
            // const dataUrl = `data:image/png;base64,${base64Data}`;
            return res.json({
              Status: "Success",
              token,
              info: data[0],
            });
          } else {
            return res.json({ Error: "wrong password" });
          }
        }
      );
    } else {
      return res.json({ Error: "Email not exist" });
    }
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ Error: "You are not authenticated" });
  else {
    jwt.verify(token, "key", (err, decoded) => {
      if (err) return res.json({ Error: "Token is not correct" });
      else {
        req.id = decoded.id;
        req.a = decoded.type;
        next();
      }
    });
  }
};

app.get("/get-user-image", verifyUser, (req, res) => {
  const id = req.id;
  const sql = "select ProfilePhoto from jobseeker where JsId=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching user image:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0 || !result[0].ProfilePhoto) {
      return res.status(404).json({ error: "User image not found" });
    }

    try {
      const image = generateImageUrl(result[0].ProfilePhoto);

      res.json({ Status: "done", imageUrl: image });
    } catch (error) {
      console.error("Error generating image URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

function generateImageUrl(buffer) {
  const base64Data = Buffer.from(buffer, "binary").toString("base64");
  return `data:image/png;base64,${base64Data}`;
}

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", type: req.a });
});

app.get("/get-userdata", verifyUser, (req, res) => {
  const id = req.id;
  const sql = "select * from jobseeker where JsId=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.json({ Status: "Success", info: result[0] });
  });
});

app.post("/job-post", verifyUser, (req, res) => {
  const id = req.id;
  const date = new Date().toISOString().split("T")[0];
  const sql =
    "INSERT INTO job (JobTitle, JobDescr,JobExperience,MiniEducat,City,Role,Salary,JobType,PostDate,HrId,workLocation,lastDate) values(?,?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
    req.body.jobTitle,
    req.body.jobDescription,
    req.body.experience,
    req.body.minimumEducation,
    req.body.city,
    req.body.role,
    req.body.salary,
    req.body.jobType,
    date,
    id,
    req.body.workLocation,
    req.body.lastDate,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Error in inserting data" });
    }
    return res.json({ Status: "Success" });
  });
});

app.get("/hr-total-post-job", verifyUser, (req, res) => {
  const id = req.id;
  const sql =
    "select j.* ,COUNT(ja.JobId) as application from job j left join jobapplication ja on j.JobId=ja.JobId where j.HrID= ? group by j.JobId";
  db.query(sql, [id], (err, data) => {
    if (err) console.log(err);
    return res.json({ Status: "Success", jobs: data });
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.post("/update-hr-profile", verifyUser, (req, res) => {
  const id = req.id;
  const sql =
    "update hr set HrName=? ,HrEmail=?,CompADD=?,CompPhone=?,CompName=? where HrID=?";
  db.query(
    sql,
    [
      req.body.name,
      req.body.email,
      req.body.address,
      req.body.phone,
      req.body.company,
      id,
    ],
    (err, response) => {
      if (err) throw err;
      return res.json({ Status: "Success", response });
    }
  );
});

app.post("/updateJob", verifyUser, (req, res) => {
  const id = req.id;
  const date = new Date().toISOString().split("T")[0];
  const sql =
    "update job set JobTitle=? ,JobDescr=?,JobExperience=?, MiniEducat=?,City=?,Role=?,Salary=?,JobType=?,PostDate=?,workLocation=? ,LastDate=? WHERE JobId = ? and HrID=?";
  const values = [
    req.body.JobTitle,
    req.body.JobDescr,
    req.body.JobExperience,
    req.body.MiniEducat,
    req.body.City,
    req.body.Role,
    req.body.Salary,
    req.body.JobType,
    date,
    req.body.workLocation,
    req.body.lastDate,
    req.body.JobId,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "not updated job" });
    return res.json({ Status: "Success" });
  });
});

app.get("/AllApplicant/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "select jobseeker.* from jobseeker join jobapplication on jobseeker.JsId=jobapplication.JsId where jobapplication.JobId=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ Status: "Success", applicant: result });
  });
});

app.post(
  "/postdata-education-user",
  verifyUser,
  upload.single("DegreeFile"),
  (req, res) => {
    const id = req.id;
    // console.log("hello", id);
    const sql =
      "insert into education (JsId,DegreeName, InstituteName,StartDate,CompletionDate,DegreeFile,Percentage) values (?,?,?,?,?,?,?)";
    const values = [
      id,
      req.body.DegreeName,
      req.body.InstituteName,
      req.body.StartDate,
      req.body.CompletionDate,
      req.file.buffer,
      req.body.Percentage,
    ];
    db.query(sql, values, (err, result) => {
      if (err) throw err;
      return res.json({ Status: "Success" });
    });
  }
);

app.post("/postdata-experience-user", verifyUser, (req, res) => {
  const id = req.id;
  const sql =
    "insert into experience (JsId, StartDate,EndDate,JobTitle,CompanyName,Description) values (?,?,?,?,?,?)";
  const values = [
    id,
    req.body.startDate,
    req.body.endDate,
    req.body.jobTitle,
    req.body.companyName,
    req.body.description,
  ];
  db.query(sql, values, (err, result) => {
    if (err) throw err;
    return res.json({ Status: "Success" });
  });
});

app.post("/admin-register", (req, res) => {
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) throw err;
    const sql = "INSERT INTO admin(adminName,AdminUserName,pwd) values(?,?,?)";
    const values = [req.body.name, req.body.email, hash];
    db.query(sql, values, (err, result) => {
      if (err) throw err;
      return res.json({ Status: "Success" });
    });
  });
});

app.get("/educationDetails", verifyUser, (req, res) => {
  const id = req.id;
  const sql = "select * from education where JsId=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.json({ Status: "Success", education: result });
  });
});
app.get("/experienceDetails", verifyUser, (req, res) => {
  const id = req.id;
  const sql = "select * from experience where JsId=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.json({ Status: "Success", experience: result });
  });
});

app.post("/update-education", (req, res) => {
  const sql = `UPDATE education SET DegreeName = ?, InstituteName = ?, StartDate = ?,  CompletionDate = ?, Percentage = ? WHERE EduId = ?`;
  const value = [
    req.body.degreeName,
    req.body.instituteName,
    req.body.startDate,
    req.body.completionDate,
    req.body.percentage,
    req.body.id,
  ];
  db.query(sql, value, (err, result) => {
    if (err) {
      console.error("Error updating education:", err);
      return res
        .status(500)
        .json({ Status: "Error", Message: "Failed to update education" });
    }
    return res.json({ Status: "Success" });
  });
});

app.post("/update-experience", (req, res) => {
  const sql = `UPDATE experience SET CompanyName = ?, JobTitle = ?, StartDate = ?, EndDate = ?, Description = ? WHERE ExpId = ?`;
  const values = [
    req.body.comapanyName,
    req.body.jobTitle,
    req.body.startDate,
    req.body.endDate,
    req.body.description,
    req.body.id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating education:", err);
      return res
        .status(500)
        .json({ Status: "Error", Message: "Failed to update education" });
    }
    return res.json({ Status: "Success" });
  });
});

app.post("/update-user-data", verifyUser, (req, res) => {
  const id = req.id;
  const sql =
    "update jobseeker set JsFName= ?, JsEmail=?,Phone=?, JsExpYear=? where JsId=?";
  const values = [
    req.body.Name,
    req.body.Email,
    req.body.Phone,
    req.body.ExpYear,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) throw err;
    return res.json({ Status: "Success" });
  });
});

app.get("/allJobs", (req, res) => {
  const sql =
    "SELECT job.JobId ,job.JobTitle,job.Salary,job.JobDescr, job.workLocation,job.Active,job.JobExperience,job.MiniEducat,job.City, job.JobType, job.Salary, HR.CompName,HR.companyLogo FROM job INNER JOIN HR ON job.HrID = HR.HrID";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: "Error", message: "Internal server error" });
    }

    const jobsWithUrls = results.map((job) => ({
      ...job,
      companyLogo: generateImageUrl(job.companyLogo), // Convert Buffer to data URL
    }));
    const temp = jobsWithUrls.filter((job) => {
      return job.Active !== 0; // Using strict inequality for comparison
    });
    // console.log(jobsWithUrls);
    // console.log(temp.length);
    return res.json({ Status: "Success", jobs: temp });
  });
});
app.post("/getSearchData", (req, res) => {
  const { job, city } = req.body;

  if (!job || !city) {
    return res
      .status(400)
      .json({ Status: "Error", message: "Job and city are required fields." });
  }

  const sql = `
    SELECT job.JobId, job.JobTitle, job.Salary, job.JobDescr, job.workLocation,
           job.JobExperience, job.MiniEducat, job.City, job.JobType, job.Salary,
           HR.CompName, HR.companyLogo
    FROM job
    INNER JOIN HR ON job.HrID = HR.HrID
    WHERE JobTitle=? OR City=?
  `;

  db.query(sql, [job, city], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: "Error", message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.json({
        Status: "Success",
        message: "No jobs found for the given criteria.",
        jobs: [],
      });
    }

    const jobsWithUrls = results.map((job) => ({
      ...job,
      companyLogo: generateImageUrl(job.companyLogo), // Convert Buffer to data URL
    }));
    const temp = jobsWithUrls.filter((job) => {
      return job.Active !== 0; // Using strict inequality for comparison
    });
    return res.json({ Status: "done", jobs: temp });
  });
});

app.post("/filterdata", (req, res) => {
  const { workType, workMode, location } = req.body;

  // Check if all required parameters are provided
  if (!workType || !workMode || !location) {
    return res
      .status(400)
      .json({ Status: "Error", message: "All fields are required." });
  }

  const sql = `
    SELECT job.JobId, job.JobTitle, job.Salary, job.JobDescr, job.workLocation,
           job.JobExperience, job.MiniEducat, job.City, job.JobType, job.Salary,
           HR.CompName, HR.companyLogo
    FROM job
    INNER JOIN HR ON job.HrID = HR.HrID
    WHERE JobType=? OR workLocation=? OR City=?
  `;

  db.query(sql, [workType, workMode, location], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: "Error", message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.json({
        Status: "Success",
        message: "No jobs found for the given criteria.",
        jobs: [],
      });
    }

    const jobsWithUrls = results.map((job) => ({
      ...job,
      companyLogo: generateImageUrl(job.companyLogo), // Convert Buffer to data URL
    }));
    const temp = jobsWithUrls.filter((job) => {
      return job.Active !== 0; // Using strict inequality for comparison
    });
    return res.json({ Status: "done", jobs: temp });
  });
});

function generateImageUrl(buffer) {
  const base64Data = Buffer.from(buffer).toString("base64");
  return `data:image/png;base64,${base64Data}`;
}
app.get("/allApplication", verifyUser, (req, res) => {
  const id = req.id;
  const sql =
    "select j.JobTitle, h.CompName,h.CompWeb,ja.JaStatus from Job j inner join HR h on j.HrID=h.HrID inner join JobApplication ja on j.JObId=ja.JobId where ja.JsId=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.json({ Status: "Success", application: result });
  });
});
app.post("/applyJob", verifyUser, (req, res) => {
  const id = req.id;
  const jobId = req.body.jobId;
  const checkSql = "SELECT * FROM jobapplication WHERE JsId = ? AND JobId = ?";
  const fetchEducationSql = "SELECT * FROM education WHERE JsId = ?";

  db.query(checkSql, [id, jobId], (checkErr, result) => {
    if (checkErr) {
      return res.json({ Error: "Error in checking details" });
    }

    if (result.length > 0) {
      return res.json({
        Status: "Failed",
        Message: "You are already applied for this job",
      });
    }

    db.query(fetchEducationSql, [id], (eduErr, eduResult) => {
      if (eduErr) {
        return res.json({ Error: "Error fetching education details" });
      }

      if (eduResult.length === 0) {
        return res.json({
          Status: "Failed",
          Message: "You are not eligible",
        });
      }

      const insertSql =
        "INSERT INTO jobapplication (JsId, JobId, JaStatus) VALUES (?, ?, ?)";
      db.query(insertSql, [id, jobId, "pending"], (insertErr, insertResult) => {
        if (insertErr) {
          return res.json({ Error: "Error applying for the job" });
        }
        return res.json({ Status: "Success" });
      });
    });
  });
});

app.post("/applyob", verifyUser, (req, res) => {
  const id = req.id;
  const jobId = req.body.jobId;
  const checkSql = "SELECT * FROM jobapplication WHERE JsId = ? AND JobId = ?";

  db.query(checkSql, [id, jobId], (checkErr, checkResult) => {
    if (checkErr) {
      return res.json({ Error: "Error in checking details" });
    }

    if (checkResult.length > 0) {
      return res.json({ Status: "Failed", Message: "Entry already exists" });
    } else {
      const insertSql =
        "INSERT INTO jobapplication (JsId, JobId, JaStatus) VALUES (?, ?, ?)";
      db.query(insertSql, [id, jobId, "pending"], (insertErr, insertResult) => {
        if (insertErr) {
          throw insertErr;
        }
        return res.json({ Status: "Success" });
      });
    }
  });
});

// admin api
app.post("/login-admin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE AdminUserName=?";
  db.query(sql, [req.body.email], (err, result) => {
    if (err) {
      console.error("Error while querying the database:", err);
      return res.json({ Error: "Internal Server Error" });
    }

    if (result.length > 0) {
      const admin = result[0];
      if (admin.pwd === req.body.password) {
        const id = admin.AdminId;
        const token = jwt.sign({ id }, "key", { expiresIn: "1d" });
        res.cookie("token", token);
        return res.json({ Status: "Success", token });
      } else {
        return res.json({ Error: "Enter correct password" });
      }
    } else {
      return res.json({ Error: "Email not found" });
    }
  });
});

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ Error: "You are not authenticated" });
  else {
    jwt.verify(token, "key", (err, decoded) => {
      if (err) return res.json({ Error: "Token is not correct" });
      else {
        req.id = decoded.id;
        next();
      }
    });
  }
};

app.get("/adminAuth", verifyAdmin, (req, res) => {
  return res.json({ Status: "Success" });
});

app.get("/allRequest", verifyAdmin, (req, res) => {
  const id = req.id;
  const sql =
    "select HrID, HrName, HrEmail, AdharId, CompName, CompADD, CompPhone, CompWeb, companyLogo, AdminId from hr where isVerify=0 and AdminId=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Error" });
    }
    return res.json({ Status: "Success", request: result });
  });
});

app.post("/handle-varify", (req, res) => {
  // const sql="UPDATE `jobportal`.`hr` SET `isVerify` = '1' WHERE (`HrID` = '1');"
  const id = req.body.id;
  const sql = "UPDATE hr SET isVerify=1 where HrID=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Somethig happend wrong" });
    }
    return res.json({ Status: "Success" });
  });
});

app.post("/delete-hr", (req, res) => {
  const id = req.body.id;
  const sql = "delete from hr where HrId=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "something happemd wrong" });
    }
    return res.json({ Status: "Success" });
  });
});
// FId, FName, FEmail, FSubject, Fdescription, FDate, AdminId;
app.get("/feedback", verifyAdmin, (req, res) => {
  const id = req.id;
  const sql = "select FId,FSubject,Fdescription from feedback where AdminId=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Something happend wrong" });
    }
    return res.json({ Status: "Success", feedback: result });
  });
});

app.get("/allCompany", verifyAdmin, (req, res) => {
  const id = req.id;
  const sql =
    "select HrName,HrEmail,CompName,CompADD,CompPhone,CompWeb from hr where AdminId=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    return res.json({ AllCompany: result });
  });
});

app.get("/deactive", (req, res) => {
  const sql = "UPDATE job SET Active = 0 WHERE JobId = ?";
  db.query(sql, [req.body.id], (err, result) => {
    if (err) throw err;
    return res.json({ Status: "done" });
  });
});
