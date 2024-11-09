## World trivia
This app is multichoice game, mods can install it and add it to their subs then peoples can practice and play and see their score.  
you can see bellow how tha app work
![Game](https://s11.gifyu.com/images/SyQhA.gif)

### How it works :

After mods install this, the app will send mail to the mode inbox telling them that it is successfully installed and also that a wiki page called **trivia_config** has been created.  
Mods can change app logo, app name and app questions on the **trivia_config** 
### How configuration works
- `post_title` The title of the post that the app will create
- `name` The app name for the sub will display on top of the logo
- `logo` The logo of the app on the installed sub
- `start_text` A text that will display on the button that starts the trivia game
- `community_url` A link to guide users for to the subreddit community
- `community_url_text` text that you display over community url
- `questions` A list of objects that represent questions. Each question objects should have question, 4 choices and also should have correct answers inside it like that:
```
{
"question":"Which drink contains caffeine ?",
"choices":["Mineral water",
"Orange juice",
"Coffee",
"Beer"],
"answer":"Coffee"
}
```
You can check this picture to understand how the configurations will work :
![Guide](https://preview.redd.it/9xc2pb482xzd1.png?auto=webp&s=1b122ae13703de1822ae064616e384c78b5ec19e)
1- `post_title`
2- `name`
3- `logo`
4- `start_text`
5- `community_url_text` when you click it it take you to `community_url`
### Levels :
The game has 3 levels :
- `Easy` users will get only 5 questions
- `Medium` users will get 10 questions
- `Hard` users will get 20 questions

### Future updates :

We plan to add maps and pictures to make the game more fun.

### Changelog
- v0.3
   - First version of the app Mods can't change questions player can't chose level
   - App don't send notification when it get installed
- v0.6
   - Added way for player to chose level (Hard , Medium , Easy ) and each level load different number of question
- v0.7
   - Mods can change question to load 
   - Mods can change app name and app logo
   - Mods can add url to direct users to their community
   - When app is installed it create wiki with preloaded answers
   - When app get installed or updated it start mods discussion
- v0.9
   - Mods can change title for the post that the app will create
   - Mods can change community url text 
   - App send mail on inbox instead of creating mod conversation
   - Fixed the read me and added a gif to show how the app work 
