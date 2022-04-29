# Mars Rover Photos

## Introduction
This application's purpose is to display images gathered by NASA's Curiosity, Opportunity, and Spirit rovers on Mars. 
It allows for a user to select one of the three rovers, select a date they wish to view, and filter by a specific camera on the rover.
The requests are made via NASA's Mars Rover Photo API.

## A Quick Overview of The API and Its Parameters
Each rover has its own set of photos stored in the database, which can be queried separately. There are several possible queries that can be made against the API. Photos are organized by the sol (Martian rotation or day) on which they were taken, counting up from the rover's landing date. A photo taken on Curiosity's 1000th Martian sol exploring Mars, for example, will have a sol attribute of 1000. If instead you prefer to search by the Earth date on which a photo was taken, you can do that, too.

Along with querying by date, results can also be filtered by the camera with which it was taken and responses will be limited to 25 photos per call. Queries that should return more than 25 photos will be split onto several pages, which can be accessed by adding a 'page' param to the query.

Each camera has a unique function and perspective, and they are named as follows:

### Rover Cameras

| Abbreviation  | Camera | Curiosity  | Opportunity | Spirit |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| FHAZ  | Front Hazard Avoidance Camera | ✔ | ✔ | ✔ |
| RHAZ  | Rear Hazard Avoidance Camera | ✔ | ✔ | ✔ |
| MAST  | Mast Camera | ✔ |  |  |
| CHEMCAM  | Chemistry and Camera Complex | ✔ |  |  |
| MAHLI  | Mars Hand Lens Imager | ✔ |  |  |
| MARDI  | Mars Descent Imager | ✔ |  |  |
| NAVCAM  | Navigation Camera | ✔ | ✔ | ✔ |
| PANCAM  | Panoramic Camera | | ✔ | ✔ |
| MINITES  | Miniature Thermal Emission Spectrometer (Mini-TES) | | ✔ | ✔ |



### Querying by Martian sol

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| sol  | int  | none  | sol (ranges from 0 to max found in endpoint)  |
| camera  | string  | all  | see table above for abbreviations  |
| page  | int  | 1  | 25 items per page returned  |
| api_key  | string  | DEMO_KEY  | api.nasa.gov key for expanded usage  |

### Example query
https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=DEMO_KEY

### Querying by Earth date

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| earth_date  | YYYY-MM-DD  | none  | corresponding date on earth for the given sol  |
| camera  | string  | all  | see table above for abbreviations  |
| page  | int  | 1  | 25 items per page returned  |
| api_key  | string  | DEMO_KEY  | api.nasa.gov key for expanded usage  |

### Example query
https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY

## Application Structure
The design structure is as follows:
```
- App.js (The home page component holding the header, description, and Container.js)
  - Container.js (the container of the content)
    - Inputs.js (user input UI components)
    - Content.js (the queried photo content)
```

### App.js
As mentioned, this is considered the 'Home' component. It stores the app's header, description, user input and API photo content.
A pseudocode snippet of the App's structure is as follows:

```
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className='App-body'>
      <Container />
    </div>
  )
}
```

As we see, `App.js` imports the `<Container />` component. As the name suggests, this is where the bulk of the code lies in.

### Container.js
The `Container.js` is what the name suggests, it is a container for the content from the Mars Rover Photos API and user inputs
It's pseudocode structure is represented by the following snippet:

```
function Container() {
  return (
    <ThemeProvider>
      <Inputs />
      <Content />
    </ThemeProvider>
  )
}
```
The two children components `<Inputs />` and `<Content />` are contained here.
Import, MUI (Material-UI)'s `<ThemeProvider>`, wraps around the two components in order to assign a dark theme to them as the application uses 
MUI's UI components for all of the app's inputs, containers, display of photos, etc. 

There are some key variables in the `Container.js` parent component which will be passed down as props to the children components
of `<Inputs />` and `<Content />`.

```
    // This variable stores the current date.
    const currentDate = getCurrentDate();

    // An array used to store photos from the API based on params from user input.
    // We will then pass the setPhotoData as a prop to our Inputs component in
    // order to retrieve an array of API photo data based on a user's input.
    const [photoData, setPhotoData] = useState([]); 

    // Loading State
    const[isLoading, setIsLoading] = useState(false);

    // This variable stores the total number of photos per queried data.
    const [totalPhotos, setTotalPhotos] = useState(0); 
    
    // For automatic scroll back to top of the page
    const scrollRef = useRef(); 
```

### Inputs.js
The `Inputs.js` component's purpose is clear, it is responsible for displaying UI elements.

It displays 5 UI elements: 
Select Rover, Filter By Camera, Search By Sol Date, Search By Earth Date, and a Set Date box.
Followed by a pagination tab for users to navigated pages from the queried data.

Although this component's purpose is for UI, since the majority of the paramater variables lie here it has two important `useEffect()` 
functions with two distinct responsibilities in the process of displaying the queried photo data.

First `useEffect()` : The first useEffect function runs on 'initial' loading of photos. Sets the page to 1 since this function should 
execute only when the rover, camera, and date values are modified. Hence the dependency list excluding the page value.

```
    useEffect(() => {
      const getData = async () => {
        await getTotalPhotos(rover, camera, solDate, earthDate, setPhotoData, setTotalPhotos, setTotalPages, setIsLoading);
        setPage(1);     // Reset the page number to 1
      }
      setPhotoData(''); // Reset photoData
      getData();        // Call async function
      roverDateRange(); // Set rover min-max date values
    },[rover, camera, solDate, earthDate]);
```

Second `useEffect()` : This useEffect function fetches photos only when the user changes the page. It executes when the only paramater changed
is the page number. Useful for not having to run the getTotalPhotos function every time the user changes the page via pagination.

```
    useEffect(() => {
      const getData = async () => {
        await getPhotosPerPage(rover, page, camera, solDate, earthDate, setPhotoData, setIsLoading);
      }
      setPhotoData(''); // Reset photoData
      getData();        // Call async function
    },[page]);
```

It is very important to understand how these two functions differ.
The first `useEffect()` function calls `getTotalPhotos(props)` which is very similar to `getPhotosPerPage(props)`, in fact, it makes the same call.
The difference however, is that it then makes an additional API call with all the parameters except the page param. This fetches ALL the photos
for the selected rover with the user parameters. It may not seem apparent at first, but this process can be very taxing depending on the amount of
photos found in the query. This is great for when there is an initial loading of a query of set params, as this function returns the
amount of photos in the query (which is used to calc the total pages value for pagination). But it is unnecessary to call this function every time
the user changes pages. This is where the second `useEffect()` function come in.

The second `useEffect()` function calls `getPhotosPerPage(props)` only when the page param changes (i.e. a user navigates through pages) which makes 
only one call to the API with all the previous parameters but as well as the the page param. This page param allows the API to quickly only have to 
fetch that certain page in the database. Thus increasing efficiency and enhancing the user experience.


### Content.js
Finally, the `Content.js` component's job is to dynamically map the results from the query.

The process is relatively simple, done so as the following:
```
{photoData?.map((post, idx) => (
  .........
    .....
      ...
      etc
 ))}
```
The mapped queried photos are wrapped in a `<Card />` component imported from the MUI library.


This README should now cover the most essential functions and components. Of course, there is a lot more to the app that is not covered here.
To read and understand more on how the application works, check out the source, where I did my best to comment as much code as I could.
[View the full source](https://github.com/qeryz/MarsRoverPhotos).






