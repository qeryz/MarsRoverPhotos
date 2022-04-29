import { useState, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Inputs from '../Inputs/Inputs';
import Content from '../Content/Content';
import { CircularProgress } from '@mui/material';


const Container = () => {
    // Dark theme configuration for MUI's UI.
    const darkTheme = createTheme({
        palette: {
        mode: 'dark',
        },
    });

    // Returns current date in YYYY-MM-DD format.
    const getCurrentDate = () => {
        let newDate = new Date();
        let date = newDate.getDate();
        if (date < 10){ // Make date double digits in order to conform with Date input
            date = '0' + String(date);
        }
        let month = newDate.getMonth() + 1;
        if (month < 10){ // Make month double digits in order to conform with Date input
            month = '0' + String(month);
        }
        let year = newDate.getFullYear();

        let formattedDate = year + '-' + month + '-' + date;

        return formattedDate;

    }

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

    const scrollRef = useRef(); // For automatic scroll back to top of the page

    return (
        <ThemeProvider theme={darkTheme}>
            <div ref={scrollRef} />
            <Inputs currentDate={currentDate} setPhotoData={setPhotoData} setIsLoading={setIsLoading} setTotalPhotos={setTotalPhotos}/>
            {isLoading ? <CircularProgress style={{ margin: '3rem' }} /> : (
            <Content scrollRef={scrollRef} currentDate={currentDate} photoData={photoData} totalPhotos={totalPhotos} setTotalPhotos={setTotalPhotos}/>
            )}
        </ThemeProvider>
    );
}

export default Container;
