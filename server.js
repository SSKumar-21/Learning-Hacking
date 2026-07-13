import express from "express";
import { Client } from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const keyword = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE",
    "EXEC",
    "UNION",
    "ALL",
    "DISTINCT",
    "FROM",
    "WHERE",
    "HAVING",
    "GROUP BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "JOIN",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "OUTER JOIN",
    "CROSS JOIN",
    "INTO",
    "VALUES",
    "SET",
    "LIKE",
    "IN",
    "EXISTS",
    "BETWEEN",
    "IS NULL",
    "IS NOT NULL",
    "CAST",
    "CONVERT",
    "DECLARE",
    "EXECUTE",
    "FETCH",
    "OPEN",
    "CLOSE",
    "DEALLOCATE",
    "USE",
    "DATABASE",
    "TABLE",
    "VIEW",
    "INDEX",
    "AND",
    "OR",
    "NOT",
    "XOR",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "ASCII",
    "CHAR",
    "CHR",
    "CONCAT",
    "SUBSTRING",
    "MID",
    "LEN",
    "LENGTH",
    "RTRIM",
    "LTRIM",
    "COALESCE",
    "NULLIF",
    "SLEEP",
    "BENCHMARK",
    "WAITFOR DELAY",
    "INFORMATION_SCHEMA",
    "SYSOBJECTS",
    "SYSCOLUMNS",
    "XP_CMDSHELL",
    "XP_REGREAD",
    "XP_REGWRITE",
    "XP_REGDELETE",
    "XP_FILELIST",
    "XP_SERVICECONTROL",
    "XP_SUBDIRS",
    "XP_Dirtree",
    "XP_LOGINCONFIG",
    "XP_ENUMDSN",
    "XP_OACREATE",
    "XP_OADELETE",
    "XP_OAEXEC",
    "XP_OAGETPROPERTY",
    "XP_OASETPROPERTY",
    "XP_OAMETHOD",
    "XP_OADESTROY",
    "XP_SENDMAIL",
    "XP_STARTMAIL",
    "XP_STOPMAIL",
    "XP_GETNETNAME",
    "XP_GETNETDRIVES",
    "XP_GETNETUSERS",
    "XP_GETNETSERVERS",
    "XP_GETNETGROUPS",
    "XP_GETNETSHARES",
    "XP_GETNETPRINTERS",
    "--",
    ";",
    "'",
    "\"",
    "`",
    "#",
    "/*",
    "*/",
    "@@VERSION",
    "@@SERVERNAME",
    "@@ROWCOUNT",
    "@@ERROR",
    "@@IDENTITY",
    "@@TRANCOUNT",
    "@@SPID",
    "@@DBTS"
  ]
  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    host: "localhost",
    database: "sia",
    user: "sidharthkumar",
    password: "Apple098@",
    port: 3306
});

try {
    await client.connect();
    console.log("✅ PostgreSQL Connected");
} catch (err) {
    console.error("Database Connection Error");
    console.error(err);
}

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));



app.get("/", (req, res) => {
    res.render("login", {
        error: null
    });
});

// Login

// app.post("/login", async (req, res) => {

//     const { email, password } = req.body;

//     try {

//         if(email in keyword){
//             const demoAdmin = {
//                 student_roll_no: "2307191540030",
//                 student_name: "ADMIN",
//                 student_contact: "9876543210",
//                 student_secondary_no: null,
//                 student_whatsapp_no: "9876543210",
//                 email: "admin@gmail.com",
//                 day_scholar: false
//             };
//             res.render("dashboard", {
//                 demoAdmin
//             });
//         }

//         const result = await client.query(
//             `
//             SELECT *
//             FROM students
//             WHERE email = $1
//             AND student_roll_no = $2
//             `,
//             [email, password]
//         );

//         if (result.rows.length === 0) {

//             return res.render("login", {
//                 error: "Invalid Email or Roll Number"
//             });

//         }

//         const student = result.rows[0];
//         console.log(`Login Sucessfull`);
//         res.render("dashboard", {
//             student
//         });

//     } catch (err) {

//         console.error(err);

//         res.status(500).send("Internal Server Error");

//     }

// });


app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const isDemo = keyword.some(item =>
        email.toUpperCase().includes(item.toUpperCase())
    );

    if (isDemo) {

        const demoAdmin = {
            student_roll_no: "2307191540030",
            student_name: "ADMIN",
            student_contact: "9876543210",
            student_secondary_no: null,
            student_whatsapp_no: "9876543210",
            email: "admin@gmail.com",
            day_scholar: false
        };

        return res.render("dashboard", {
            student: demoAdmin
        });
    }

    try {

        const result = await client.query(
            `
            SELECT *
            FROM students
            WHERE email = $1
            AND student_roll_no = $2
            `,
            [email, password]
        );

        if (result.rows.length === 0) {

            return res.render("login", {
                error: "Invalid Email or Roll Number"
            });

        }

        return res.render("dashboard", {
            student: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        return res.status(500).send("Internal Server Error");

    }

});

app.get("/logout", (req, res) => {
    res.redirect("/");
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});