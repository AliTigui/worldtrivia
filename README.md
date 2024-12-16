## World trivia
This app is a multichoice game. Mods can install it and add it to their subs, then people can practice and play and see their scores.
You can see below how the app works.
![Game](https://s7.gifyu.com/images/SJXxj.gif)

### How it works :

After mods install this, the app will send mail to the mode inbox telling them that it is successfully installed and also that a wiki page called. **trivia_config** has been created.  
Mods can change the app logo, app name and app questions on the **trivia_config**.  
### How configuration works
- `post_title` The title of the post that the app will create.  
- `name` The app name for the sub it will be displayed on top of the logo.  
- `logo` The logo of the app on the installed sub.  
- `start_text` A text that will display on the button that starts the trivia game.  
- `community_url` A link to guide users for to the community.  
- `community_url_text` text that you display over community url.  
- `text_color` text color for title and questions
- `background_image` background image for the app it should be url
- `questions` A list of objects that represent questions. Each question objects should have question, 4 choices and also should have correct answers inside it like that:  
This for text question 
```
{
"question":"Which drink contains caffeine ?",
"choices":["Mineral water",
"Orange juice",
"Coffee",
"Beer"],
"answer":"Coffee"
"type":"text_question"
}
```
And for image question like this  
```
"question":"What image represent Eiffel Tower",
"choices":[
{
"url":"https://preview.redd.it/china-wall-v0-btsaryjkif5e1.jpeg?auto=webp&s=5e71199953417b84000413a806b6cf449e808df5",
"title":"China wall"
},
{
"url":"https://preview.redd.it/japan-tower-v0-jg5byr3gif5e1.jpeg?auto=webp&s=499bc2642a979e7b96dda73bf052c6f7346c6a12",
"title":"Jappan Tower"
},
{
"url":"https://preview.redd.it/effel-tower-v0-qciyhcoiif5e1.jpeg?auto=webp&s=fecea6eb776a332593d19c61e1c72bd818f8620b",
"title":"Eiffel Tower"
},
{
"url":"https://preview.redd.it/borj-khalifa-v0-8leo72vdif5e1.jpeg?auto=webp&s=39d67aafec7a74d9c2bd489f9c7e8d3335911a1d",
"title":"Burj Khalifa"
}],
"answer":"https://preview.redd.it/effel-tower-v0-qciyhcoiif5e1.jpeg?auto=webp&s=fecea6eb776a332593d19c61e1c72bd818f8620b",
"type":"image_question"
```
You can check this picture to understand how the configurations will work :  
![Guide](https://preview.redd.it/9xc2pb482xzd1.png?auto=webp&s=1b122ae13703de1822ae064616e384c78b5ec19e)
- 1:`post_title`.  
- 2:`name`.  
- 3:`logo`.  
- 4:`start_text`.  
- 5:`community_url_text`.  
### Levels :
The game has 3 levels :
- `Easy` users will get only 5 questions.  
- `Medium` users will get 10 questions.  
- `Hard` users will get 20 questions.  

### Future updates :

We plan to add maps and pictures to make the game more fun.

### Changelog
- v0.3
   - First version of the app Mods can't change questions. Players can't choose level.
   - The App don't send notification when it get installed.
- v0.6
   - Added way for players to choose level (Hard , Medium , Easy ) and each level loads different number of questions.
- v0.7
   - Mods can change questions to load .
   - Mods can change app name and app logo.
   - Mods can add url to direct users to their community.
   - When The app get installed, it create wiki with preloaded answers.
   - When The app get installed or updated, it starts mods discussion.
- v0.10
   - Mods can change title for the post that the app will create.
   - Mods can change community url text.
   - The App send mail on inbox instead of creating mod conversation.
   - Fixed the read me and added a GIF to show how the app works. 
- v0.11
   - Mods can set background image and text color that match with it. 
   - Now the game support images questions
