import { Stack, Select, Box, InputLabel, MenuItem, FormControl, TextField, Button, Typography, Pagination, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { getPhotosPerPage, getTotalPhotos } from '../../api/utils';

const Inputs = ({currentDate, setPhotoData, setIsLoading, setTotalPhotos}) => {
    const [rover, setRover] = useState('curiosity');          // Default rover value set to Curiosity
    const [camera, setCamera] = useState('all');              // Default camera value set to All
    const [page, setPage] = useState(1);                      // Default page value set to 1
    const [solDate, setSolDate] = useState('');               // Default Sol date value set to none
    const [earthDate, setEarthDate] = useState(currentDate);  // Default Earth date value set to current date  

    let [totalPages, setTotalPages] = useState(0);  // Stores total number of pages per queried data.
    const [date, setDate] = useState('');           // Temporary date value to set either Sol or Earth date
    const [minDate, setMinDate] = useState('');     // Minimum date value signifying rover's first day of communication
    const [maxDate, setMaxDate] = useState('');     // Maximum date value signifying rover's last day of communication
    
    const handleChangeRover = (event) => {  // Change Rover Value
      setRover(event.target.value);
    };
  
    const handleChangeCamera = (event) => { // Change Camera Value
      setCamera(event.target.value);
    };

    const handleDateChange = (event) => {  // Distinguish between Sol and Earth Date, set values accordingly
      event.preventDefault();
      if (date.includes('-')){
        setEarthDate(date);
        setSolDate('');
      } else {
        setSolDate(date);
        setEarthDate('');
      }
    };

    const handleChangePage = (event, value) => {  // Change page value via pagination's UI
      setPage(value);
    };

    const roverDateRange = () => {  // Set min-max date value user can select based on the rover selected
      if (rover === 'curiosity'){
        setMinDate('2012-08-06');   // First date of communication
        setMaxDate(currentDate);    // Mission still in progress, therefore max is current date
      }
      else if (rover === 'spirit'){
        setMinDate('2004-01-05');   // First date of communication
        setMaxDate('2010-03-21');   // Last date of communication
      }
      else {
        setMinDate('2004-01-26');   // First date of communication
        setMaxDate('2018-06-09');   // Last date of communication
      }
    }

    // The first useEffect function runs on 'initial' loading of photos.
    // Sets the page to 1 since this function should execute only when the
    // rover, camera, and date values are modified. Hence the dependency list
    // excluding the page value.
    useEffect(() => {
      const getData = async () => {
        await getTotalPhotos(rover, camera, solDate, earthDate, setPhotoData, setTotalPhotos, setTotalPages, setIsLoading);
        setPage(1);     // Reset the page number to 1
        console.log('Rover,Camera,Date param dependent getTotalPhotos() called. Page is ' + page);
      }
      setPhotoData(''); // Reset photoData
      getData();        // Call async function
      roverDateRange(); // Set rover min-max date values
    },[rover, camera, solDate, earthDate]);

    // This useEffect function fetches photos when the user changes the page.
    // It executes when the only paramater changed is the page number.
    // Useful for not having to run the getTotalPhotos function every time
    // the user changes the page via pagination
    useEffect(() => {
      const getData = async () => {
        console.log('Page dependent getPhotosPerPage() called. Page is ' + page);
        await getPhotosPerPage(rover, page, camera, solDate, earthDate, setPhotoData, setIsLoading);
      }
      setPhotoData(''); // Reset photoData
      getData();        // Call async function
    },[page]);

    return (
      <Stack direction='column' spacing={3}>
        <Stack direction='row' justifyContent="center" alignItems="center" spacing={3}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel>Select Rover</InputLabel>
              <Select
                value={rover}
                onChange={handleChangeRover}
                label='Select Rover'
              >
                <MenuItem value={'curiosity'}>Curiosity</MenuItem>
                <MenuItem value={'opportunity'}>Opportunity</MenuItem>
                <MenuItem value={'spirit'}>Spirit</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Filter By Camera</InputLabel>
              <Select
                value={camera}
                onChange={handleChangeCamera}
                label="Filter By Camera"
              >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'fhaz'}>FHAZ</MenuItem>
                <MenuItem value={'rhaz'}>RHAZ</MenuItem>
                <MenuItem value={'mast'}>MAST</MenuItem>
                <MenuItem value={'chemcam'}>CHEMCAM</MenuItem>
                <MenuItem value={'mahli'}>MAHLI</MenuItem>
                <MenuItem value={'mardi'}>MARDI</MenuItem>
                <MenuItem value={'navcam'}>NAVCAM</MenuItem>
                <MenuItem value={'pancam'}>PANCAM</MenuItem>
                <MenuItem value={'minites'}>MINITES</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <form onSubmit={handleDateChange}>
          <Stack direction='column' justifyContent="center" alignItems="center" spacing={3}>
            <Stack direction='row' justifyContent="center" alignItems="center" spacing={1}>
              <Box sx={{ maxWidth: 180 }}>
                <TextField 
                label='Search By Sol Date' 
                placeholder="0 - Max" 
                style={{ colorScheme: 'dark' }} 
                type='number'
                InputLabelProps={{ shrink: true }}
                onWheel={(e) => e.target.blur()}
                onChange={(event) => setDate(event.target.value.replace(/[^0-9.]+/g, ""))}
                />
              </Box>
              <Box sx={{ maxWidth: 180 }}>
                <TextField 
                style={{ colorScheme: 'dark' }} 
                type="date" 
                InputProps={{inputProps: { min: minDate, max: maxDate } }} 
                InputLabelProps={{ shrink: true }}
                label='Search By Earth Date' 
                defaultValue={currentDate} 
                onChange={(event) => setDate(event.target.value)}
                />
              </Box>
            </Stack>
            <Box>
              <Button disabled={!date} onClick={handleDateChange} size='small' variant='outlined'>Set Date</Button>
            </Box>
          </Stack>
        </form>
        <Divider style={{ marginTop: '11rem' }}/>
        {totalPages > 0 &&  // If page > 0 (i.e. results were fetched), display the pagination tab
          <Stack style={{ marginTop: '4rem', marginBottom: '0rem' }} justifyContent="center" alignItems="center" spacing={2}>
            <Typography color='white'>Page: {page}</Typography>
            <Pagination 
            sx={{ li: { marginRight: {md: '10px'} } }} 
            variant="outlined" 
            shape='rounded' 
            count={totalPages} 
            page={page} 
            onChange={handleChangePage}
            />
          </Stack>
        }
      </Stack>
    );

}

export default Inputs;
