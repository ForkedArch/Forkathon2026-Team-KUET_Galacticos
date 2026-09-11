<img src="https://i.ibb.co.com/7NrtB6Vv/image.png" />
#Forkathon 2026: [AskFlow] by [KUET_Galacticos]

 **Built for ForkedArch Freshers Hackathon 2026**
 
**👥 Team :**

| Name                     | Roll      | Department | GitHub            |
| ------------------------ | --------- | ---------- | ----------------- |
| Md. Arman Shahriar Rupom | 2K2507001 | CSE        | @Rupom2007        |
| Abhijit Adhikary         | 2K2507003 | CSE        | @abhijit-adhikary |
| Maliha Fairoz            | 2K2507089 | CSE        | @malihafairoz14   |
| Mishuk Kumar Sarker      | 2K2507018 | CSE        | @mishukdevs       |

---

## ❔ Problem
### Problem Statement :
> The Silent Classroom

The teacher asks a question.
Silence.

Not because nobody understands it—but because half the room is afraid to raise their hand. Some students don't want to look confused. Some don't want to interrupt. Others have questions that are completely different from what everyone else is thinking.

After class, suddenly everyone has questions.

And you discover that many people were confused about the exact same thing.

Maybe create a simple system that helps students ask questions and share doubts in a classroom or learning environment.

Post a question.
Browse questions from others.
Search for similar questions.
Upvote questions they also want answered.
Mark questions as answered or unresolved.

You could allow questions to be associated with a course, topic, chapter or class.

Think about how can you help students who are too shy to ask a question publicly—and how can you prevent the same question from being asked again and again?

A basic version only needs question posting, categories, search/filtering, and voting. More advanced teams could experiment with anonymous questions, teacher responses, tags, duplicate detection, or reputation systems.

### 🤔 [KUET_Galácticos]'s Understanding :
**The Main Issue:**

Students stay quiet during class because they are nervous to speak up in front of others. Teachers think the class understands the lesson when it is actually just quiet. After class, students realize that many of them had the exact same question.<br><br>
**Experience:**

As I (Rupom) am a student of CSE department. I am very introvert. We have some theoretical courses like Physics, Discrete Math, Structure Programming. Sometimes I don't understand what the teacher is teaching us but I can't ask anything to the teacher because of my shyness. For this I need to work hard later to understand the problem.
**Our Main Goal:**


Create a clean, simple tool for classes where any student can post a doubt without feeling judged, vote on other students' questions and save their valuable time.
**Basic Features:**

1. **Ask a Question:** 
Let students write and submit their doubts.
2. **Organize by Topic:** 
Group questions by class, subject, chapter, or topic.
3. **Browse and Search:** 
Help students quickly find past questions before posting a new one.
4. **Upvote System:**
Let students click "upvote" on a question if they also want to know the answer.
5. **Status Tag:** 
Show whether a question is answered or still open.

**Extra Features for Better Experience:**
1. **Anonymous Posting:** 
Allow students to hide their names so they feel completely safe asking anything.
2. **Duplicate Warning:** 
Warn users if a similar question has already been posted.
3. **Teacher Answers:** 
Give teachers an easy way to reply directly and highlight the best answers.

---
## 💡 Our Solution
### Overview
We will make a QnA environment where students can ask questions to their teachers anonymously.
### How It Works
Explain the complete flow of your system.
1.
2.
3.
---
## 🏗️ Architecture :

```text
+-------------------------------------------------------+
|                     auth.users                        |
+-------------------------------------------------------+
           |                                     |
           v                                     v
+-------------+                       +-------------+
|  students   |                       |  teachers   |
+-------------+                       +-------------+
           |                                     |
           | (asks)                              | (teaches)
           v                                     v
+-----------------------+             +-----------------+
|       questions       | <---------- |     courses     |
+-----------------------+             +-----------------+
        |               |
        | (has replies) | (has votes)
        v               v
+-----------+   +-----------+
| messages  |   |   votes   |
+-----------+   +-----------+
        |
        v
+-------------------+
|   notifications   | --> (alerts users)
+-------------------+

<b>Forkathon: Freshers Hackathon 2026 presented by ForkedArch powered by XtendArena</b>
