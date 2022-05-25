# The Evolution of Monsterbot - A Case Study

Monsterbot is a Discord Bot to support the playing of [Monster of The Week](https://www.evilhat.com/home/monster-of-the-week/) (MOTW) a tabletop role playing game. It was built during the pandemic when, like most of us, I had a lot of time on my hands and was trying to stay sane. I'm really proud of how it turned out. My friends and I use it to this day.

Technically, it was also an incredible learning experience. It's the only project I've worked on in which I was the sole project owner, solo developer, devops of one, and a user. I also got a front seat to all my friends using the bot, which is a rare, humbling, and extremely educational experience. Lastly, as the scope of Monsterbot wildly expanded, I got to work with a lot of technologies that I'd been excited about for a while. 

Here's what I did and what I learned doing it.

## A Bot is Born

![How it started, How it's going...](https://monsterbot-images.s3.amazonaws.com/how_it_started.png)

In our first days of playing MOTW, we'd be enraptured in the story unfolding before us until someone wanted to do something that required a *move*. A move is how the game introduces challenge and uncertainty into our story by making a player roll using some relevant stat modifiers to see what happens. But we were new to the game and unfamiliar with moves. So at these heighted moments we'd typically need to dig in the manual for a while to figure out a) what stat we modify our roll with and b) what type of outcome we'd get based on that roll. 

That process is not a big deal and is pretty simple for Monster of the Week compared to a lot of systems (looking at you, D&D). But playing remotely, that little hiccup just added to the list of other distractions which take away from the excitement and escape of RPG's. 

So in the first draft of this bot, all I wanted to do was remove that pain point by allowing a user to enter their character's stats beforehand, use those stats to modify the totals from their rolls, and use those totals to determine the move's outcome automatically.

### Version 1

Discord documentation was pretty friendly and there's a fantastic Node module for Discord called [discord.js](https://discord.js.org/) which made life easier, so I was able to get something built before our next game. These are the steps of a successful interaction:

1. A user would enter a command with our Discord designated prefix of `.m` followed by the move they wanted to make (`.m investigate a mystery` or to be more user-friendly `.m iam`).

2. Our Node.js server, which has registered with Discord, receives a notification of the command through websockets.

3. The server determines which move the user is requesting, determines which stat should modify that move, looks up that user's stat in DynamoDB, rolls two randomized "dice", and gets the corresponding outcome for that move.

4. Node.js server then sends a message to Discord with that outcome.


![Investigate A Mystery](https://monsterbot-images.s3.amazonaws.com/iam.png)

*Blake investigates a mystery. (Blake has 0 sharp so there's no additional help there.)*


![V1 Architecture](https://monsterbot-images.s3.amazonaws.com/v1_architecture.png)

*Pretty straightforward bot architecture... so far.*

### Version 2

Monsterbot was a hit! Our game was humming along and players had lots of ideas. 

"Do you think it could track how much damage we've taken? What about our inventory? What if we all wrote a quick account of what happened at the end of each session and then it bundled them and reminded us at the beginning of our next one?" 

"...Definitely."

![Check stats](https://monsterbot-images.s3.amazonaws.com/stats.png)

*Adolphus checks his stats.*

But one thing was bugging me - MOTW has eight basic moves, which were now in our bot. But there's also specialized moves for each individual playbook and custom moves in expansion sets and various homebrews. Overall, there's hundreds of non-basic moves! And each time we'd use one of those, back into the manual we'd go and the action would come to a screeching halt.

I was not eager to do days of manual data entry for this and wanted a solution that was dynamic to accomodate new moves being created without me having to update a database. My first thought was to allow for move creation through the Discord bot but there's a lot of options and data involved with moves and the Discord APIs aren't really built with that in mind. It wouldn't be impossible - just clunky.

So... I figured I'd build a quick (ha!) website for the creation, editing, and updating of custom moves. And since I wasn't really sure how much it'd get used and because I wanted to play with some fun toys, I made that site's backend serverless rather than just building another node.js API I'd have to host.

For version two, here's a successful interaction:

1. A user comes to our new fancy React JS site, [monsterbot.io](https://monsterbot.io), and authenticates through Discord, giving us access to their Discord user info.

2. They create a move using the form on our page, which stores the move name, possible roll-based outcomes, stat modifiers, etc. 

3. On submission, our site makes a POST request to our API Gateway, is authenticated and processed by our Lambda, and ultimately stored in DynamoDB.

4. In the Discord app, the user can now access that move by adding an exclamation point to the custom command name they gave it, treating it otherwise like one of the basic moves. (`.m ! specialmove`).

![Wes uses a special move](https://monsterbot-images.s3.amazonaws.com/special_move.png)

*Wes (poorly) rolls one of his specialized moves created on monsterbot.io.*

![Version 2 arch](https://monsterbot-images.s3.amazonaws.com/v2_architecture.png)

### Version 3

The bot was pretty functional now and was even being used by some other MOTW groups! The custom commands were a big upgrade but a couple of things about the approach still bugged me.

1. It's not easy to type `.m ! specialmove` in the heat of battle! There were many failed attempts and much fat-fingering which led our bot to cry out in confusion about what command was being requested. 

2. Now that there were other groups using this, someone could create a command that could show up on our server. What if someone else wanted to create a move called `specialmove`? What if someone put some bad content in there and it winds up on our server?

Enter slash commands.

As I was grappling with the above issues, Discord [announced the release of slash commands](https://discord.com/blog/slash-commands-are-here). This was the answer!

By typing `/` into Discord, you'd now get a list of available commands which continue to narrow as you type more of the desired command's name. Slash commands present you with optional parameters and validate your request before firing off a request to a bot. Issue 1 (fat-fingering) solved!

For issue 2? Slash commands also accomodate the dynamic creation of custom commands for a single Discord server. In other words, one of our player's can create a move and have it only available to us! Problem 2 solved... as soon as I come up with a technical solution.

This took some real work. I had to restructure and migrate my data in DynamoDB to accomodate both a partition key (the discord server's id) and primary key (the move's id). And Slash Commands were such a fresh feature that Discord.js did not yet handle their consumption or creation so I had to build that integration from scratch. Though slash commands and standard commands shared some fields, the object shape was different, requiring a lot of refactoring. Typescript interfaces have never been more helpful.

Lastly, I was hesitant to add a bunch of code connecting with this new Discord API to my existing Lambdas responsible for CRUD operations to my "Moves" table in DynamoDB. It seemed clunky and a little outside of what we'd desire for a separation of concerns. Instead, I added a Kinesis stream to watch our Moves table and fire off a Lambda when those operations occured and we needed to reach out to Discord for the creation/updating/deleting of a new slash command.

For Version 3, our happy path is:
1. A user comes to our old fancy React JS site, [monsterbot.io](https://monsterbot.io), and authenticates through Discord, giving us access to their Discord user info.

2. They create a move using the form on our page, which stores the move name, possible roll-based outcomes, stat modifiers, etc.

3. On submission, our site makes a POST request to our API Gateway, is authenticated and processed by our Lambda, and ultimately stored in DynamoDB.

4. On move creation in DynamoDB, a Kinesis Stream sends the event to a Lambda, which processes it and makes a request to Discord to create a custom command for that server only.

5. In Discord, the user can now access that move with a slash command which automatically populates in the app!

![demo of slash commands](https://monsterbot-images.s3.amazonaws.com/slash_command.gif)

![v3 architecture](https://monsterbot-images.s3.amazonaws.com/v3_architecture.png)

## Lessons Learned and Next Steps
Working on Monsterbot has been a fun way to give a little gift to my friends, work on some new technologies, meet some other people interested in RPG's, and keep myself sane during the pandemic. I've stepped away from it for a bit while other priorities have taken over - a more demanding role at work and a brand new baby! But I'd love to circle back to it at some point to get a few more things done.

- **Get more users.** Right now, it's a few select groups using Monsterbot who reached out to me based on a single reddit post I made in 2020. I'd like to try to generate some more traffic to the bot and get some more users. It's really fun to get messages and screenshots from other users and makes me feel like a part of a community.

- **Clean up the serverless structure.** I learned a ton about AWS working on this - working with S3, Route 53, API Gateway, Lambda, Terraform, Kinesis, Cloudfront, Cloudwatch, EC2, IAM, and more. If I had the time, I'd like to clean up my Lambda structure. Right now, each endpoint (GET moves, POST moves, etc) has its own Lambda. Even using Terraform and automated deploys, it's really clunky. Updating a model or logic typically has to be done across multiple Lambdas. I'd like to move to one Lambda per resource (a Moves Lambda, a User Lambda, etc) in a sort of Lambda-as-a-microservice pattern to simplify that.

- **Monetize a tiny bit.** I want the bot to be mostly free. After all, it gives me joy to see people using it! But a couple bits of functionality are a little costly storage-wise and they could probably use a little more developer attention. So I was thinking of making custom slash commands and recaps "premium" subscription features either through Stripe or Patreon.

- **Can Monsterbot make monsters?** I've got a dream of tapping into some of the very exciting developments in AI to generate monsters for Monster of the Week, complete with AI-created descriptions and stat blocks. [AI Dungeon](https://play.aidungeon.io/) is already doing some very cool stuff in this space but I'd love to play more with the technology. This would definitely be a premium feature.