## Project Motivation and Description
There are times when students need help locating their required classrooms. For example, the first day of a semester can be overwhelming, and part of that often comes from the worry of not being able to find a classroom on time. At its core, Runner Maps is a mobile application that provides both outdoor and indoor navigation for the campus of the California State University of Bakersfield. With a campus size of 375  acres in mind, this project could help serve the 12,000  students, staff, and faculty on a day to day basis. This project has the potential to help not only the population today, but also the future occupants and visitors as well. This project is the first project to bring to life a simple solution to this authentic navigation challenge on campus grounds. With a simple search on the application, users can now locate the target classrooms with specific directions.

Runner Maps is the perfect application for students to guide themselves from class to class without the worry of getting lost. Runner Maps accomplishes this by allowing users to search for a certain room in a certain building. Then, the application gives them step by step directions, along with visuals, and assists users to their classrooms. Runner Maps utilizes outdoor navigation to access where the users are located on the campus and will help guide them to the building to which they wish to go. Similarly, once inside the building, users will have the option to receive directions on where to go next, each step leading them closer to the classroom, until finally reaching their destination.

The application can cater to a broad audience. There are often students, new employees, and visitors disoriented by the size and complexity of the campus when in search of a desired location. With a simple search on a free application, users can obtain helpful information quickly, which saves time in their navigation to these places.

Runner Maps is needed on CSUB’s campus. Students deserve a navigational tool that will allow them to get anywhere on campus without getting lost. Runner Maps solves the problem of students not having a quick way to evaluate how to get to their destination upon arrival on campus. This application will ensure that students are well informed and guided the moment they step on CSUB’s campus.


## Architecture of the Project

The first component is a web application to manage rooms and users. It is a web application using PHP for the front end and PHP for the back end, which will serve the REST endpoint that performs CRUD operations against a SQL database. The next component is a mobile application, which has a front-end built with React Native and a backend written in PHP. The PHP endpoint will perform CRUD operations on a SQL database. Odin will host the backend for both applications. To facilitate the scalable creation of floor plans, a visual designer has been developed. After designing the floor plan using this tool, it can be exported as a JSON file and inserted into the database through the web admin forms application. This streamlined process enables efficient management of floor plans within the system.
<div align="center">

**Infrastructure**

![](/images/infrastructure.png)
</div>

## Features

### Splash Screen

Our splash screen is the first look into our app for our user. This screen pops up when the user launches our app. This captures the attention of users with our logo while the application loads in the background.
<div align="center">

**Runner Maps Splash Screen**

<img src="/images/Runner%20Maps%20Splash%20Screen.png" height="500">

</div>



### Outdoor Navigation

1. Outdoor Navigation Screen

For the outdoor navigation, the user has the ability to navigate there by clicking the bottom tab labeled "Outdoor Navigation." When the user clicks this tab, they are directed to a page where they can search for their desired building on CSUB's campus.

<div align="center">

**Outdoor Navigation Loading Screen**

<img src="/images/Outdoor%20Navigation%20Loading%20Screen.png" height="500">
 </div>

<div align="center">

**Outdoor Navigation Search Building Options**

<img src="/images/Outdoor%20Navigation%20Search%20Building%20Options.png" height="500">

 </div>
 
<div align="center">

**Outdoor Navigation Route Overview**

<img src="/images/Outdoor%20Navigation%20Route%20Overview.png" height="500">

</div>

### Indoor Navigation

1. Home Screen

The home screen of the mobile application, serves as the central hub for users to search for classrooms or specific target locations. The home screen also includes a filter option that allows users to refine their search based on services and buildings. Once the user has selected their desired location, they are presented with two navigational options: indoor and outdoor. By choosing indoor navigation, the user is directed to the indoor navigation screen, with the selected target location data being automatically transferred. The same process applies for the outdoor navigation option; upon selection, the user is taken to the outdoor navigation screen, and the relevant information is sent to that screen as well. This seamless transition between indoor and outdoor navigation ensures a smooth user experience.

<div align="center">

**Mobile Application Home Screen**

<img src="/images/Mobile%20Application%20Home%20Screen.png" height="500">

 </div>
<div align="center">

**Mobile Application Home Screen Filter**

<img src="/images/Mobile%20Application%20Home%20Screen%20Filter.png" height="500">
 
 </div>

2. Indoor Navigation Screen

The indoor navigation screen is designed to assist users in selecting both their starting point and destination within a building. Upon initiating the navigation process, the system determines whether the start and destination locations are situated on different floors. If they are, a pop-up window appears, asking users to choose their preferred method of traversing between different floors, such as stairs or elevators. Conversely, if the locations are on the same floor, the system directly provides the most efficient indoor navigation directions for the user. This user-friendly design ensures a personalized and effective navigation experience.
<div align="center">

**Mobile Application Indoor Navigation Screen**

<img src="/images/Mobile%20Application%20Indoor%20Navigation%20Screen.png" height="500">
</div>
<div align="center">

**Mobile Application Indoor Navigation Screen Pop Up Multi level floor navigation**

<img src="/images/Mobile%20Application%20Indoor%20Navigation%20Screen%20Pop%20Up%20Multi%20level%20floor%20navigation.png" height="500">
</div>

3. Indoor Navigation Result Screen

The result screen appears after the engine has successfully calculated the shortest path between the user's starting point and destination. This screen displays the distance between checkpoints and provides a preview of the upcoming paths, offering users additional information to help them reach their desired location. An array and an index counter are utilized to efficiently manage the checkpoint transitions, ensuring a smooth and informative navigation experience.

<div align="center">

**Indoor Navigation Result Screen**

<img src="/images/Indoor%20Navigation%20Result%20Screen.png" height="500">
 </div>

4. Accessibility Features

The accessibility features for the mobile application cater to a diverse range of users. These options include audio-based navigation for indoor navigation results, allowing users to choose primary and secondary background colors, and supporting a tertiary background color as well. Furthermore, the app accommodates changes in text color and font size to enhance readability and overall accessibility. These comprehensive features ensure that the mobile application is user-friendly and inclusive for all users.

<div align="center">

**Settings Screen Accessibility Features**

<img src="/images/Settings%20Screen%20Accessibility%20Features.png" height="500">
</div>

5. Visual Designer

The Visual Designer is a web application designed to streamline the creation of floor plans, ensuring scalability. With just a click of a button, users can easily add walls and room locations to their designs. The application also features a testing capability that utilizes the same engine as the mobile. By testing the grid within the Visual Designer, users can be confident that their floor plan will function seamlessly within the mobile application.
<div align="center">

**Web Visual Floor Plan Designer**

<img src="/images/Web%20Visual%20Floor%20Plan%20Designer.png" height="500">
</div>
