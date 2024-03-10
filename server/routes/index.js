const express=require('express');
const router=express.Router();
const val= require('../db');
router.get('/:id',async (req,res,next)=>{
    try{
        let results=await val.one(req.params.id);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})
router.get('/login/:name/:password',async (req,res,next)=>{
    try{
        let results=await val.check(req.params.name,req.params.password);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})
router.get('/',async (req,res,next)=>{
    try{
        let results=await val.all();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id/problems',async (req,res,next)=>{
    try{
        let results=await val.problems();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id/users',async (req,res,next)=>{
    try{
        let results=await val.users();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id/past',async (req,res,next)=>{
    try{
        let results=await val.past();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id/present',async (req,res,next)=>{
    try{
        let results=await val.present();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id/future',async (req,res,next)=>{
    try{
        let results=await val.future();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id/userName',async (req,res,next)=>{
    try{
        let results=await val.userName(req.params.id);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/:id/:contestName/ranks',async (req,res,next)=>{
    try{
        let results=await val.ranks(req.params.contestName);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:id/createContest',async (req,res,next)=>{
    try{
        //console.log(req.body);
        let results=await val.createContest(req.params.id,req.body);
        console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/:id/:contest_id/contestDetails',async (req,res,next)=>{
    try{
        let results=await val.contestDetails(req.params.contest_id);
        console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/:id/:contest_id/contestQuestions',async (req,res,next)=>{
    try{
        let results=await val.contestQuestions(req.params.contest_id);
        console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/:id/:contest_id/:question_name/questionSearch',async (req,res,next)=>{
    try{
        let results=await val.questionSearch(req.params.contest_id,req.params.question_name);
        console.log(req.params.question_name);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:id/:contest_id/insertQuestion',async (req,res,next)=>{
    try{
        //console.log(req.body);
        let results=await val.insertQuestion(req.body);
        console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:id/:contest_id/:question_id/insertTestcase',async (req,res,next)=>{
    try{
        //console.log(req.body);
        let results=await val.insertTestcase(req.body);
        console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/:id/:question_id/questionDesc',async (req,res,next)=>{
    try{
        let results=await val.questionDesc(req.params.question_id);
        //console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:id/:question_id/ide',async (req,res,next)=>{
    try{
        //console.log(req.body);
        let results=await val.ide(req.body);
        //console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:id/:question_id/:contest_id/submit',async (req,res,next)=>{
    try{
        //console.log(req.body);
        let results=await val.questionContestSubmit(req.body,req.params.id,req.params.question_id,req.params.contest_id);
        console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:id/:question_id/submit',async (req,res,next)=>{
    try{
        //console.log(req.body);
        let results=await val.questionSubmit(req.body,req.params.question_id);
        //console.log(results);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/:id/:contest_id/contestProblems',async (req,res,next)=>{
    try{
        let results=await val.contestProblems(req.params.contest_id);
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports=router;
