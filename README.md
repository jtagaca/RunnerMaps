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
 ![](RackMultipart20230531-1-3m5ncx_html_ab50dd5233f7a3dc.png)
</div>

### Indoor Navigation

1. Home Screen

The home screen of the mobile application, serves as the central hub for users to search for classrooms or specific target locations. The home screen also includes a filter option that allows users to refine their search based on services and buildings. Once the user has selected their desired location, they are presented with two navigational options: indoor and outdoor. By choosing indoor navigation, the user is directed to the indoor navigation screen, with the selected target location data being automatically transferred. The same process applies for the outdoor navigation option; upon selection, the user is taken to the outdoor navigation screen, and the relevant information is sent to that screen as well. This seamless transition between indoor and outdoor navigation ensures a smooth user experience.

<div align="center">

**Mobile Application Home Screen**
 ![](RackMultipart20230531-1-3m5ncx_html_38e3f44b68d0d7a7.png)
 
 </div>
<div align="center">

**Mobile Application Home Screen Filter**
 ![](RackMultipart20230531-1-3m5ncx_html_51592f60c85d6271.png)
 
 </div>

2. Indoor Navigation Screen

The indoor navigation screen is designed to assist users in selecting both their starting point and destination within a building. Upon initiating the navigation process, the system determines whether the start and destination locations are situated on different floors. If they are, a pop-up window appears, asking users to choose their preferred method of traversing between different floors, such as stairs or elevators. Conversely, if the locations are on the same floor, the system directly provides the most efficient indoor navigation directions for the user. This user-friendly design ensures a personalized and effective navigation experience.
<div align="center">

**Mobile Application Indoor Navigation Screen**
 ![](RackMultipart20230531-1-3m5ncx_html_f0074b6e3462c3b1.png)
 </div>
<div align="center">

**Mobile Application Indoor Navigation Screen Pop Up Multi level floor navigation**
 ![](RackMultipart20230531-1-3m5ncx_html_e80b55689fab77e1.png)
</div>
To facilitate indoor navigation, the mobile app employs an engine that utilizes Dijkstra's algorithm to determine the shortest path. This engine is integrated directly into the app to ensure minimal latency when initiating indoor navigation.

In the code snippet provided below, a function called 'solveTheGrid' is demonstrated. This function invokes the Dijkstra's algorithm and subsequently returns the 'shortestPathList', which then generates travel instructions relative to the different directions that the user faces throughout their travel. By automating the generation of directions to a specific location, the system saves time by removing manual labor and enhancing scalability, ultimately improving the overall navigation experience.

3. Indoor Navigation Result Screen

The result screen appears after the engine has successfully calculated the shortest path between the user's starting point and destination. This screen displays the distance between checkpoints and provides a preview of the upcoming paths, offering users additional information to help them reach their desired location. An array and an index counter are utilized to efficiently manage the checkpoint transitions, ensuring a smooth and informative navigation experience.

<div align="center">

**Indoor Navigation Result Screen**
 ![](RackMultipart20230531-1-3m5ncx_html_730761a3c58bdd28.png)
 </div>

4. Accessibility Features

The accessibility features for the mobile application cater to a diverse range of users. These options include audio-based navigation for indoor navigation results, allowing users to choose primary and secondary background colors, and supporting a tertiary background color as well. Furthermore, the app accommodates changes in text color and font size to enhance readability and overall accessibility. These comprehensive features ensure that the mobile application is user-friendly and inclusive for all users.

<div align="center">

**Settings Screen Accessibility Features**
 ![](RackMultipart20230531-1-3m5ncx_html_9efee30ed73a4f02.png)
</div>

5. Visual Designer

The Visual Designer is a web application designed to streamline the creation of floor plans, ensuring scalability. With just a click of a button, users can easily add walls and room locations to their designs. The application also features a testing capability that utilizes the same engine as the mobile. By testing the grid within the Visual Designer, users can be confident that their floor plan will function seamlessly within the mobile application.
<div align="center">

**Web Visual Floor Plan Designer**![](RackMultipart20230531-1-3m5ncx_html_bb24c3b6eb8e650.png)
</div>
