# QA Engineer Assessment

## Introduction

This is the FedEx Digital International QA Engineer assessment. 
The purpose is to give us insight in your technical abilities, development approach and general technical working habits. 
We view your performance on this assessment as indicative of the work you will deliver as a QA Engineer.

Good luck!

## Tips

* No more than three to four hours should be needed to demonstrate your skills with this assessment.
* You are free to refactor and restructure anything in the project if you think that makes sense.
* Do not hesitate to contact us in case you get stuck or instructions are unclear.
* Note that the sourcecode of the application is running on your machine. 
  You have full freedom to make your test code as efficient as possible.

## The App

Welcome to our Star Wars Search web application!

### Features
- Search for character.
- Search for planet.

### Requirements

* Search for character:
    * When you search for a character, and it’s a valid one, then you should be able to see the “Gender”, “Birth year”, “Eye color” and “Skin color” properties.
    * When you search for a character, and it’s not a valid one, then you should be able to see “Not found” in the results.

* Search for planet:
    * When you search for a planet, and it’s a valid one, then you should be able to see the “Population”, “Climate” and “Gravity” properties.
    * When you search for a planet, and it’s not a valid one, then you should be able to see “Not found” in the results.

* When results are shown for a search action, searching with an empty search input field will clear the search results (previous results are removed).
* Searching can be performed by either clicking the “Search” button or by pressing the `Enter` key on the search input field.
* You can have more than one results, for both Planets and Names (partial matching)

### Live Backend Service
The application relies on the [SWAPI (Star Wars API)](https://swapi.tech/documentation) to function. 
It's important to note that this particular service is not managed by **your** team, which means that there is no guarantee on its availability at all times.

This means that your tests should not depend on the availability of any external resource.

## Implementation

### Tasks
- Develop tests ensuring coverage for all stated requirements.
- Considering the complexity of interactions in a microservices environment, 
  how would you balance integrated end-to-end testing with the need to maintain rapid development and deployment cycles?
- Propose a robust strategy or implementation plan to manage potential inconveniences occasioned by downtime or inaccessibility of any external resource.
- Consider generating concise and informative reports.
- Document the key decisions and trade-offs.
- Creating a GitHub Action, even though not required, is always appreciated.

### Feedback

After completion, push your work to GitHub and provide us a link. 
Alternatively zip your project, exclude the `node_modules` folder, and email it to us.

> Your solution will not be kept after the assessment and will not be used by FedEx Digital International for other purposes.
