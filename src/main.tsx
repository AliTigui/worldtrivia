

import { Devvit, useState} from '@devvit/public-api';
import {questions} from './questions.json'

let game_questions=questions.slice()


Devvit.configure({
redditAPI: true,
redis: true,

});


// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
label: 'Add World Trivia Game',
location: 'subreddit',
forUserType: 'moderator',
onPress: async (_event, context) => {
const { reddit, ui } = context;
const subreddit = await reddit.getCurrentSubreddit();
await reddit.submitPost({
title: 'World Trivia',
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
render: (context):any => {

  // States
  const [counter, setCounter] = useState(0);
  const [index, setIndex] = useState(Math.floor(Math.random() * game_questions.length));
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
    if(p=="level"  && page=="game" ){
      game_questions=questions.slice();
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
  setPage("check");
  if(answer==game_questions[index]["answer"]){
  setCorrect(true)
  setCounter(counter+1)
  }else{
    setCorrect(false)
  }
  
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
<text size="xlarge"> Your score is: {counter} /{passed}</text>
<hstack width="100px" ><button appearance="success" size="small" onPress={()=>updatepage("level")} grow>Play  Again</button></hstack>
<hstack width="100px" ><button appearance="success" size="small" onPress={()=>updatepage("home")} grow>Go Home</button></hstack>
</vstack>
  )
}else if (page=="home"){
  return (
  <vstack height="100%" width="100%" padding="small" gap="medium" alignment="middle">
    <hstack  padding="small" gap="medium" alignment="center middle"><text size="xxlarge" color="black white" weight='bold'>World Trivia</text></hstack>
    <hstack  padding="small" gap="medium" alignment="center middle">
  <image
    url="quiz.png"
    
    imageWidth={70}
    imageHeight={70}
    resizeMode="fit"
    description="Generative artwork: Fuzzy Fingers"
  />
  </hstack>
<button appearance="success" size="small" onPress={()=>updatepage("level")}>Start Game</button>

<hstack  padding="small" gap="medium" alignment="center middle"><text size="small" onPress={()=>{context.ui.navigateTo("https://discord.com/invite/rpalestine");}}>This app has been built here.</text></hstack>
</vstack>
  )
}else if(page=="check"){
  return (

    <vstack backgroundColor="white black" height="100%" width="100%"  padding="small" gap="medium"  alignment="center middle">
    
    
    <text color="black white" size="large" weight="bold" wrap={true}>{game_questions[index]["question"]}</text>
    
    <text wrap={true} size="large" weight="bold" color={correct ? `green` : 'red'}>{correct ? `You guessed it right!` : 'That\'s incorrect. The right answer is '+game_questions[index]["answer"]}</text>
    <hstack width="100px" ><button  appearance="success" size="small" onPress={()=>updatepage("game")} grow>Next</button></hstack>
    
      
    
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










