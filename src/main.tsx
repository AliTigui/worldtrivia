

import { Devvit, useState} from '@devvit/public-api';
import {game_info} from './questions.json'




Devvit.configure({
redditAPI: true,
});



//  ---------------------- Getting Config From wiki
async function get_data(app:any) {
  let name = app.subredditName ? app.subredditName : ".none.";
 
    let game_data=await app.reddit.getWikiPage(name, "trivia_config");
    let data=JSON.parse(game_data.content.replaceAll("\\",""))
    return data;
}
// ------------------ Sending mailmod message / setting config_wiki
Devvit.addTrigger({
  events: ['AppInstall','AppUpgrade'], // Event name from above
  onEvent: async (event:any,context) => {
   
   let name =event["subreddit"]["name"];

   let options={"content":JSON.stringify(game_info, null, '  '),"page":"trivia_config","reason":"loading questions","subredditName":name}
   if (event.type == 'AppInstall') {
    await context.reddit.createWikiPage(options)
    const conversationId = await context.reddit.modMail.createModInboxConversation({
      subject: 'The WorldTrivia app has been installed.',
      bodyMarkdown: `**Hello there**, The WorldTrivia app has been installed. \n\n A wiki page named **[trivia_config](https://www.reddit.com/r/${name}/about/wiki/trivia_config/)** has been created, containing preloaded questions and configuration details. Feel free to edit it. \n\n Please check the **[Read Me](https://developers.reddit.com/apps/worldtrivia)** for more information about the app, and don’t hesitate to contact the developer if you have any issues or suggestions. \n\n Have Fun!`,
      subredditId: context.subredditId,

    });
   }else if((event.type == 'AppUpgrade')){

   const conversationId = await context.reddit.modMail.createModInboxConversation({
    subject: 'The WorldTrivia app has been updated.',
    bodyMarkdown: '**Hello there**, The WorldTrivia app has been updated. \n\nPlease check the **[Read Me](https://developers.reddit.com/apps/worldtrivia)** for more information about the update.',
    subredditId: context.subredditId,

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
  const data = await get_data(context);
  
  await reddit.submitPost({
  title: data["post_title"],
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
    const [data] = useState(async () => await get_data(context));
    const [start_text] = useState(data["start_text"]);
    const[app_name] = useState(data["name"]);
    const [app_logo] = useState(data["logo"]);
    const [app_url] = useState(data["community_url"]);
    const [app_url_text] = useState(data["community_url_text"]);
    const [background_image] = useState(data["background_image"]);
    const [text_color] = useState(data["text_color"]);
    const [questions,setQue] = useState(data["questions"].slice());
    const [counter, setCounter] = useState(0);
    const [index, setIndex] = useState(0);
    const [passed, setPassed] = useState(0);
    const [page, setPage] = useState("home");
    const [correct, setCorrect] = useState(true);
    const [qNumber, setqNumber] = useState(0);
    let game_questions=questions.slice();
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
        setQue(data["questions"].slice());
        game_questions=questions.slice();
        setCounter(0);
        setIndex(Math.floor(Math.random() * game_questions.length));
        setPassed(0);
      }else if(page=="check" && p=="game"){
      
      game_questions.splice(index,1)
      setQue(game_questions)
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
  
  if(passed<qNumber && page=="game"  ){
   if(game_questions[index]["type"]=="text_question"){
    return (
      <zstack height="100%" width="100%">
              <image 
          url={background_image}
          imageWidth={300}
          imageHeight={300}
            height="100%"
            width="100%"
          resizeMode="fill"
          description="background image"
        />
      <vstack  height="100%" width="100%"  padding="small" gap="small"  alignment="middle">
     
      <text alignment="center"  color={text_color} size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
      
      <button   size="small"  onPress={()=>updatescore(game_questions[index]["choices"][0])}>{game_questions[index]["choices"][0]}</button>
      <button appearance="media"   size="small" onPress={()=>updatescore(game_questions[index]["choices"][1])}>{game_questions[index]["choices"][1]}</button>
      <button  appearance="destructive" size="small" onPress={()=>updatescore(game_questions[index]["choices"][2])}>{game_questions[index]["choices"][2]}</button>
      <button  appearance="success" size="small" onPress={()=>updatescore(game_questions[index]["choices"][3])}>{game_questions[index]["choices"][3]}</button>
      
      </vstack>
      </zstack>
      )
   }
   else{
    return (
      <zstack height="100%" width="100%">
      <image 
  url={background_image}
  imageWidth={300}
  imageHeight={300}
    height="100%"
    width="100%"
  resizeMode="fill"
  description="background image"
/>
      <vstack  height="100%" width="100%"  padding="small" gap="small"  alignment="middle">
         
      <text alignment="center" color={text_color} size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
      
      <hstack  width="100%" gap="medium" alignment="center middle">
      <image onPress={()=>updatescore(game_questions[index]["choices"][0]["url"])}
          url={game_questions[index]["choices"][0]["url"]}
          
          imageWidth={100}
          imageHeight={100}
          resizeMode="fill"
          description="Generative artwork: Fuzzy Fingers"
        />
            <image onPress={()=>updatescore(game_questions[index]["choices"][1]["url"])}
          url={game_questions[index]["choices"][1]["url"]}
          
          imageWidth={100}
          imageHeight={100}
          resizeMode="fill"
          description="Generative artwork: Fuzzy Fingers"
        />
      
     </hstack>
      <hstack width="100%"  gap="medium" alignment="center middle">
      <image onPress={()=>updatescore(game_questions[index]["choices"][2]["url"])}
          url={game_questions[index]["choices"][2]["url"]}
        
          imageWidth={100}
          imageHeight={100}
          resizeMode="fill"
          description="Generative artwork: Fuzzy Fingers"
        />
            <image onPress={()=>updatescore(game_questions[index]["choices"][3]["url"])}
          url={game_questions[index]["choices"][3]["url"]}
        
      
          imageWidth={100}
          imageHeight={100}
          resizeMode="fill"
          description="Generative artwork: Fuzzy Fingers"
        />
      </hstack>
      </vstack>
      </zstack>
      )
   }
 

  }else if(page=="game"){
    return (
      <zstack height="100%" width="100%">
      <image 
  url={background_image}
  imageWidth={300}
  imageHeight={300}
    height="100%"
    width="100%"
  resizeMode="fill"
  description="background image"
/>
  <vstack  height="100%" width="100%"  padding="small" gap="small" alignment="center middle">
  <text size="xlarge" color={text_color}> Your score is: {counter} /{qNumber}</text>
  <hstack width="100px" ><button appearance="success" size="small" onPress={()=>updatepage("level")} grow>Play  Again</button></hstack>
  <hstack width="100px" ><button appearance="success" size="small" onPress={()=>updatepage("home")}grow>Go Home</button></hstack>
  </vstack>
  </zstack>
    )
  }else if (page=="home"){
    
  
    return (
      <zstack height="100%" width="100%">
      <image 
  url={background_image}
  imageWidth={300}
  imageHeight={300}
    height="100%"
    width="100%"
  resizeMode="fill"
  description="background image"
/>
    <vstack height="100%" width="100%" padding="small" gap="medium" alignment="middle">
      <hstack  padding="small" gap="medium" alignment="center middle"><text size="xxlarge" color={text_color} weight='bold'>{app_name}</text></hstack>
      <hstack  padding="small" gap="medium" alignment="center middle">
    <image
      url={app_logo}
      
      imageWidth={85}
      imageHeight={85}
      resizeMode="fit"
      description="Generative artwork: Fuzzy Fingers"
    />
    </hstack>
  <button appearance="success" size="small" onPress={()=>{ updatepage("level")}}>{start_text}</button>
  
  <hstack  padding="small" gap="medium" alignment="center middle"><text size="small" color={text_color} onPress={()=>{context.ui.navigateTo(app_url);}}>{app_url_text}</text></hstack>
  </vstack>
  </zstack>
    )
  }else if(page=="check" ){
    if(game_questions[index]["type"]=="text_question"){
      return (
        <zstack height="100%" width="100%">
              <image 
          url={background_image}
          imageWidth={300}
          imageHeight={300}
            height="100%"
            width="100%"
          resizeMode="fill"
          description="background image"
        />
        <vstack  height="100%" width="100%"  padding="small" gap="medium"  alignment="center middle">
        
        
        <text alignment="center" color={text_color} size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
        
        <text wrap={true} alignment="center" size="large" weight="bold" color={correct ? `green` : 'red'}>{correct ? `You guessed it right!` : 'That\'s incorrect. The right answer is '+game_questions[index]["answer"]}</text>
        
        <hstack width="100px" ><button  appearance="success" size="small" onPress={()=>updatepage("game")} grow >Next</button></hstack>
          
        
        </vstack>
        </zstack>
      )
    }else{
return (
  <zstack height="100%" width="100%">
  <image 
url={background_image}
imageWidth={300}
imageHeight={300}
height="100%"
width="100%"
resizeMode="fill"
description="background image"
/>
  <vstack height="100%" width="100%"  padding="small" gap="medium"  alignment="center middle">
      
      
  <text color={text_color} alignment="center" size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
  
  <text wrap={true} alignment="center" size="large" weight="bold" color={correct ? `green` : 'red'}>{correct ? `You guessed it right!` : 'That\'s incorrect. The right answer is '}</text>
  <image
    url={game_questions[index]["answer"]}
    
    imageWidth={85}
    imageHeight={85}
    resizeMode="fill"
    description="answer"
  />
  <hstack width="100px" ><button  appearance="success" size="small" onPress={()=>updatepage("game")} grow >Next</button></hstack>
    
  
  </vstack>
  </zstack>
)
    }
 
  }else if(page=="level"){
    return (
      <zstack height="100%" width="100%">
      <image 
  url={background_image}
  imageWidth={300}
  imageHeight={300}
    height="100%"
    width="100%"
  resizeMode="fill"
  description="background image"
/>
      <vstack  height="100%" width="100%"  padding="small" gap="small" alignment="center middle">
      <text size="xlarge" color={text_color}> Select Game Level </text>
      <hstack width="210px" ><button appearance="success" size="small" onPress={()=> setlevel("easy")} grow>Easy (5 Questions)</button></hstack>
      <hstack width="210px" ><button appearance="caution" size="small" onPress={()=>setlevel("medium")} grow>Medium (10 Questions)</button></hstack>
      <hstack width="210px" ><button appearance="destructive" size="small" onPress={()=>setlevel("hard")} grow>Hard (20 Questions)</button></hstack>
      </vstack>
      </zstack>
        )
  }
  },
  });
  
  export default Devvit;
  
  
  
  
  
  
  
  
  
  
