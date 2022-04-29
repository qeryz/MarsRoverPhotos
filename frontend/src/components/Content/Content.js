import { Card, CardActionArea, CardHeader, Avatar, CardMedia, CardContent, Typography, Grid, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


function Content({scrollRef, currentDate, photoData, totalPhotos}) {
    const handleScroll = () => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    return (
        <Grid sx={{ padding: '5rem 0 4rem 0' }} alignItems="center" justifyContent="center" container>
            <Grid item xs={12} sm={9} md={6} >
                <Grid direction='column' container alignItems="center" justifyContent="center" rowSpacing={3}>
                    {photoData[0]?.earth_date === currentDate && // If the date of the data matches today's date, display message
                        <Typography gutterBottom variant='h4' color='white'>
                            Today's Photos
                        </Typography>
                    }
                    {totalPhotos === 0 ? // If no results match queries, display the message
                        <Typography color='white'>
                            No Photos Found.
                        </Typography> : // Else if X amount of results match queries, display the message
                        <Typography gutterBottom variant='subtitle2' color='white'>
                            Fetched {totalPhotos} Total Photos | {photoData.length} Photos For This Page 
                        </Typography>
                    }
                    <div style={{ position: 'sticky', top: '81vh', zIndex:'2' }}>
                        {photoData?.length > 2 && // If total photos on page > 2, display sticky button
                            <div>
                                <IconButton 
                                sx={{ border: '1.3px solid #3399FF97', backgroundColor: 'rgba(0,0,0,0.4)' }} 
                                size='large' 
                                onClick={handleScroll}
                                >
                                    <ArrowUpwardIcon color="white" />
                                </IconButton>
                            </div>
                        }
                    </div>
                    {photoData?.map((post, idx) => ( // Finally, display the photos matching the queries
                        <Grid sx={{ width: '100%' }} item key={post.id}> 
                            <Card sx={{ width: '100%', borderRadius: '10px'}}>
                                    <CardHeader
                                        style={{ textAlign:'left' }}
                                        avatar={
                                        <Avatar
                                        src='https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg'>
                                            RV
                                        </Avatar>
                                        }
                                        title={`Rover: ${post.rover.name}, (Result ${idx + 1} of ${photoData.length})`}
                                        subheader={`Earth Date: ${post.earth_date}, Sol: ${post.sol}`}
                                    />
                                    <CardActionArea onClick={() => window.open(`${post.img_src}`)} >
                                        <CardMedia
                                            component="img"
                                            image={post.img_src}
                                            alt="img"
                                        />
                                    </CardActionArea>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                        {`Camera: ${post.camera.full_name} (${post.camera.name})`}
                                        </Typography>
                                    </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {photoData.length > 0 && <Typography style={{marginTop:'5rem'}} color='white'>End of Results.</Typography>}
                </Grid>
            </Grid>
        </Grid>
    )

};

export default Content;