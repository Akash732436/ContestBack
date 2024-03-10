const fetch = require("node-fetch")
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');

const conn = mysql.createPool({
    connectionLimit: 10,
    password: "",
    user: 'root',
    database: 'codedada',
    host: 'localhost',
    port: '3306',
    multipleStatements: 'true'
});

let val = {};
val.all = () => {

    return new Promise((ressolve, reject) => {
        conn.query('SELECT * FROM accounts', (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results);
        });
    });
};

val.one = (id) => {
    return new Promise((ressolve, reject) => {
        conn.query(`SELECT * FROM accounts WHERE account_id=?`, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[0]);
        });
    });
};
val.name = (id) => {
    return new Promise((ressolve, reject) => {
        conn.query(`SELECT username FROM accounts WHERE account_id=?`, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[0]);
        });
    });
};

val.check = (username, pass) => {
    return new Promise((ressolve, reject) => {
        conn.query(`SELECT * FROM accounts WHERE username=?`, [username], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length == 0) {
                return ressolve("Does not exist");
            }
            if (results[0]['password'] == pass) {
                return ressolve(results[0]);
            }
            return ressolve("Wrong Credentials");
        })
    })
}

val.problems = () => {
    return new Promise((ressolve, reject) => {
        const q = 'CREATE TEMPORARY TABLE temp SELECT question_id,SUM(points) as points FROM testcase GROUP BY question_id;SELECT question.question_id,question_name,level,points FROM question,temp WHERE question.question_id=temp.question_id;DROP TABLE temp;'
        conn.query(q, (err, results) => {
            if (err) {
                return reject(err);
            }

            return ressolve(results[1]);
        });
    });
};

val.users = () => {
    return new Promise((ressolve, reject) => {
        const q = 'CREATE TEMPORARY TABLE temp SELECT SUM(submission_verdict.points) AS total,participant_id FROM submission,submission_verdict WHERE submission.submission_id=submission_verdict.submission_id GROUP BY participant_id;CREATE TEMPORARY TABLE temp2 SELECT SUM(total) as total,account_id FROM temp,participant WHERE temp.participant_id=participant.participant_id GROUP BY account_id;SELECT username,total FROM temp2,accounts WHERE temp2.account_id=accounts.account_id;DROP TABLE temp;DROP TABLE temp2;'
        conn.query(q, (err, results) => {
            if (err) {
                return reject(err);
            }

            return ressolve(results[2]);
        });
    });
};

val.past = () => {
    return new Promise((ressolve, reject) => {
        //const q = 'SELECT contest_name,username,start_time,end_time FROM contest,accounts WHERE contest.account_id=accounts.account_id AND end_time<SYSDATE();'
        const q='create TEMPORARY table temp1 SELECT contest_id,count(DISTINCT participant_id) as users FROM `submission` group by contest_id; create TEMPORARY table temp2 SELECT contest_id,contest_name,username,start_time,end_time FROM contest,accounts WHERE contest.account_id=accounts.account_id AND end_time<SYSDATE();SELECT contest_name,username,start_time,end_time,users FROM temp1 right join temp2 on temp1.contest_id=temp2.contest_id;DROP TABLE temp1;DROP TABLE temp2;'
        conn.query(q, (err, results) => {
            if (err) {
                return reject(err);
            }
            results[2].forEach(element => {
                element["duration"] = (Date.parse(element["end_time"]) - Date.parse(element['start_time'])) / 60000;
            });
            return ressolve(results[2]);
        });
    });
};

val.present = () => {
    return new Promise((ressolve, reject) => {
        const q = 'SELECT contest_id,contest_name,username,start_time,end_time FROM contest,accounts WHERE contest.account_id=accounts.account_id AND end_time>SYSDATE() AND start_time<SYSDATE();'
        conn.query(q, (err, results) => {
            if (err) {
                return reject(err);
            }
            results.forEach(element => {
                element["duration"] = (Date.parse(element["end_time"]) - Date.parse(element['start_time'])) / 60000;
            });
            return ressolve(results);
        });
    });
};

val.future = () => {
    return new Promise((ressolve, reject) => {
        const q = 'SELECT contest_id,contest_name,username,start_time,end_time FROM contest,accounts WHERE contest.account_id=accounts.account_id AND end_time>SYSDATE() AND start_time>SYSDATE();'
        conn.query(q, (err, results) => {
            if (err) {
                return reject(err);
            }
            results.forEach(element => {
                element["duration"] = (Date.parse(element["end_time"]) - Date.parse(element['start_time'])) / 60000;
            });
            return ressolve(results);
        });
    });
};

val.ranks = (contest) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'SET @id=(SELECT contest_id FROM contest WHERE contest_name=?);CREATE TEMPORARY TABLE temp SELECT SUM(submission_verdict.points) AS total,participant_id FROM submission,submission_verdict WHERE submission.submission_id=submission_verdict.submission_id AND contest_id=@id GROUP BY participant_id;CREATE TEMPORARY TABLE temp2 SELECT SUM(total) as total,account_id FROM temp,participant WHERE temp.participant_id=participant.participant_id GROUP BY account_id;SELECT username,total FROM temp2,accounts WHERE temp2.account_id=accounts.account_id;DROP TABLE temp;DROP TABLE temp2;'
        conn.query(q, [contest], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[3]);
        });
    });
};

val.createContest = (id, data) => {
    return new Promise((ressolve, reject) => {

        const q = 'INSERT INTO contest (account_id,contest_name,description,start_time,end_time,difficulty) VALUES(?,?,?,?,?,?);SELECT contest_id FROM contest WHERE contest_name=?';
        conn.query(q, [id, data["contestName"], data["desc"], data["start"], data["end"], data["level"], data["contestName"]], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results[1] == NULL) return ressolve("Failed");
            return ressolve(results[1]);

        });

    });
};

val.contestDetails = (id) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'SELECT contest_name,description,start_time,end_time,difficulty FROM contest WHERE contest_id=?'
        conn.query(q, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[0]);
        });
    });
};

val.contestQuestions = (id) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'CREATE TEMPORARY TABLE temp SELECT question_id,SUM(points)as points FROM testcase GROUP BY question_id;SELECT question_name,question_description,points,level FROM temp,question WHERE temp.question_id=question.question_id AND contest_id=?;DROP TABLE temp';
        conn.query(q, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[1]);
        });
    });
};

val.questionSearch = (contest_id, queston_name) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'SELECT question_id FROM question WHERE question_name=? AND contest_id=?'
        conn.query(q, [queston_name, contest_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length > 0) return ressolve(results[0]);
            return ressolve("No");


        });
    });
};

val.insertQuestion = (data) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'INSERT INTO question (question_name,contest_id,question_description,level) VALUES(?,?,?,?);SELECT question_id FROM question WHERE contest_id=? And question_name=?'
        conn.query(q, [data["questionName"], data["contestId"], data["questionDesc"], data["questionLevel"], data["contestId"], data["questionName"]], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[1]);

        });
    });
};

val.insertTestcase = (data) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'INSERT INTO testcase (question_id,testcase_input,testcase_output,points) VALUES(?,?,?,?);'
        conn.query(q, [data["questionId"], data["testcaseInput"], data["testcaseOutput"], data["testcasePoints"]], (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve("Success");

        });
    });
};

val.questionDesc = (questionId) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'SELECT question_name,question_description FROM question WHERE question_id =?'
        conn.query(q, questionId, (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[0]);

        });
    });
};

val.ide = (data) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        let code = data["code"],
            language = data["language"],
            input = data["input"];
        //const clientId="f6e084d2a894c35ecebe16b0adcf3b45",
        //clientSecret="a6e6aca1eab745718fbc70d76adfdef901babf15537ccbe359ad494fbb989f3e";
        const obj = { code, language, input }
        fetch('https://codexweb.netlify.app/.netlify/functions/enforceCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                return ressolve(data["output"])
            })
    });
};

val.userName = (id) => {
    return new Promise((ressolve, reject) => {
        //const id=2;
        const q = 'SELECT username,admin FROM accounts WHERE account_id=?';
        conn.query(q, id, (err, results) => {
            if (err) {
                return reject(err);
            }
            return ressolve(results[0]);

        });
    });
};

val.questionContestSubmit = (data, id, question_id,contest_id) => {

    //const id=2;
    let participant_id = 1,submission_id=1;
    let code = data["code"],
        language = data["language"];
    points = 0;
    let sum = 0;
    let time='2021-06-25 12:55:01';
    //return 4;
    return new Promise((ressolve, reject) => {
    const q2 = 'SELECT participant_id FROM participant WHERE account_id=? AND contest_id=?';
    conn.query(q2, [id,contest_id], (err, results) => {
        //if (err) {
        //    return reject(err);
        //}
        //console.log(results.length);
        if (results.length == 0) {
            const q3 = 'INSERT INTO PARTICIPANT (account_id,contest_id) VALUES (?,?);SELECT participant_id FROM participant WHERE account_id=? AND contest_id=?;';
            conn.query(q3, [id, contest_id, id, contest_id], (err, results) => {
                if (err) {
                    console.log(err);
                }results=results[1];
                participant_id=results[0].participant_id;
                

                //participant_id=40;
                //console.log(participant_id);
            });
        }
        else
            participant_id = results[0].participant_id;
            

    });

    setTimeout(()=>{
    const q4 = 'SELECT submission_id FROM submission WHERE question_id=? AND contest_id=? AND participant_id=?';
    conn.query(q4, [question_id, contest_id, participant_id], (err, results) => {
        if (err) {
            console.log(err);
        }
        //console.log(submission_id);
        
        //console.log(results.length);
        if (results.length == 0) {
            const q6 = 'INSERT INTO submission (question_id,participant_id,contest_id,code_desc,language,time_submitted) VALUES (?,?,?,?,?,?);SELECT submission_id FROM submission WHERE question_id=? AND contest_id=? AND participant_id=?';
            conn.query(q6, [question_id, participant_id, contest_id, code, language, time, question_id, contest_id, participant_id], (err, results) => {
                if (err) {
                    console.log(err);
                }else
                results=results[1];
                submission_id = results[0].submission_id;
                //console.log(submission_id);
            });
        }
        else
            submission_id = results[0].submission_id;

    });
},5000)
setTimeout(()=>{
    const q5 = 'SELECT * FROM testcase WHERE question_id=?';
    
        conn.query(q5, question_id, (err, results) => {
            //let points=0;
            //if (err) {
            //    return reject(err);
            //}
            results.forEach(i => {

                a = results[0]
                //return ressolve(a["testcase_input"]);
                let input = i["testcase_input"];
                const obj = { code, language, input }
                fetch('https://codexweb.netlify.app/.netlify/functions/enforceCode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        //console.log(data["output"])
                        //data["output"] = data["output"].substring(0, data["output"].length - 1);
                        //return ressolve(data["output"])
                        if (data["output"] == i["testcase_output"] || data["output"].substring(0, data["output"].length - 1) == i["testcase_output"]) {
                            points += i["points"]
                        }
                        sum += i["points"]

                        //console.log(points)
                    });
            });
        },10000)

        setTimeout(()=>{
            
            const q7 = 'SELECT points FROM submission_verdict WHERE submission_id=?';
            conn.query(q7, submission_id, (err, results) => {
                if (err) {
                    console.log(err);
                }
                //console.log(results.length)
                if (results.length == 0) {
                    const q8 = 'INSERT INTO submission_verdict (submission_id,verdict,testcase_output,user_output,points) VALUES (?,?,?,?,?);';
                    conn.query(q8, [submission_id, 'ab','69','69', points], (err, results) => {
                        if (err) {
                            console.log(err);
                            }
                            else {
                                console.log('done');
                            }

                    });
                }
                else {
                    if (results[0].points < points) {
                        const q9 = 'UPDATE submission_verdict SET points=? WHERE submission_id=? ';

                        conn.query(q9, [points, submission_id], (err, results) => {
                            if (err) {
                            console.log(err);
                            }
                            else {
                                console.log('done');
                            }

                        });
                    }
                }

            });
        },15000);
            setTimeout(() => { return ressolve(` You got ${points} out of ${sum} points`) }, 20000);

        });


    });
};

val.questionSubmit = (data, question_id) => {

    //const id=2;

    let code = data["code"],
        language = data["language"];
    points = 0;
    sum = 0
    //return 4;

    const q = 'SELECT * FROM testcase WHERE question_id=?';
    return new Promise((ressolve, reject) => {
        conn.query(q, question_id, (err, results) => {
            //let points=0;
            if (err) {
                return reject(err);
            }
            results.forEach(i => {

                a = results[0]
                //return ressolve(a["testcase_input"]);
                let input = i["testcase_input"];
                const obj = { code, language, input }
                fetch('https://codexweb.netlify.app/.netlify/functions/enforceCode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        //console.log(data["output"])
                        //data["output"] = data["output"].substring(0, data["output"].length - 1);
                        //return ressolve(data["output"])
                        if (data["output"] == i["testcase_output"] || data["output"].substring(0, data["output"].length - 1) == i["testcase_output"]) {
                            points += i["points"]
                        }
                        sum += i["points"]

                        //console.log(points)
                    });
            });
            setTimeout(() => { return ressolve(` You got ${points} out of ${sum} points`) }, results.length * 3000);

        });


    });
};
val.contestProblems = (contest_id) => {
    return new Promise((ressolve, reject) => {
        const q = 'CREATE TEMPORARY TABLE temp SELECT question_id,SUM(points) as points FROM testcase GROUP BY question_id;SELECT question.question_id,question_name,level,points FROM question,temp WHERE question.question_id=temp.question_id AND question.contest_id=?;DROP TABLE temp;'
        conn.query(q, contest_id, (err, results) => {
            if (err) {
                return reject(err);
            }

            return ressolve(results[1]);
        });
    });
};

/*
{
   "script" : "print('hello')",
   "language": "python3",
   "versionIndex": "4",
   "clientId":"f6e084d2a894c35ecebe16b0adcf3b45",
   "clientSecret":"a6e6aca1eab745718fbc70d76adfdef901babf15537ccbe359ad494fbb989f3e"
}*/


module.exports = val;