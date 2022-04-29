// This function fetches photos from the Mars Photos API based on user-input params + page param.
export const getPhotosPerPage = async (rover, page, camera, solDate, earthDate, setPhotoData, setIsLoading) => {
    let date = '';
    let cameraFiltered = '';

    if (earthDate !== ''){
        date = `earth_date=${earthDate}`;
    } else if (solDate !== ''){
        date = `sol=${solDate}`;
    }

    if (camera !== 'all'){
        cameraFiltered = `&camera=${camera}`;
    }
    
    try {
        // Start Loading
        setIsLoading(true);

        // Fetch photos with all the params passed
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${date}${cameraFiltered}&page=${page}&api_key=j3PaQ5AwkGZxEaemiJkTg6SpXvsxKOMF1wXGSYp9`);
        let newData = await data.json();
        setPhotoData(newData.photos);

        // End Loading
        setIsLoading(false);
    } catch (error) {
        console.log(error);
    }
}

// This function is identical to getPhotos with the exception of not taking a page param
// (hardcode page=1). It makes a second API call with all the other params w/ no page limit, 
// in order to store the total number of photos fetched per query which will later be used
// to calculate the total number of pages per query.
export const getTotalPhotos = async (rover, camera, solDate, earthDate, setPhotoData, setTotalPhotos, setTotalPages, setIsLoading) => {
    let date = '';
    let cameraFiltered = '';

    if (earthDate !== ''){
        date = `earth_date=${earthDate}`;
    } else if (solDate !== ''){
        date = `sol=${solDate}`;
    }

    if (camera !== 'all'){
        cameraFiltered = `&camera=${camera}`;
    }
    
    try {
        // Start Loading
        setIsLoading(true);

        // This portion of the code will pass all the params except page param, in order to determine total number of photos
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${date}${cameraFiltered}&api_key=j3PaQ5AwkGZxEaemiJkTg6SpXvsxKOMF1wXGSYp9`);
        let newData = await data.json();
        setTotalPhotos(newData.photos.length);
        setTotalPages(calcPages(newData.photos.length));

        // Fetch photos with all the params passed
        data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${date}${cameraFiltered}&page=1&api_key=j3PaQ5AwkGZxEaemiJkTg6SpXvsxKOMF1wXGSYp9`);
        newData = await data.json();
        setPhotoData(newData.photos);

        // End Loading
        setIsLoading(false);
    } catch (error) {
        console.log(error);
    }
}

const calcPages = (totalPhotos) => {
    let totalPages = Math.ceil(totalPhotos / 25);
    return totalPages;
}