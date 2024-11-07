

import { Devvit, useState} from '@devvit/public-api';
import {game_info} from './questions.json'

let game_questions:any;


Devvit.configure({
redditAPI: true,
redis: true,
http: true,
});



//  ---------------------- Helpfull functions


async function get_start_text(app:any) {
  let name = app.subredditName ? app.subredditName : ".none.";
 
    let game_data=await app.reddit.getWikiPage(name, "trivia_config");
    let data=JSON.parse(game_data.content)
    return data["start_text"]
}
async function get_app_name(app:any) {
  let name = app.subredditName ? app.subredditName : ".none.";
 
    let game_data=await app.reddit.getWikiPage(name, "trivia_config");
    let data=JSON.parse(game_data.content)
    return data["name"]
}

async function get_questions(app:any) {
  let name = app.subredditName ? app.subredditName : ".none.";
 
    let game_data=await app.reddit.getWikiPage(name, "trivia_config");
    let data=JSON.parse(game_data.content)
    return data["questions"]
  

}


async function get_app_logo(app:any) {
  let name = app.subredditName ? app.subredditName : ".none.";

    let game_data=await app.reddit.getWikiPage(name, "trivia_config");
    let data=JSON.parse(game_data.content)
    return data["logo"]
  

}
async function get_app_url(app:any) {
  let name = app.subredditName ? app.subredditName : ".none.";

    let game_data=await app.reddit.getWikiPage(name, "trivia_config");
    let data=JSON.parse(game_data.content)
    return data["comunity_url"]
  

}
// ------------------  End
Devvit.addTrigger({
  events: ['AppInstall','AppUpgrade'], // Event name from above
  onEvent: async (event:any,context) => {
   
   let name =event["subreddit"]["name"];

   let options={"content":JSON.stringify(game_info, null, '  '),"page":"trivia_config","reason":"loading questions","subredditName":name}
   if (event.type == 'AppInstall') {
    await context.reddit.createWikiPage(options)
    const conversationId = await context.reddit.modMail.createConversation({
      subject: 'Trivia app have been installed',
      body: '**Hello there** \n\n The Trivia App have been installed \n\n A wiki page have been created with name trivia_config that have preloaded questions and config about the page feel free to edit it \n\n check [Read me](https://developers.reddit.com/apps/worldtrivia) for more info about the app',
      subredditName: name,
    });
   }else if((event.type == 'AppUpgrade')){
    
   const conversationId = await context.reddit.modMail.createConversation({
    subject: 'Trivia app have Updated',
    body: '**Hello there** \n\n The Trivia App have been  Updated check [Read me](https://developers.reddit.com/apps/worldtrivia) for more info about the update',
    subredditName: name,
  });
   }
  
  
    
  },
});


// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add Trivia App  Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
  const { reddit, ui} = context;
  
  const subreddit = await reddit.getCurrentSubreddit();

  
  await reddit.submitPost({
  title: "Trivia Game",
  subredditName: subreddit.name,
  // The preview appears while the post loads
  preview: (
  <vstack height="100%" width="100%" alignment="middle center">
  <text size="large">Loading ...</text>
  </vstack>
  ),
  });
  ui.showToast({ text: 'Created post!' });
  },
  });
  
  // Add a post type definition
  Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'regular',
  render:  (context):any => {
  
    
    // States
    const [counter, setCounter] = useState(0);
    let [data1, setData] = useState(async () => {
      return await get_questions(context);
    });
    let [start_text, setStart_text] = useState(async () => {
      return await get_start_text(context);
    });
    
    let [app_name, setAppname] = useState(async () => {
      return await get_app_name(context);
    });
    let [app_logo, setApplogo] = useState(async () => {
      return await get_app_logo(context);
    });
    let [app_url, setAppurl] = useState(async () => {
      return await get_app_url(context);
    });
    const [index, setIndex] = useState(0);
    const [passed, setPassed] = useState(0);
    const [page, setPage] = useState("home");
    const [correct, setCorrect] = useState(true);
    const [qNumber, setqNumber] = useState(0);
    
  
    // Functions
  
    
  
    function setlevel(level:string){
      if(level=="easy"){
        setqNumber(5);
      }else if(level=="medium"){
        setqNumber(10);
      }else if(level=="hard"){
        setqNumber(20);
      }
      setPage("game");
    }
    function updatepage(p:string){
      
      if(p=="level"  && (page=="game" ||page=="home" )){
        game_questions=data1.slice();
        setCounter(0);
        setIndex(Math.floor(Math.random() * game_questions.length));
        setPassed(0);
      }else if(page=="check" && p=="game"){
      game_questions.splice(index,1)
      setIndex(Math.floor(Math.random() * game_questions.length))
      
      }
      setPage(p);
  
    }
  function updatescore(answer:any){
    setPassed(passed+1)
    
    if(answer==game_questions[index]["answer"]){
    setCorrect(true)
    setCounter(counter+1)
    }else{
      setCorrect(false)
    }
    setPage("check");
  }
  
  if(passed<qNumber && page=="game"){
   
  return (
  
  <vstack backgroundColor="white black" height="100%" width="100%"  padding="small" gap="small"  alignment="middle">
  <text color="black white" size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
  <button   size="small" onPress={()=>updatescore(game_questions[index]["choices"][0])}>{game_questions[index]["choices"][0]}</button>
  <button appearance="bordered"  size="small" onPress={()=>updatescore(game_questions[index]["choices"][1])}>{game_questions[index]["choices"][1]}</button>
  <button  appearance="destructive" size="small" onPress={()=>updatescore(game_questions[index]["choices"][2])}>{game_questions[index]["choices"][2]}</button>
  <button  appearance="success" size="small" onPress={()=>updatescore(game_questions[index]["choices"][3])}>{game_questions[index]["choices"][3]}</button>
  
  </vstack>
  
  )
  
  }else if(page=="game"){
    return (
  <vstack  height="100%" width="100%"  padding="small" gap="small" alignment="center middle">
  <text size="xlarge"> Your score is: {counter} /{qNumber}</text>
  <hstack width="100px" ><button appearance="success" size="small" onPress={()=>updatepage("level")} grow>Play  Again</button></hstack>
  <hstack width="100px" ><button appearance="success" size="small" onPress={()=>updatepage("home")}grow>Go Home</button></hstack>
  </vstack>
    )
  }else if (page=="home"){
    
  
    return (
    <vstack height="100%" width="100%" padding="small" gap="medium" alignment="middle">
      <hstack  padding="small" gap="medium" alignment="center middle"><text size="xxlarge" color="black white" weight='bold'>{app_name}</text></hstack>
      <hstack  padding="small" gap="medium" alignment="center middle">
    <image
      url={app_logo}
      
      imageWidth={70}
      imageHeight={70}
      resizeMode="fit"
      description="Generative artwork: Fuzzy Fingers"
    />
    </hstack>
  <button appearance="success" size="small" onPress={()=>{ updatepage("level")}}>{start_text}</button>
  
  <hstack  padding="small" gap="medium" alignment="center middle"><text size="small" onPress={()=>{context.ui.navigateTo(app_url);}}>Join our comunity</text></hstack>
  </vstack>
    )
  }else if(page=="check"){
    return (
  
      <vstack backgroundColor="white black" height="100%" width="100%"  padding="small" gap="medium"  alignment="center middle">
      
      
      <text color="black white" size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
      
      <text wrap={true} size="large" weight="bold" color={correct ? `green` : 'red'}>{correct ? `You guessed it right!` : 'That\'s incorrect. The right answer is '+game_questions[index]["answer"]}</text>
      
      <hstack width="100px" ><button  appearance="success" size="small" onPress={()=>updatepage("game")} grow >Next</button></hstack>
        
      
      </vstack>
    )
  }else if(page=="level"){
    return (
      <vstack  height="100%" width="100%"  padding="small" gap="small" alignment="center middle">
      <text size="xlarge"> Select Game Level </text>
      <hstack width="100px" ><button appearance="success" size="small" onPress={()=> setlevel("easy")} grow>Easy</button></hstack>
      <hstack width="100px" ><button appearance="caution" size="small" onPress={()=>setlevel("medium")} grow>Medium</button></hstack>
      <hstack width="100px" ><button appearance="destructive" size="small" onPress={()=>setlevel("hard")} grow>Hard</button></hstack>
      </vstack>
        )
  }
  },
  });
  
  export default Devvit;
  
  
  
  
  
  
  
  
  
  
