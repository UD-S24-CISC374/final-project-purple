# Schedulsine


## Elevator Pitch


Schedulsine is a fast-paced, management-style cooking game where you need to run your kitchen like a CPU. Just as the OS needs to strategically schedule jobs to run on the CPU, you will need to schedule which dishes to prepare in order to optimize your profit. Players will be taught about famous OS job scheduling algorithms by actually implementing them in the context of a Gordon Ramsay-style kitchen environment. Once they have the knowledge, they can go on to compete and see who can schedule the best.


## Influences (Brief)


- Overcooked:
- Medium: Game
- Explanation: Overcooked perfectly simulates the fast-paced environment of a kitchen brigade. Although our game is not focused on the intricacies of cooking, we are influenced by the overall perspective it provides of the entire kitchen situation. It provides timers for each ticket, which makes time a primary aspect of the game, similar to how time is a primary aspect of most scheduling algorithms. We hope to carry over a similar high-intensity feeling.
- Cooking Simulator:
- Medium: Game
- Explanation: Cooking simulator using some ideas that we would love to implement within our game. Some of these include the ticket system, which has all the orders in a very clean, queue-like mechanism. They also have a rating system which is satisfying and a direct reflection of the person's performance, which is something we want to mirror in our game regarding runtime or turnaround time performance.
- Hell’s Kitchen:
- Medium: Television Series
- Explanation: Hell’s kitchen is the epitome of the stereotypical fast-paced, high-stress cooking situation. While we do not want to make the player feel bad, it would be interesting to include a comically-tough feedback system when a player makes a mistake, simulating Gordon Ramsay’s insults in a SFW and topic relevant manner.
- Cooking Dash:
- Medium: Game
- Explanation: The game opens up with a comical preview of the character and just some insight as to more or less what is happening in the game. As the intro ends it opens up with the character taking a position from the comic and letting the person who wants to play know what the character is going to do. We would like to implement this in a way to introduce the algorithm required to play out game Schedulsine.


## Core Gameplay Mechanics (Brief)


- Player assigns part of a dish to a station
- After player finishes all dishes, they receives a metric report of their performance
- Player decides whether or not to take a dish ticket based on the algorithm
- Player is penalized if they choose the wrong dish/mess up the order
- Dish needs all parts to be completed before counted as done
- Rewarded based on consistent correct completed orders in a row.
- They get a profit (score) based on their overall metric
- Online ranking system so students can be in a challenge
- Player loses the shift after a set amount of mistakes 


# Learning Aspects


## Learning Domains


OS scheduling algorithms.


## Target Audiences


- Novice system programmers who have a basic understanding of what the CPU is
- Appropriate for people who are interested in how computers decide on running processes


## Target Contexts


- Could be assigned as an additional practice tool for students to study the algorithms
- Tool to competitively practice scheduling algorithms


## Learning Objectives


- Write Steps: After playing, students will be able to write out the steps of an OS scheduling algorithm.
- Use Case: After playing, students will be able to justify why a certain algorithm would be used over another.
- Define Quantum: After playing, students will be able to define what a quantum is in the context of OS scheduling algorithms.


## Prerequisite Knowledge




- Prior to playing, students should be able to define the concept of scheduling jobs on the OS.
- Prior to playing, students should be able to describe the concept of an algorithm.


## Assessment Measures


A pre- and post-test will be given in the format of a job tracing worksheet.
- The worksheet tells them to trace which job is on the CPU at a certain time
- The algorithm they need to follow is given in name only


# What sets this project apart?


- Our game teaches algorithmic concepts with no requirement of pre-requisite coding knowledge and requires no coding in the game at all.
- The game will be quite quirky and humorous, providing funny audio snippets when a player messes up or does well.
- The concept of deciding which dishes to cook in an industrial kitchen maps to the decision an OS needs to make when deciding which job to run.


# Player Interaction Patterns and Modes


## Player Interaction Pattern


Only one player interacts with the system at a time. This player is the one who selects which orders (jobs) to run in the kitchen, and who decides which station the subcomponents of the dish go to. Essentially, they have full control of the system, alone. 


## Player Modes


- Main Menu: Player is able to select from various game modes, a rudimentary settings menu, a global leaderboard view, as well as an exit button to leave the game.
- Tutorial: Demonstrates the basic mechanics of the game without teaching a scheduling algorithm. Shows the player how to schedule dishes, how to complete their various components, and finally how to send them off to the dining room. This mode is only accessible from the menu.
- Career: The main game mode. This will take the player through a week of restaurant service, where each day covers a different scheduling algorithm.
- Competitive: The sandbox mode where the player is not instructed to follow a certain algorithm, but left to their own devices. The profit (calculated from their metrics) will be added to a global leaderboard (database) to introduce a competitive aspect.


# Gameplay Objectives


- Gain a profit after a shift:
- Description: Failure to deliver a dish in accordance with the respective scheduling algorithm, or failure to make the dish properly will result in a loss of profit, potentially going negative. By following the algorithm correctly, the player will be able to end the shift with a positive profit.
- Alignment: Gaining a profit primarily reflects the player’s ability to understand and implement the scheduling algorithm.
- Advance to the next day:
- Description: If the restaurant does not make a profit with the given algorithm, the player will have to repeat that shift (day) via performing another service using that algorithm.
- Alignment: By advancing the days, the player is able to follow the algorithm correctly, and therefore most likely grasps its concepts.
- Beat your best score (profit):
- Description: In the competitive mode, players will have free-reign to manage their dish scheduling in order to achieve the best profit.
- Alignment: By granting players this freedom to mix and match techniques, they will start to see certain use cases for scheduling algorithms, and why some might be favored over others.


# Procedures/Actions


Besides typing in their username, players will use their pointer to primarily interact with the game. These interactions include:
- Clicking through the talking head text/cutscenes to read information about a certain algorithm
- Dragging parts of a dish to different stations
- Dragging from one station to another to transfer a part of a dish
- Clicking and dragging a ticket to the “CURRENT ORDER” area to change which dish you are currently working on (which job you are running)


# Rules


- If a player drags the wrong ticket to the “CURRENT ORDER” section, their profit goes down (in career mode)
- If a player drags a part of a dish to the wrong station, their profit goes down
- If a player successfully completes a dish, their profit goes up
- If a player completes a dish out of order, their profit goes down (in career mode)
- The new ticket(s) that appear when a dish is completed will be randomly chosen in no specific order, as it is the job of the scheduler (the player) to choose the order


# Objects/Entities


- Ticket line which represents the queue of jobs lined up to be scheduled by the OS
- A single ticket entity, which lists components of the dish it tells you to make
- A stove entity, which can only complete parts of a dish that require it
- An oven entity, which can only complete parts of a dish that require it
- A cutting-board entity, ‘’
- A sink entity, ‘’
- A fridge object, which contains all possible meats you need for dishes
- A pantry object, which contains all other possible ingredients you need for dishes
- A metric report object, which tracks the dish response and turnaround time of your scheduling
- A few chef entities, which autonomously move to the stations you have parts of dishes assigned to
- A service table entity, which is where you drag the final project to be checked
- A waiter entity, which runs up and grabs the food you put on the service entity
- A talking-head entity, which provides you exposition and occasional hints/instructions
- A dish object, which has a list of required dish components
- A dish component object, which has a duration till completion field and required station


## Core Gameplay Mechanics (Detailed)


- *Core Gameplay Mechanic #1*: *Describe in 2 paragraphs or less, along with how it generally works*
- *Core Gameplay Mechanic #2*: *Describe in 2 paragraphs or less, along with how it generally works*
- *Core Gameplay Mechanic #3*: *Describe in 2 paragraphs or less, along with how it generally works*


  
## Feedback


- Completing a dish successfully will play a cash register “cha-ching” type sound
- A component finishing at a station will play an alarm sound, since it's essentially a timer
- The manager talk-head will look pleased when a dish a finished correctly
- Failing a dish or its components will trigger a Gordon Ramsay insult generated via AI
- The manager will look angry when you make a mistake, and provide a pseudo-hint on what went wrong
- Longer-term
- player will receive a report of their scheduling metrics in terms of dishes as well as the profit from that day’s shift
- at the end of the “week”, player will receive an overview of their metrics and total profit gained, as well as a position on the leaderboard if playing in competitive mode


# Story and Gameplay


## Presentation of Rules


The tutorial mode will briefly show players how to complete two dishes, pointing out the steps they need to follow, such as dragging the ticket to the current order area, and dragging the individual components to different stations. 


## Presentation of Content


The presentation of the algorithms will be covered in the career mode in a learn-as-you-go fashion. A talking-head (which looks like an angry chef) will give a brief overview of what you need to do, and the player will receive instant feedback from them when they mess up (such as scheduling the wrong dish).


## Story (Brief)


You’re the new head chef at a Michelin star restaurant in the heart of silicon valley. Your manager, who is a sucker for theory scheduling proficiency, wants to test out some classic scheduling algorithms in the restaurant to see what turns the most profit.


## Storyboarding


[image1]
[image2]
[image3]


# Assets Needed


## Aesthetics


The game should have a bustling, fast-paced, yet upbeat feeling. This will encourage the players to try their best to schedule correctly so they do not break up the flow of the aesthetic. By abiding by this aesthetic, we hope the game will somewhat emulate the stressful environment of a kitchen mixed with lighthearted fun and goofy music and sprites.


## Graphical


- Characters List
- Restaurant manager: Talking head which instructs you to follow certain scheduling algorithms.
- Chefs: A collection of generic looking chef sprites which will walk autonomously towards stations that you designate parts of the dish to.
- Waiter: Sprite who will walk up to the service area to retrieve the finished dishes.
- Textures:
- Restaurant manager face
- Chef spritesheet
- Waiter spritesheet
- Food sprites
- Food component sprites
- Station timer UI texture
- Ticket texture
- Environment Art/Textures:
- Kitchen station textures
- Kitchen floor texture
- Background for visible area outside the kitchen


## Audio


- Music List (Ambient sound)
- Main menu: *Example 1*, *Example 2*
- Tutorial: *Example 3*, *Example 4*
- Career:
- Competitive: 
- Sound List (SFX)
- Stove: *Example 1*, *Example 2*
- Oven: *Example 3*, *Example 4*
- Pantry rummaging:
- Chopping: 
- Washing:
- Profit sound:
- Mistake sound:
- Manager grumble:
- Ticket pull:


# Metadata


* Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
* Version 0.0.3




